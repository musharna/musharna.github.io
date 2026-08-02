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
  <strong>TL;DR.</strong> A pressed herbarium specimen is a plant that has been folded, broken and taped flat to fit a sheet — and what a reader usually needs from it is its <em>habit</em>, the shape of the whole plant. Over 2018–19 I digitally restored <em>Lobelia</em> specimens in Photoshop — unfolding leaves, rejoining stems, stripping the sheet furniture — and reduced each restored plant to a silhouette: <strong>39 finished silhouettes across 27 species</strong>. Two rules make them restorations rather than illustrations: <strong>nothing is added that was not on the sheet</strong>, and <strong>every plant is scaled from the ruler photographed on its own sheet</strong>. They were later used in print — <strong>Godden et al. 2025</strong> credits them in its acknowledgements.
  <div style="margin-top:0.7rem;">
    <a href="https://doi.org/10.1016/j.ympev.2025.108410" style="display:inline-block; background:#4a5d3a; color:#fff; padding:0.35rem 0.85rem; border-radius:6px; text-decoration:none; font-weight:600; margin-bottom:0.3rem;">📄 The paper they appear in</a>
    <a href="https://doi.org/10.5281/zenodo.21764522" style="display:inline-block; background:#4a5d3a; color:#fff; padding:0.35rem 0.85rem; border-radius:6px; text-decoration:none; font-weight:600; margin-bottom:0.3rem; margin-left:0.4rem;">⬇️ Download the set (CC BY 4.0)</a>
  </div>
</div>

{% include figure.liquid path="assets/img/lobelia/truescale_plate.png" title="Twenty-seven Lobelia species at true scale" alt="Twenty-seven black plant silhouettes in a row on a common baseline, ordered left to right from shortest to tallest, from Lobelia feayana at 14 cm to Lobelia brevifolia at 134 cm, with a 50 cm scale bar." caption="**Every species in the set, at true scale.** One silhouette per species, ordered by height. Each plant was resampled to a single common pixels-per-centimetre using the **10 cm bar drawn into its own file**, so these heights are measured, not styled — from _L. feayana_ at 14 cm to _L. brevifolia_ at 134 cm. Where a species has several restored specimens, the tallest is shown. A composed plate: the plants never stood together, but their relative sizes are real." class="img-fluid rounded z-depth-1" %}

This was undergraduate work at **Kent State University** with **Dr. Andrea Case**, and the earliest piece of my involvement in the lab's _Lobelia_ project — the [automated leaf-measurement work]({{ '/projects/LobeliaLeafMeasurement/' | relative_url }}) came several years later.

A herbarium sheet is not a picture of a plant. It is a plant that has been pressed flat, dried, folded to fit a sheet, mounted with tape and glue, annotated, and then photographed decades later — often with parts overlapping, broken or missing. Reading the **habit** of a species off one takes work. Restoring it digitally and reducing the result to a silhouette turns that work into something a reader takes in at a glance, and makes a set of species directly comparable in a way photographs of sheets never are.

## How they were made

Each silhouette starts as one digitized herbarium sheet and is restored in **Photoshop** before it is ever reduced to an outline. Restoration means putting the plant back into the shape it had before it was pressed:

- **Unfolding.** Leaves pressed back over themselves, or folded to make the plant fit the sheet, are digitally unfolded.
- **Reattaching.** Stems snapped in pressing or handling are rejoined.
- **Removing the furniture.** Labels, tape, mounting strips, annotations and colour cards come out, so what remains is only the plant.

The whole restored plant — not a traced approximation of it — is then converted to a mask, and that mask is the silhouette. The working files keep both stages: a `Raw` document per specimen holding the restoration, and a second holding the silhouette it became.

Two constraints do most of the work, and they are what separate this from illustration:

> **Nothing is added that was not already on the sheet.** No compositing across specimens, no reconstructing an organ from a better example elsewhere, no idealised representative of the species. If a part was missing from that physical sheet, it is missing from its silhouette. Each one is a restoration of a particular plant, not a drawing of a species.

> **Scale comes from the sheet's own ruler.** Every specimen was photographed with a scale bar, and each silhouette carries a **10 cm bar drawn into the file itself**. The set is therefore comparable in true size, and that claim is checkable from the images rather than taken on trust.

Which is why the plate above can exist at all. The individual files are not stored at a common resolution — they run from 30 to 85 pixels per centimetre — so the plate is built by reading each file's own bar and resampling every plant to one shared scale.

**The measurements corroborate the method.** A standard herbarium sheet is about 42 cm tall, yet _L. brevifolia_ restores to 134 cm and _L. apalachicolensis_ to 98 cm. A plant taller than the sheet it is mounted on is exactly what unfolding recovers — the specimen was folded to fit, and the restoration puts it back.

## Explore the set

Every restored specimen, on one centimetre axis. Hover any plant for its species and measured size.

<div style="overflow-x:auto; -webkit-overflow-scrolling:touch; border:1px solid var(--global-divider-color); border-radius:8px;">
  <iframe src="{{ '/assets/plotly/lobelia_silhouette_explorer.html' | relative_url }}"
          title="Interactive true-scale explorer: 39 restored Lobelia specimens on a shared centimetre axis"
          loading="lazy" frameborder="0" scrolling="no"
          style="width:1960px; height:640px; border:0; display:block;">
  </iframe>
