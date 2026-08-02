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

<div style="border:1px solid var(--global-divider-color); border-left:4px solid #4a5d3a; border-radius:8px; padding:0.9rem 1.1rem; margin:0.3rem 0 1.4rem;">
  <strong>TL;DR.</strong> A pressed herbarium specimen is a plant folded, broken and taped flat to fit a sheet — and what a reader usually needs from it is its <em>habit</em>, the shape of the whole plant. Over 2018–19 I digitally restored <em>Lobelia</em> specimens in Photoshop and reduced each restored plant to a silhouette: <strong>39 silhouettes across 27 species</strong>, every one scaled from the ruler photographed on its own sheet. <strong>Godden et al. 2025</strong> credits them in its acknowledgements.
  <div style="margin-top:0.7rem;">
    <a href="https://doi.org/10.1016/j.ympev.2025.108410" style="display:inline-block; background:#4a5d3a; color:#fff; padding:0.35rem 0.85rem; border-radius:6px; text-decoration:none; font-weight:600; margin-bottom:0.3rem;">📄 The paper they appear in</a>
    <a href="https://doi.org/10.5281/zenodo.21764522" style="display:inline-block; background:#4a5d3a; color:#fff; padding:0.35rem 0.85rem; border-radius:6px; text-decoration:none; font-weight:600; margin-bottom:0.3rem; margin-left:0.4rem;">⬇️ Download the set (CC BY 4.0)</a>
  </div>
</div>

{% include figure.liquid path="assets/img/lobelia/truescale_plate.png" title="Twenty-seven Lobelia species at true scale" alt="Twenty-seven black plant silhouettes in a row on a common baseline, ordered left to right from shortest to tallest, from Lobelia feayana at 14 cm to Lobelia brevifolia at 134 cm, with a 50 cm scale bar." caption="**Every species in the set, at true scale.** One silhouette per species, ordered by height, each resampled to a common pixels-per-centimetre using the **10 cm bar drawn into its own file** — so these heights are measured, not styled, from _L. feayana_ at 14 cm to _L. brevifolia_ at 134 cm. The plants never stood together, but their relative sizes are real." class="img-fluid rounded z-depth-1" %}

This was undergraduate work at **Kent State University** with **Dr. Andrea Case**, and the earliest piece of my involvement in the lab's _Lobelia_ project — the [automated leaf-measurement work]({{ '/projects/LobeliaLeafMeasurement/' | relative_url }}) came several years later.

## How they were made

Each silhouette starts as one digitized sheet, restored in **Photoshop** before it is reduced to an outline — putting the plant back into the shape it had before pressing:

- **Unfolding.** Leaves pressed back over themselves, or folded to make the plant fit the sheet, are digitally unfolded.
- **Reattaching.** Stems snapped in pressing or handling are rejoined.
- **Removing the furniture.** Labels, tape, mounting strips, annotations and colour cards come out, so what remains is only the plant.

The whole restored plant — not a traced approximation of it — is then converted to a mask, and that mask is the silhouette. Two constraints separate this from illustration:

> **Nothing is added that was not already on the sheet.** No compositing across specimens, no organ borrowed from a better example, no idealised representative. If a part was missing from that sheet, it is missing from its silhouette — each is a restoration of a particular plant, not a drawing of a species.

> **Scale comes from the sheet's own ruler.** Each silhouette carries a **10 cm bar drawn into the file**, so true size is checkable from the images rather than taken on trust.

Which is why the plate above can exist: the files run from 30 to 85 pixels per centimetre, so it is built by reading each bar and resampling to one shared scale.

**One internal check.** A standard sheet is about 42 cm tall, yet _L. brevifolia_ restores to 134 cm and _L. apalachicolensis_ to 98 cm. A plant longer than its sheet had to be folded to fit, which is what unfolding undoes — evidence the restoration does what it claims, and none at all that the mounted plant was complete.

## Explore the set

Every restored specimen, on one centimetre axis. Hover any plant for its species and measured size. The set reaches past _Lobelia_ sect. _Lobelia_ itself, taking in _L. amoena_, _L. berlandieri_, _L. boykinii_ and _L. fenestralis_.

<div style="overflow-x:auto; -webkit-overflow-scrolling:touch; border:1px solid var(--global-divider-color); border-radius:8px;">
  <iframe src="{{ '/assets/plotly/lobelia_silhouette_explorer.html' | relative_url }}"
          title="Interactive true-scale explorer: 39 restored Lobelia specimens on a shared centimetre axis"
          loading="lazy" frameborder="0" scrolling="no"
          style="width:1960px; height:640px; border:0; display:block;">
  </iframe>
</div>
<div class="caption">
All <strong>39</strong> specimens at one shared scale, ordered by height, with <strong>axes locked to equal aspect</strong> so nothing is stretched to fit. Scroll sideways to reach <em>L. brevifolia</em>. Species restored from several sheets appear more than once and need not agree: the three <em>L. cardinalis</em> stand at 24, 47 and 52 cm — a spread between <em>specimens</em>, not a claim about the species.
</div>

