---
layout: page
title: Lobelia Silhouettes
description: Digital reconstruction of North American Lobelia from restored herbarium specimens.
img: assets/img/lobelia/lobelia_silhouettes.jpg
# Absolute by requirement: metadata.liquid interpolates this raw into og:image with no
# URL filter, so a relative path would emit a broken social-preview URL.
og_image: https://musharna.github.io/assets/img/lobelia/lobelia_silhouettes.jpg
importance: 1
category: academic research
related_publications: true
---

<div style="border:1px solid var(--global-divider-color); border-left:4px solid #4a5d3a; border-radius:8px; padding:0.9rem 1.1rem; margin:0.3rem 0 1.4rem;">
  <strong>TL;DR.</strong> A pressed herbarium specimen is a plant that has been folded, broken and taped flat to fit a sheet — and what a reader usually needs from it is its <em>habit</em>, the shape of the whole plant. This project digitally restored one specimen per species for all <strong>23 species</strong> of <em>Lobelia</em> sect. <em>Lobelia</em> — unfolding leaves, rejoining stems, stripping the sheet furniture — and reduced each restored plant to a silhouette. Two rules make them restorations rather than illustrations: <strong>nothing is added that was not on the sheet</strong>, and <strong>scale is preserved from the sheet's own ruler</strong>, so the set is comparable in true size. They appear in print — <strong>Godden et al. 2025</strong> credits them in its acknowledgements.
  <div style="margin-top:0.7rem;">
    <a href="https://doi.org/10.1016/j.ympev.2025.108410" style="display:inline-block; background:#4a5d3a; color:#fff; padding:0.35rem 0.85rem; border-radius:6px; text-decoration:none; font-weight:600; margin-bottom:0.3rem;">📄 The paper they appear in</a>
  </div>
</div>

{% include figure.liquid path="assets/img/lobelia/lobelia_silhouettes.jpg" title="Lobelia silhouettes reconstructed from herbarium specimens" alt="A row of dark plant silhouettes on a pale background, each a whole Lobelia specimen showing a slender flowering stem, scattered leaves and a root mass at the base." caption="Whole-plant silhouettes of North American _Lobelia_, restored from digitized herbarium sheets. Each outline is one physical specimen — root mass, stem, cauline leaves and inflorescence — unfolded and rejoined, then reduced to its shape. **Sizes are true to each other**: each plant was scaled from the ruler photographed on its own sheet, so the height differences here are the plants, not the layout." class="img-fluid rounded z-depth-1" %}

Undergraduate work at **Kent State University** with **Dr. Andrea Case**, and the earlier of my two pieces of this project — the [automated leaf-measurement work]({{ '/projects/LobeliaLeafMeasurement/' | relative_url }}) came afterwards. Within the NSF programme [**BEE: Ecological and evolutionary processes affecting the co-existence of close relatives**](https://www.nsf.gov/awardsearch/showAward?AWD_ID=2015606) (DEB-2015606).

A herbarium sheet is not a picture of a plant. It is a plant that has been pressed flat, dried, folded to fit a sheet, mounted with tape and glue, annotated, and then photographed decades later — often with parts overlapping, broken or missing. Reading the **habit** of the species off one takes work. Reconstructing it digitally and rendering the result as a silhouette turns that work into something a reader can take in at a glance, and makes a set of species directly comparable in a way photographs of sheets never are.

## How they were made

Each silhouette starts as one digitized herbarium sheet and is restored in **Photoshop** before it is ever reduced to an outline. Restoration here means putting the plant back into the shape it had before it was pressed:

- **Unfolding.** Leaves pressed back over themselves, or folded to make the plant fit the sheet, are digitally unfolded.
- **Reattaching.** Stems snapped in pressing or handling are rejoined.
- **Removing the furniture.** Labels, tape, mounting strips, annotations, colour cards and the ruler come out, so what remains is only the plant.

Then the whole restored plant — not a traced approximation of it — is converted to a mask, and that mask is the silhouette.

Two constraints do most of the work, and they are what separate this from illustration:

> **Nothing is added that was not already on the sheet.** No compositing across specimens, no reconstructing an organ from a better example elsewhere, no idealised representative of the species. If a part was missing from that physical sheet, it is missing from its silhouette. Each one is a restoration of a particular plant, not a drawing of a species.

> **Scale is preserved from the sheet's own ruler.** Every sheet is photographed with a scale bar, and that is used to size each restored plant correctly. The silhouettes are therefore comparable in **true size** to each other — a tall species reads as tall next to a small one, and the differences in the figure above are real rather than compositional.

That second point is worth holding next to the [leaf-measurement project]({{ '/projects/LobeliaLeafMeasurement/' | relative_url }}), which does the exact opposite: it scales every leaf to a common length so that only _shape_ is compared, and throws absolute size away by construction. Same clade, same herbarium sheets, opposite decision about what to keep — because one is trying to depict a plant and the other is trying to measure a trait.

The set covers **one specimen per species, for all 23 species** of _Lobelia_ sect. _Lobelia_.

## Where they ended up

The silhouettes are credited in the phylogenomic paper from the same programme {% cite godden2025lobelia %}. Its acknowledgements read:

> We thank Jaret Arnold for his artistic contributions to the plant silhouettes shown in Fig. …

In that figure the set stands **above the tips of the phylogeny**, each species' plant aligned over its clade, on a shared ground line. Which is the arrangement the true-scale rule was for: at the tips of a tree, a species reading as knee-high next to one reading as waist-high is not styling, it is the comparison the figure is making. The silhouettes carry habit and stature across the clade in a single band, above the topology that explains them.

The version on this page is a **separate composition** — the same set, laid out and coloured for a talk rather than for the journal.

## A related but separate project

This sits alongside — and is easy to confuse with — the [**automated leaf-measurement work**]({{ '/projects/LobeliaLeafMeasurement/' | relative_url }}) from the same lab project: acquiring herbarium sheets at aggregator scale, segmenting individual leaves, and extracting morphometric traits.

Both end in a plant reduced to an outline, which is exactly why they blur together. They are different in intent: **this project is reconstruction for depiction; that one is segmentation for measurement.** The measurement pipeline's outputs are per-leaf masks used to compute area and width. These are whole-plant habits meant to be looked at.

## Status

Completed undergraduate work, recorded here rather than maintained.

**On the surviving files.** The Photoshop working files are not in either laptop backup — searched by name, by `.psd`, and by surveying every directory holding images. They exist somewhere; they are not there. The render above is what is presently to hand, and the method described here is my own account rather than something reconstructed from recovered files. If the originals turn up, the full 23-species set belongs on this page at true scale.

**Provenance.** The silhouettes are original work. Specimen images they were drawn from are the property of their holding institutions; none are reproduced here.
