---
layout: page
title: projects
permalink: /projects/
description: Computer vision on the long tail of plant diversity, and the research tooling built along the way.
nav: true
nav_order: 3
# Grid order. `enable_project_categories` was already true in _config.yml, but this
# list was empty and every project had an empty `category:`, so all cards rendered
# as one ungrouped pile — four of five of them orchid.
#
# The three groups separate work by WHERE IT COMES FROM, not by subject:
#   academic research    — lab / grant-funded work (Case lab Lobelia; Wright & Haak lab
#                          work such as auxin and Phelipanche belongs here as it lands)
#   independent research — self-directed research not attached to a lab (the orchid programme)
#   research tooling     — software built to support the above
# "independent" rather than "personal": the orchid work is real research, it just isn't
# lab work, and the label should not read as demoting it.
#
# Only categories LISTED HERE render as cards. That is deliberate: the orchid
# deep-dive pages (OrchidCLIP / OrchidGAN / OrchidVisualizer) carry
# `category: orchid deep dive`, which is absent here, so they keep their pages and
# URLs but come off the grid. Orchid Vision is the hub and already links all three,
# so the grid was duplicating it.
display_categories: [academic research, independent research, research tooling]
horizontal: false
---

<!-- pages/projects.md -->
<div class="projects">
{% if site.enable_project_categories and page.display_categories %}
  <!-- Display categorized projects -->
  {% for category in page.display_categories %}
  <a id="{{ category }}" href=".#{{ category }}">
    <h2 class="category">{{ category }}</h2>
  </a>
  {% assign categorized_projects = site.projects | where: "category", category %}
  {% assign sorted_projects = categorized_projects | sort: "importance" %}
  <!-- Generate cards for each project -->
  {% if page.horizontal %}
  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <!-- Two columns, not al-folio's default three. The grid is per CATEGORY, and the
       categories hold 2 / 1 / 1 cards, so at three columns every single row was
       part-empty: one row of two with a third of it blank, then two rows holding one
       card each against two-thirds white. The right-aligned category heading then sat
       out over that emptiness, far from the card it labelled. At two columns the
       academic-research row fills exactly, the singles leave one gap instead of two,
       and the cards themselves render larger, which suits figure-led thumbnails.
       Revisit if a category ever reaches three. -->
  <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
  {% endfor %}

{% else %}

<!-- Display projects without categories -->

{% assign sorted_projects = site.projects | sort: "importance" %}

  <!-- Generate cards for each project -->

{% if page.horizontal %}

  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
{% endif %}
</div>
