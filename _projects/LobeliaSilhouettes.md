---
layout: page
title: Lobelia Silhouettes
description: Digitally restored herbarium specimens of Lobelia, reduced to true-scale silhouettes.
img: assets/img/lobelia/truescale_plate.png
# Absolute by requirement: metadata.liquid interpolates this raw into og:image with no
# URL filter, so a relative path would emit a broken social-preview URL.
og_image: https://musharna.github.io/assets/img/lobelia/truescale_plate.png
importance: 1
category: academic research
related_publications: true
---

[Paper](https://doi.org/10.1016/j.ympev.2025.108410) · [Download the set (CC BY 4.0)](https://doi.org/10.5281/zenodo.21764522)

Undergraduate work at Kent State University with Dr. Andrea Case, 2018–19. I restored digitized _Lobelia_ herbarium specimens in Photoshop and turned each plant into a silhouette: 39 silhouettes across 27 species. They form the morphology panel of the phylogeny figure (Fig. 2B) in Godden et al. 2025 {% cite godden2025lobelia %}.

{% include figure.liquid path="assets/img/lobelia/truescale_plate.png" title="Twenty-seven Lobelia species at true scale" alt="Twenty-seven black plant silhouettes in a row on a common baseline, ordered left to right from shortest to tallest, from Lobelia feayana at 14 cm to Lobelia brevifolia at 134 cm, with a 50 cm scale bar." caption="All 27 species at true scale, from _L. feayana_ (14 cm) to _L. brevifolia_ (134 cm)." class="img-fluid rounded z-depth-1" %}

## How they were made

For each sheet I unfolded pressed leaves, rejoined broken stems, and removed labels, tape and colour cards, then converted the restored plant to a mask. Nothing was added from other specimens, so a part missing from the sheet is missing from its silhouette. Each file has a 10 cm bar taken from the sheet's own ruler, which is how the plate above puts every plant on one scale.

Heights are those of the mounted specimen, not the species. A sheet only holds what fits on it: the three _L. cardinalis_ are 24–52 cm, against a published 122–152 cm for the species.

<div style="overflow-x:auto; -webkit-overflow-scrolling:touch; border:1px solid var(--global-divider-color); border-radius:8px;">
  <iframe src="{{ '/assets/plotly/lobelia_silhouette_explorer.html' | relative_url }}"
          title="Interactive true-scale explorer: 39 restored Lobelia specimens on a shared centimetre axis"
          loading="lazy" frameborder="0" scrolling="no"
          style="width:1960px; height:640px; border:0; display:block;">
  </iframe>
</div>
<div class="caption">
All 39 specimens on one scale. Hover for species and size; scroll sideways for the tallest.
</div>

## Download

> **Arnold, J. (2026).** _Lobelia silhouettes: digitally restored whole-plant outlines from herbarium specimens (2018–2019)._ Zenodo. [10.5281/zenodo.21764522](https://doi.org/10.5281/zenodo.21764522)

The 39 silhouettes, the plate and a table of heights, under CC BY 4.0. The specimen photographs belong to the herbaria that hold them and are not included.
