---
layout: page
permalink: /publications/
title: publications
description: Software I maintain, cited by concept DOI. Peer-reviewed publications will appear here as they are published.
nav: true
nav_order: 2
---

<!-- _pages/publications.md -->

<!-- Bibsearch Feature -->

{% include bib_search.liquid %}

<div class="publications">

{% raw %}

<!--
  Filtered to work I actually authored.

  NOTE THE {% raw %} WRAPPER. Liquid runs BEFORE the HTML is parsed, so it does
  not treat an HTML comment as inert -- a tag written here as documentation is
  EXECUTED. The first draft of this comment quoted a bare bibliography tag as an
  example and Liquid ran it, re-rendering all 13 entries invisibly beneath the
  filtered list. The page looked almost right and was not.

  An unfiltered bibliography tag falls back to `scholar.query` in _config.yml,
  which is "@*" -- EVERY entry in papers.bib. That file also holds the works the
  Lobelia project pages cite (Godden et al. 2025, Nicotra et al. 2011, Tsukaya
  2018, a GBIF download), so this page was listing four works by other people in
  the same card format as my own, one of them with no badge at all. On a page
  titled "publications" that reads as claiming them.

  Type alone cannot separate them: a peer-reviewed paper of mine would also be
  @article, exactly like Nicotra and Tsukaya. The author filter is the part
  that distinguishes mine from merely cited.

  DO NOT QUOTE THE QUERY. jekyll-scholar splits tag arguments with a regex
  (utilities.rb:116) and there is no shell to strip the quotes, so --query "@x"
  passes the quote characters into the query itself and the build dies with
  `private method 'select' called for nil`.

  ADDING A PEER-REVIEWED PAPER: add the @article entry to papers.bib, then add
  a heading and a bibliography tag with --query @article[author^=Arnold] above
  the software block. bin/check-bibliography.rb FAILS CI until you do, because
  an authored entry that no query on this page selects is silently invisible --
  which looks identical to not having published it.
-->

{% endraw %}

<h2 class="year">software and datasets</h2>
{% bibliography --query @software[author^=Arnold] %}

</div>
