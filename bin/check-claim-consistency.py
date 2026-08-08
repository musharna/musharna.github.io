#!/usr/bin/env python3
"""Fail if a corrected claim is still live on any surface this site links to.

Every other guard in this repo stops at the repository boundary. A reader does
not: they click through from a project page to the GitHub README, the model
card, the demo. On 2026-08-08 the OrchidCLIP page was corrected to stop calling
its holdout "stratified" and to lead with the per-genus average -- and both
retracted claims stayed live for a day on the two surfaces the page links to,
one of them understating the result by half. A green build said nothing,
because nothing in CI had ever read those surfaces.

The naive version of this check -- pull every number off the page and grep the
README for it -- cannot discriminate: both surfaces legitimately carry numbers
the other does not, so it would be noise. What actually broke was narrower and
is decidable: a value that has been RETRACTED is still present somewhere. That
predicate fully observes its referent, so the check is a lookup against an
explicit ledger (bin/retractions.json) rather than an inference.

Two properties keep it from going quietly inert:

  * Every entry carries a `required` string that MUST be found. Without it, a
    fetch that returns nothing -- a moved repo, a renamed branch, a throttled
    host -- reads as "the retracted text is absent" and the check passes having
    observed no bytes at all. A negative result needs a positive control.

  * A surface named in the ledger but not discovered by the crawler is a
    FAILURE, not a skip. Otherwise editing link markup silently drops a surface
    from coverage and everything still passes.

Third-party surfaces (open_clip, stabilityai, ...) are ignored: they are linked,
not owned, and their contents are not ours to police.

Usage:
    python3 bin/check-claim-consistency.py
    python3 bin/check-claim-consistency.py --offline-dir path/  # no network
"""

import argparse
import glob
import io
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LEDGER = os.path.join(ROOT, "bin", "retractions.json")
SITE_GLOBS = ["_projects/*.md", "_pages/*.md"]
TIMEOUT = 30
RETRIES = 3
UA = "musharna-claim-consistency/1.0 (+https://musharna.github.io)"

LINK_RE = re.compile(
    r"https?://(?:www\.)?("
    r"github\.com/[\w.-]+/[\w.-]+"
    r"|huggingface\.co/spaces/[\w.-]+/[\w.-]+"
    r"|huggingface\.co/[\w.-]+/[\w.-]+"
    r"|pypi\.org/project/[\w.-]+"
    r")"
)


def surface_name(url):
    """Canonical surface id, or None if the URL is not a content surface."""
    url = url.rstrip("/")
    if url.startswith("github.com/"):
        owner, repo = url.split("/")[1:3]
        return f"github:{owner}/{repo.removesuffix('.git')}"
    if url.startswith("huggingface.co/spaces/"):
        owner, name = url.split("/")[2:4]
        return f"hf-space:{owner}/{name}"
    if url.startswith("huggingface.co/"):
        owner, name = url.split("/")[1:3]
        return f"hf:{owner}/{name}"
    if url.startswith("pypi.org/project/"):
        return f"pypi:{url.split('/')[2]}"
    return None


def fetch_url(name):
    kind, _, path = name.partition(":")
    if kind == "github":
        # HEAD resolves whatever the default branch is called.
        return f"https://raw.githubusercontent.com/{path}/HEAD/README.md"
    if kind == "hf":
        return f"https://huggingface.co/{path}/raw/main/README.md"
    if kind == "hf-space":
        return f"https://huggingface.co/spaces/{path}/raw/main/README.md"
    if kind == "pypi":
        return f"https://pypi.org/pypi/{path}/json"
    raise ValueError(f"no fetch rule for surface {name!r}")


def discover(root):
    """Surfaces linked from the site's own content."""
    found = set()
    for pattern in SITE_GLOBS:
        for path in sorted(glob.glob(os.path.join(root, pattern))):
            text = io.open(path, encoding="utf-8").read()
            for raw in LINK_RE.findall(text):
                name = surface_name(raw)
                if name:
                    found.add(name)
    return found


def read_site(root):
    """The site's own pages, concatenated, as one surface."""
    chunks = []
    for pattern in SITE_GLOBS:
        for path in sorted(glob.glob(os.path.join(root, pattern))):
            rel = os.path.relpath(path, root)
            for i, line in enumerate(
                io.open(path, encoding="utf-8").read().splitlines(), 1
            ):
                chunks.append((f"{rel}:{i}", line))
    return chunks


