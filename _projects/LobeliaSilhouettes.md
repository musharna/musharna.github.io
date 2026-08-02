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
  <strong>TL;DR.</strong> Pressed herbarium specimens are damaged, folded and mounted flat, and what a reader needs from one is usually its <em>shape</em> — the habit of the whole plant. This project reconstructed North American <em>Lobelia</em> digitally from restored herbarium specimens and rendered them as silhouettes. They appear in print: <strong>Godden et al. 2025</strong> credits them in its acknowledgements.
  <div style="margin-top:0.7rem;">
    <a href="https://doi.org/10.1016/j.ympev.2025.108410" style="display:inline-block; background:#4a5d3a; color:#fff; padding:0.35rem 0.85rem; border-radius:6px; text-decoration:none; font-weight:600; margin-bottom:0.3rem;">📄 The paper they appear in</a>
  </div>
</div>

{% include figure.liquid path="assets/img/lobelia/lobelia_silhouettes.jpg" title="Lobelia silhouettes reconstructed from herbarium specimens" alt="A row of dark plant silhouettes on a pale background, each a whole Lobelia specimen showing a slender flowering stem, scattered leaves and a root mass at the base." caption="Whole-plant silhouettes of North American _Lobelia_, reconstructed from digitized herbarium sheets. Each outline is one pressed specimen — flowering stem, cauline leaves and root mass — restored to a readable habit and reduced to its shape." class="img-fluid rounded z-depth-1" %}

Undergraduate work at **Kent State University** with **Dr. Andrea Case**, within the NSF programme [**BEE: Ecological and evolutionary processes affecting the co-existence of close relatives**](https://www.nsf.gov/awardsearch/showAward?AWD_ID=2015606) (DEB-2015606).

A herbarium sheet is not a picture of a plant. It is a plant that has been pressed flat, dried, folded to fit a sheet, mounted with tape and glue, annotated, and then photographed decades later — often with parts overlapping, broken or missing. Reading the **habit** of the species off one takes work. Reconstructing it digitally and rendering the result as a silhouette turns that work into something a reader can take in at a glance, and makes a set of species directly comparable in a way photographs of sheets never are.

## Where they ended up

The silhouettes are credited in the phylogenomic paper from the same programme {% cite godden2025lobelia %}. Its acknowledgements read:

> We thank Jaret Arnold for his artistic contributions to the plant silhouettes shown in Fig. …

## A related but separate project

This sits alongside — and is easy to confuse with — the [**automated leaf-measurement work**]({{ '/projects/LobeliaLeafMeasurement/' | relative_url }}) from the same lab project: acquiring herbarium sheets at aggregator scale, segmenting individual leaves, and extracting morphometric traits.

Both end in a plant reduced to an outline, which is exactly why they blur together. They are different in intent: **this project is reconstruction for depiction; that one is segmentation for measurement.** The measurement pipeline's outputs are per-leaf masks used to compute area and width. These are whole-plant habits meant to be looked at.

## Status

Completed undergraduate work, recorded here rather than maintained.

**On the method.** The working files for this project did not survive — the laptop backup that preserved the measurement pipeline contains none of the reconstruction's source material, and the surviving render is the image above. The methods section this page ought to carry is therefore not written yet, rather than reconstructed from guesswork.

**Provenance.** The silhouettes are original work. Specimen images they were drawn from are the property of their holding institutions; none are reproduced here.