## How the set measures against real plants

Because every silhouette is at true scale, the set can be measured. For each I took the share of plant area in the lowest fifth of its own height — high where leaves cluster at the base, low where they climb a stem.

{% include figure.liquid path="assets/img/lobelia/habit_architecture.png" title="Basal concentration against plant height for 39 restored Lobelia specimens" alt="Scatter plot of 39 green points, plant height in centimetres on the x axis from 13 to 134, basal concentration on the y axis from 0.05 to 0.65. The points show no trend; L. dortmanna sits high at 33 cm, L. brevifolia low at 134 cm, L. laxiflora and L. elongata low at moderate heights." caption="Each point is one restored specimen. The spread is wide and does not track plant height (r = −0.22). _L. dortmanna_, the aquatic rosette species of the group, sits near the top, which is at least the right direction." class="img-fluid rounded z-depth-1" %}

**But do they match real plants?** Restored heights against published stature, for the two species I could find a reference for:

| species | restored | published |
| --- | --- | --- |
| _L. siphilitica_ | 61 cm | 46–122 cm — inside |
| _L. cardinalis_ (×3) | 24, 47, 52 cm | 122–152 cm — **far below** |

The disagreement is the more informative. **A herbarium sheet holds what fits on a herbarium sheet** — for a tall species the mounted specimen is often a portion of the plant, or a small individual. So a silhouette faithfully depicts that pressed specimen, not the species, and an outline of a fragment says nothing about how the whole plant was built.

So read the gradient as a description of this set of images, not a result about _Lobelia_: the restorations are faithful to the sheets; the sheets are not always faithful to the plant. (The reference is horticultural and covers 2 of 27 species — indicative too.)

## Where the specimens came from

The source sheets were kept alongside the artwork, filed by **herbarium accession and state** — `LSU00039459Louisiana`, `USMS_000008523Mississippi`, `IND-0119684Mississippi` — so every silhouette traces back to a physical specimen, and the collection localities survive even though the photographs themselves are not mine to publish.

<div class="row justify-content-center mt-3 mb-2">
  <div class="col-12 p-0">
    <iframe src="{{ '/assets/plotly/lobelia_specimen_origins.html' | relative_url }}"
            title="Map of US states the restored Lobelia specimens were collected in"
            loading="lazy" frameborder="0" scrolling="no"
            style="width:100%; height:450px; border:1px solid var(--global-divider-color); border-radius:8px;">
    </iframe>
  </div>
</div>
<div class="caption">
Collection localities for the <strong>60 source sheets</strong> retained, across <strong>18 states</strong>. Hover a state for its sheets and species. The distribution is the clade's — overwhelmingly eastern, densest in Florida, the Carolinas and the mid-Atlantic. Sheets were kept for six species only (<em>cardinalis, canbyi, elongata, dortmanna, brevifolia, feayana</em>), so this maps where <em>those</em> were collected, not the whole set.
</div>

## Where they ended up

The silhouettes are credited in the acknowledgements of the phylogenomic paper from the lab's programme {% cite godden2025lobelia %}, where they form the **morphology panel of the phylogeny figure** — a band of plants on a shared ground line, each aligned over its own clade. Which is the arrangement the true-scale rule was for: at the tips of a tree, one species reading knee-high beside another reading waist-high is the comparison being made, not styling.

Worth being precise about the sequence: this artwork **predates the grant it is usually associated with**. The silhouettes were finished by early 2019; NSF award DEB-2015606 began in September 2020.

The same set has also been arranged for talks:

{% include figure.liquid path="assets/img/lobelia/lobelia_silhouettes.jpg" title="The silhouette set composed for a talk" alt="A row of dark indigo plant silhouettes on a warm tan background, each a whole Lobelia specimen with stem, leaves and roots, standing on a common ground line." caption="The same set recoloured and arranged for a slide. For a long stretch this was the only surviving piece of the project, before the originals were recovered." class="img-fluid rounded z-depth-1" %}

## Archived, and free to use

> **Arnold, J. (2026).** _Lobelia silhouettes: digitally restored whole-plant outlines from herbarium specimens (2018–2019)._ Zenodo. [10.5281/zenodo.21764522](https://doi.org/10.5281/zenodo.21764522)

The 39 originals, the plate, and a manifest of every measured height — **CC BY 4.0**, so use them in a figure, a talk or a key and attribution is the only condition. The deposit holds **no specimen photographs and no layered working files**, both of which embed institutional imagery; what is released is the outline and the restoration work.

## A related but separate project

Both this and the [**automated leaf-measurement work**]({{ '/projects/LobeliaLeafMeasurement/' | relative_url }}) end in a plant reduced to an outline, which is why they blur together — but **this one is reconstruction for depiction and keeps true size; that one is segmentation for measurement and normalises size away**.

## Status

Completed undergraduate work, recorded here rather than maintained. The originals — silhouettes, layered restoration files, references and source sheets — survived on the one machine that was never backed up, and were recovered in August 2026. The silhouettes are my own work; the specimen images they were restored from belong to their holding institutions and are not reproduced here.
