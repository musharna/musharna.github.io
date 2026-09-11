---
layout: page
title: Taxon3D
description: "A blind-comparison benchmark for AI-generated 3D models of living organisms, judged against reference photographs. Bradley-Terry rankings with confidence intervals."
img: assets/img/taxon3d/card.png
importance: 2
category: research tooling
related_publications: false
---

<div class="mt-2 mb-3">
  <a href="https://taxon3d.org/arena" style="display:inline-block; background:#2ea043; color:#fff; padding:0.35rem 0.85rem; border-radius:6px; text-decoration:none; font-weight:600; margin:0 0.4rem 0.3rem 0;">Vote in the arena</a>
  <a href="https://github.com/musharna/taxon3d" style="display:inline-block; background:#24292f; color:#fff; padding:0.35rem 0.85rem; border-radius:6px; text-decoration:none; font-weight:600; margin:0 0.4rem 0.3rem 0;">Code</a>
  <a href="https://huggingface.co/datasets/musharna/taxon3d-corpus-v1" style="display:inline-block; background:#cc4e0b; color:#fff; padding:0.35rem 0.85rem; border-radius:6px; text-decoration:none; font-weight:600; margin:0 0.4rem 0.3rem 0;">Corpus on HF</a>
</div>

Most evaluation of generative 3D models runs on furniture and game props, where "looks
plausible" is close enough. Organisms are a harder target. A maize plant, a lion's mane
mushroom and a monarch butterfly have self-similar branching, thin surfaces, heavy
self-occlusion, and a correctness criterion that is anatomical rather than aesthetic.

[Taxon3D](https://taxon3d.org) is a Chatbot-Arena-style site for blind comparison of 3D
generators on exactly those subjects. A voter gets a biological task and two anonymised 3D
outputs, rotates and zooms each, and picks the closer one. CC-licensed reference photographs
of the real organism sit above the pair, so the question being asked is fidelity to the
organism, not taste.

<div class="row justify-content-sm-center mt-4">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/taxon3d/card.png" title="The arena" alt="A single-image 3D reconstruction task with reference photographs of the real organism above and two anonymised 3D models side by side for comparison." class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  One comparison: reference photographs above, two anonymised models below. Generator identity is never sent to the browser during voting.
</div>

## What the board covers

Twenty active tasks across plants, fungi and animals; 488 votable models from 52 entrants,
spanning single-image reconstruction, text-to-3D, LLM-authored procedural geometry, and
agentic render-critique-revise loops. Those counts are measured from the live board by a
script and held there by a test.

## What keeps the numbers honest

- **Bradley-Terry with bootstrap 95% confidence intervals.** Models whose intervals overlap
  share a rank, so a statistical tie reads as a tie instead of being ordered by noise.
- **Pairwise significance** by paired bootstrap: the probability that A ranks above B, and
  whether a model actually beats the next rank down.
- **A published bias audit**: left-win rate, tie and both-bad rates, and cross-format
  confounds are measured rather than assumed away.
- **Vote integrity**: gold-standard attention checks score voter trust, low-trust sessions
  are excluded from the fit, and a generator is never matched against itself.
- Each board states how many further votes would separate its next pair of models. At the
  time of writing that is under twenty per board, which is the honest reason to go vote.

The project was called Bio 3D Arena until August 2026. The name collided with the bio3d R
package and with Arena3D, so it was renamed; the old host and repository path still
resolve.

---

<div style="font-size:0.92em;">
<strong>Archived and citable</strong>: concept DOI <a href="https://doi.org/10.5281/zenodo.21789280">10.5281/zenodo.21789280</a>.
See the <a href="{{ '/publications/' | relative_url }}">publications</a> page for the full citation.
</div>