def http_get(url):
    last = None
    for attempt in range(1, RETRIES + 1):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
                return resp.read().decode("utf-8", "replace")
        except (urllib.error.URLError, urllib.error.HTTPError, OSError) as exc:
            last = exc
            if attempt < RETRIES:
                time.sleep(2 * attempt)
    raise RuntimeError(f"{url}: unreachable after {RETRIES} tries ({last})")


def load_surface(name, root, offline_dir):
    """Return [(location, line)] for a surface, or raise."""
    if name == "site":
        return read_site(root)
    if offline_dir:
        fname = name.replace(":", "__").replace("/", "_") + ".md"
        path = os.path.join(offline_dir, fname)
        if not os.path.exists(path):
            raise RuntimeError(f"offline fixture missing: {path}")
        text = io.open(path, encoding="utf-8").read()
    else:
        text = http_get(fetch_url(name))
    if name.startswith("pypi:"):
        text = json.loads(text)["info"].get("description") or ""
    return [(f"{name}:{i}", ln) for i, ln in enumerate(text.splitlines(), 1)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--offline-dir", help="read surfaces from local fixtures")
    ap.add_argument("--root", default=ROOT)
    args = ap.parse_args()

    ledger = json.load(io.open(LEDGER, encoding="utf-8"))
    owners = set(ledger["owners"])
    entries = ledger["retractions"]

    discovered = discover(args.root)
    owned = {s for s in discovered if s.split(":", 1)[1].split("/")[0] in owners}

    print(f"surfaces linked from site: {len(discovered)} ({len(owned)} owned)")
    for s in sorted(owned):
        print(f"  {s}")
    skipped = sorted(discovered - owned)
    if skipped:
        print(f"not owned, ignored: {', '.join(skipped)}")

    failures = []
    cache = {}

    def surface(name):
        if name not in cache:
            cache[name] = load_surface(name, args.root, args.offline_dir)
        return cache[name]

    for entry in entries:
        eid = entry["id"]
        allow = [re.compile(p) for p in entry.get("allow_if_line_matches", [])]

        # Inertness guard: a ledger surface the crawler never found is a failure.
        for name in entry["surfaces"]:
            if name != "site" and name not in owned:
                failures.append(
                    f"[{eid}] surface {name} is in the ledger but is NOT linked "
                    f"from any site page -- coverage silently dropped, or the "
                    f"link markup changed."
                )

        for name in entry["surfaces"]:
            if name != "site" and name not in owned:
                continue
            try:
                lines = surface(name)
            except RuntimeError as exc:
                failures.append(f"[{eid}] {exc}")
                continue

            for bad in entry["retracted"]:
                for loc, line in lines:
                    if bad in line and not any(a.search(line) for a in allow):
                        failures.append(
                            f"[{eid}] RETRACTED text still live at {loc}\n"
                            f"        found: {bad!r}\n"
                            f"        line:  {line.strip()[:140]}"
                        )

        # Positive control. `required_on` means EVERY listed surface, not any of
        # them: "found somewhere" would let one surface silently lose the corrected
        # value while a sibling kept the check green -- which is the exact failure
        # this script exists to catch. Checking each one also proves each one was
        # really read, so an empty or truncated fetch cannot pass.
        need = entry.get("required")
        if need:
            targets = [
                n
                for n in entry.get("required_on", entry["surfaces"])
                if n == "site" or n in owned
            ]
            if not targets:
                failures.append(
                    f"[{eid}] POSITIVE CONTROL FAILED: no owned surface to check "
                    f"{need!r} against -- this entry observes nothing."
                )
            missing = []
            for name in targets:
                try:
                    if not any(need in ln for _, ln in surface(name)):
                        missing.append(name)
                except RuntimeError as exc:
                    missing.append(f"{name} (unreadable: {exc})")
            if missing:
                failures.append(
                    f"[{eid}] POSITIVE CONTROL FAILED: replacement text {need!r} "
                    f"is missing from {', '.join(missing)}. Either the correction "
                    f"never reached that surface, or the check read nothing there."
                )

    print()
    if failures:
        print(f"FAIL: {len(failures)} problem(s)\n")
        for f in failures:
            print(f"  - {f}")
        print(
            "\nA correction's scope is the CLAIM, not the file. Fix every surface, "
            "or update bin/retractions.json if the claim itself changed."
        )
        return 1

    print(f"OK: {len(entries)} retraction(s) checked, none live on any owned surface.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