</div>
<div class="caption">
All <strong>39</strong> restored specimens, ordered by height, drawn at a single shared scale — <strong>the axes are locked to equal aspect</strong>, so nothing is stretched to fit and the plot is as wide as the plants genuinely are. Scroll sideways to reach <em>L. brevifolia</em>. Species with several restored specimens appear more than once, which is where the within-species spread shows: the three <em>L. cardinalis</em> stand at 24, 47 and 52 cm.
</div>

## Where the specimens came from

The source sheets were kept alongside the artwork, filed by herbarium accession and state — so the collection localities survive even though the specimen photographs themselves are not mine to publish.

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
Collection localities for the <strong>60 source sheets</strong> retained, across <strong>18 states</strong>. Hover a state for its sheets and species. The distribution is the clade's: overwhelmingly eastern, densest in Florida, the Carolinas and the mid-Atlantic, thinning west of the Mississippi. Note the scope — sheets were kept for six species (<em>cardinalis, canbyi, elongata, dortmanna, brevifolia, feayana</em>), so this maps where <em>those</em> specimens were collected, not the whole set.
</div>

## What the set contains

**39 finished silhouettes across 27 species**, made between April 2018 and February 2019, with the working files, a reference image per species, and the source sheets kept alongside them.

Several species are represented by more than one restored specimen — four of _L. anatina_, three each of _L. appendiculata_, _L. cardinalis_ and _L. nuttallii_ — which is what makes the within-species spread visible: the three _L. cardinalis_ specimens restore to 24, 47 and 52 cm.

The set also reaches past _Lobelia_ sect. _Lobelia_ itself, including _L. amoena_, _L. berlandieri_, _L. boykinii_ and _L. fenestralis_.

Provenance is kept with the artwork: the source sheets are filed by **herbarium accession and state** — `LSU00039459Louisiana`, `USMS_000008523Mississippi`, `IND-0119684Mississippi` — so each silhouette can be traced back to the physical specimen it restores.

## Where they ended up

The silhouettes are credited in the phylogenomic paper from the lab's programme {% cite godden2025lobelia %}. Its acknowledgements read:

> We thank Jaret Arnold for his artistic contributions to the plant silhouettes shown in Fig. …

They form the **morphology panel of the phylogeny figure** — a band of plants standing on a shared ground line, each aligned over its own clade, between the phylogram above and the collapsed-clade cladogram below. The paper describes them as illustrating general plant morphological patterns in a phylogenetic context.

Which is the arrangement the true-scale rule was for. At the tips of a tree, one species reading knee-high beside another reading waist-high is the comparison the figure is making, not styling.

Worth being precise about the sequence: this artwork **predates the grant it is usually associated with**. The silhouettes were finished by early 2019; NSF award DEB-2015606 began in September 2020. They were made first and drawn on later.

The same set has also been arranged for talks:

{% include figure.liquid path="assets/img/lobelia/lobelia_silhouettes.jpg" title="The silhouette set composed for a talk" alt="A row of dark indigo plant silhouettes on a warm tan background, each a whole Lobelia specimen with stem, leaves and roots, standing on a common ground line." caption="A presentation composition of the same set — recoloured, and arranged on a shared ground line for a slide rather than for a journal page. For a long stretch this was the only surviving piece of the project, before the originals were recovered." class="img-fluid rounded z-depth-1" %}

## Archived, and free to use

The full set is deposited on Zenodo under **CC BY 4.0** — the 39 silhouettes at their original resolution, the true-scale plate, a per-file manifest of species and measured dimensions, and a species-level record of the source sheets:

> **Arnold, J. (2026).** _Lobelia silhouettes: digitally restored whole-plant outlines from herbarium specimens (2018–2019)._ Zenodo. [10.5281/zenodo.21764522](https://doi.org/10.5281/zenodo.21764522)

Use them in a figure, a talk or a key; attribution is the only condition. Each file carries its own 10 cm bar, so they can be placed on a shared scale without guessing — the manifest lists every measured height.

The deposit contains **no specimen photographs and no layered working files**, both of which embed imagery belonging to the holding institutions. What is released is the outline and the restoration work, which are mine.

## A related but separate project

This sits alongside — and is easy to confuse with — the [**automated leaf-measurement work**]({{ '/projects/LobeliaLeafMeasurement/' | relative_url }}): acquiring herbarium sheets at aggregator scale, segmenting individual leaves, and extracting morphometric traits.

Both end in a plant reduced to an outline, which is exactly why they blur together. They differ in intent, and the difference shows up as opposite decisions about scale. **This project is reconstruction for depiction and keeps true size; that one is segmentation for measurement and normalises size away** so that only shape is compared.

## Status

Completed undergraduate work, recorded here rather than maintained. The originals — silhouettes, layered restoration files, per-species references and source sheets — survive on the one machine that was never backed up, and were recovered in August 2026.

**Provenance.** The silhouettes are original work. The specimen images they were restored from are the property of their holding institutions and are not reproduced here.
