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

{% comment %}
Filtered to work I authored (author filter below). Do not quote the query argument;
jekyll-scholar passes quote characters through. bin/check-bibliography.rb fails CI if an
authored entry in papers.bib is not selected by any query on this page.
{% endcomment %}

<h2 class="year">software and datasets</h2>
{% bibliography --query @software[author^=Arnold] %}

</div>
