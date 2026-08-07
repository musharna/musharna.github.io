#!/usr/bin/env ruby
# frozen_string_literal: true

# Fail the build if any content file's YAML front matter does not parse.
#
# Why this exists: on 2026-08-07 `_projects/MCPServers.md` carried an unquoted
# colon inside its description --
#
#   description: ... let an AI agent run the instrument: plant genomics, ...
#
# -- which is a YAML scanner error. Jekyll does not fail on that. It silently
# discards the ENTIRE front matter, and the page loses two things at once:
#
#   1. its layout, so it deploys as a bare 4 KB <html><body> fragment with no
#      head, no title, no nav, no theme; and
#   2. its membership in `site.projects`, so `where: "category", ...` stops
#      matching it and the "research tooling" heading on /projects/ rendered
#      over an empty card row.
#
# It still returned HTTP 200 the whole time, so the link checker, the a11y
# sweep and the deploy were all green. A 200 is not a rendered page.
#
# Parsed with Psych (Ruby's YAML), deliberately: that is the parser Jekyll
# itself uses, so this agrees with the build by construction rather than by
# approximation.

require "yaml"

ROOT = File.expand_path("..", __dir__)
GLOBS = %w[_projects _pages _posts _news _books].map { |d| File.join(ROOT, d, "*.md") }

broken = []
missing = []
checked = 0

Dir.glob(GLOBS).sort.each do |path|
  rel = path.delete_prefix("#{ROOT}/")
  text = File.read(path, encoding: "utf-8")

  unless text.start_with?("---")
    missing << rel
    next
  end

  # Front matter is everything between the opening --- and the next --- on its
  # own line. Matches Jekyll's own delimiter handling closely enough that a
  # disagreement here would itself be a bug worth seeing.
  terminator = text.index(/^---\s*$/, 3)
  if terminator.nil?
    missing << rel
    next
  end

  front_matter = text[3...terminator]

  begin
    YAML.safe_load(front_matter, permitted_classes: [Date, Time], aliases: true)
    checked += 1
  rescue Psych::Exception => e
    broken << [rel, e.message.lines.first.to_s.strip]
  end
end

puts "front matter parsed OK: #{checked}"

unless missing.empty?
  puts "\nfiles with no front matter (#{missing.size}) - these ship unlayouted:"
  missing.each { |m| puts "  ? #{m}" }
end

if broken.empty?
  puts "\nAll front matter parses. No page will silently lose its layout."
  exit 0
end

puts "\nBROKEN front matter (#{broken.size}):"
broken.each do |rel, msg|
  puts "  x #{rel}"
  puts "      #{msg}"
end
puts "\nJekyll DISCARDS front matter it cannot parse rather than failing, so the"
puts "affected page would deploy with no layout and drop out of its collection."
puts "Most common cause: an unquoted colon-space inside a value. Quote the string."
exit 1
