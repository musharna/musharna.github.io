#!/usr/bin/env ruby
# frozen_string_literal: true

# Fail the build if a work I authored is in papers.bib but no query on the
# publications page selects it.
#
# Why this exists: /publications/ used to render a bare `{% bibliography %}`,
# which falls back to `scholar.query` in _config.yml -- "@*", every entry in the
# file. papers.bib also holds the works the Lobelia project pages cite via
# {% cite %}, so the page listed Godden et al. 2025, Nicotra et al. 2011,
# Tsukaya 2018 and a GBIF download in the same card format as my own software.
# Filtering to `@software[author^=Arnold]` fixed that.
#
# But the filter introduces the opposite failure, and it is the quiet one: the
# page now renders only the TYPES it names. Add a peer-reviewed @article without
# adding a query for it and the paper simply does not appear. Nothing errors,
# the build is green, the page looks exactly as it should -- an absent section
# and a skipped one are indistinguishable from the outside.
#
# So this checks the direction that has no symptom: every authored entry must be
# selected by some query on the page.
#
# Deliberately stdlib-only (no bibtex-ruby): the guard should run on a bare
# runner without a bundle, for the same reason check-front-matter.rb uses Psych.

ROOT = File.expand_path("..", __dir__)
BIB = File.join(ROOT, "_bibliography", "papers.bib")
PAGE = File.join(ROOT, "_pages", "publications.md")

# Whose name makes an entry "mine". Mirrors scholar.last_name in _config.yml.
AUTHOR = "Arnold"

bib = File.read(BIB, encoding: "utf-8")
page = File.read(PAGE, encoding: "utf-8")

# Strip HTML comments first: the page documents the @article query it does NOT
# yet run, and counting that as coverage would make this guard pass on exactly
# the state it exists to catch.
page_live = page.gsub(/<!--.*?-->/m, "")

# Entry types selected by a {% bibliography %} tag on the page. `@*` covers all.
queried = page_live.scan(/\{%\s*bibliography[^%]*?--query\s+@(\*|\w+)/).flatten.uniq

# A bare {% bibliography %} inherits _config.yml's query, which is "@*".
queried << "*" if page_live.match?(/\{%\s*bibliography\s*%\}/)

# Entries: @type{key, ... } up to the next entry or EOF. Good enough to read the
# type and the author line; this is not a bibtex parser and does not need to be.
entries = bib.scan(/^@(\w+)\s*\{\s*([^,]+),(.*?)(?=^@|\z)/m)

mine = entries.select { |_type, _key, body| body.match?(/^\s*author\s*=.*#{AUTHOR}/i) }
orphans = mine.reject { |type, _key, _body| queried.include?("*") || queried.include?(type) }

puts "authored entries in papers.bib: #{mine.size}"
puts "entry types rendered by #{File.basename(PAGE)}: #{queried.empty? ? '(none)' : queried.join(', ')}"

if orphans.empty?
  puts "\nEvery authored entry is selected by a query on the publications page."
  exit 0
end

puts "\nAUTHORED BUT NOT RENDERED (#{orphans.size}):"
orphans.each { |type, key, _body| puts "  x @#{type}{#{key}}" }
puts <<~MSG

  These are in papers.bib and authored by #{AUTHOR}, but no {% bibliography %}
  query on the publications page selects their type, so they do not appear on
  the live site. This fails silently otherwise: the build stays green and the
  page looks complete.

  Fix: add a section to _pages/publications.md, e.g.

    <h2 class="year">peer-reviewed</h2>
    {% bibliography --query @#{orphans.first[0]}[author^=#{AUTHOR}] %}

  Do NOT quote the query -- jekyll-scholar splits tag arguments with a regex and
  the quote characters end up inside the query, crashing the build.
MSG
exit 1
