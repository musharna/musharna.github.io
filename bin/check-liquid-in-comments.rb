#!/usr/bin/env ruby
# frozen_string_literal: true

# Fail the build if an HTML comment contains a Liquid tag that is not wrapped in
# {% raw %}.
#
# Why this exists: Liquid runs BEFORE the HTML is parsed, so it does not treat
# `<!-- ... -->` as inert. A tag written inside a comment as documentation is
# EXECUTED, and its output lands in the page while the comment markers keep the
# surrounding prose invisible.
#
# That is not hypothetical. On 2026-08-07 a comment on _pages/publications.md
# explaining the new author filter quoted a bare bibliography tag as an example.
# Liquid ran it. It fell back to `scholar.query` ("@*") and re-rendered all 13
# bibliography entries -- including four works by other authors that the filter
# had just been written to remove -- underneath the filtered list. The build was
# green, the comment was invisible, and the page was wrong in exactly the way
# the change was supposed to fix.
#
# The failure is silent by construction: a comment that renders nothing and a
# comment that renders an entire bibliography look the same in the source.
#
# Wrapping the comment in {% raw %} ... {% endraw %} is the fix, so that is what
# this checks for.

ROOT = File.expand_path("..", __dir__)
GLOBS = %w[_projects _pages _posts _news _books].map { |d| File.join(ROOT, d, "*.md") }

offenders = []
checked = 0

Dir.glob(GLOBS).sort.each do |path|
  rel = path.delete_prefix("#{ROOT}/")
  text = File.read(path, encoding: "utf-8")
  checked += 1

  # Remove raw blocks first. Anything left is Liquid the renderer will execute,
  # so a comment inside a raw block is correctly not an offender.
  live = text.gsub(/\{%\s*raw\s*%\}.*?\{%\s*endraw\s*%\}/m, "")

  live.scan(/<!--.*?-->/m).each do |comment|
    next unless comment.match?(/\{%|\{\{/)

    tag = comment[/\{%[^%]*%\}|\{\{[^}]*\}\}/]
    line = text[0, text.index(comment).to_i].count("\n") + 1
    offenders << [rel, line, tag.to_s.strip]
  end
end

puts "content files scanned for Liquid in comments: #{checked}"

if offenders.empty?
  puts "\nNo unwrapped Liquid inside HTML comments. Comments render nothing."
  exit 0
end

puts "\nLIQUID INSIDE AN HTML COMMENT (#{offenders.size}):"
offenders.each { |rel, line, tag| puts "  x #{rel}:#{line}  #{tag}" }
puts <<~MSG

  Liquid executes before HTML is parsed, so these tags WILL run and their output
  will land in the page. The comment markers hide the surrounding prose, not the
  tag's output, so the damage is invisible in the source.

  Fix: wrap the comment in {% raw %} ... {% endraw %}, or write the tag without
  its braces.
MSG
exit 1
