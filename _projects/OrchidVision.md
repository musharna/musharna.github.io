---
layout: page
title: Orchid Vision
description: A computer-vision program built on orchids - generation, recognition, and guided hybridization - because the long tail is where fine-grained models actually break.
img: assets/img/orchidgan/orchidgan_card.webp
importance: 1
category: independent research
related_publications: false
---

**Orchid Vision** is the umbrella for the orchid-focused computer-vision work on this site.

Orchids are an unusually hard test for fine-grained botanical vision. WCVP accepts
**over 30,000 species**, making orchids one of the two largest plant families. The distribution
is heavily long-tailed, and online image labels are often wrong in subtle
ways: right genus with the wrong species, obsolete synonyms treated as distinct taxa,
cultivar names standing in for species. Most of the work in this program has gone into
curation rather than architecture.

## Three pieces, built in this order

<div class="row mt-4">
<div class="col-md-6">
  <h3><a href="{{ '/projects/OrchidGAN/' | relative_url }}">OrchidGAN</a> — generative</h3>
  <p>StyleGAN2-ADA fine-tuned on a curated set of <em>Cattleya</em>. It generates plausible
  blooms, and its latent space supports seed sampling, interpolation and style mixing. This is where the program started.</p>
</div>
<div class="col-md-6">
  <h3><a href="{{ '/projects/OrchidCLIP/' | relative_url }}">orchid-clip-v8</a> — recognition</h3>
  <p>A BioCLIP 2 fine-tune for orchid ID: <strong>+7.6 pp top-1 averaged per
  genus</strong> over BioCLIP 2 (0.844 vs 0.768) on a 14-genus holdout, with the largest gains
  on small genera. Telling species within a genus apart remains the hard part.</p>
</div>
</div>

<div class="row mt-3">
<div class="col-md-6">
  <h3><a href="{{ '/projects/OrchidVisualizer/' | relative_url }}">Cattleya Hybrid Visualizer</a> — guided hybridization</h3>
  <p>SDXL plus an ancestry LoRA, prompted from a botanical phenotype engine that blends
  parent traits as independent pigment channels with dominance rules and
  generation-dependent recessive thresholds. Renders an illustration of what a cross
  might look like, years before it flowers.</p>
</div>
</div>

## The through-line

Each piece exists because the previous one exposed a limit.

OrchidGAN could generate plausible blooms but had no notion of _which_ orchid it had
drawn. That called for recognition, so orchid-clip-v8 was trained. It identifies genus
well, but telling species within a genus apart remains hard, so the demo reports a genus
and names a species only when the model is confident.

The visualizer inherits both results. It can generate, but the recognition model cannot
fully referee the output yet, so the phenotype engine carries the botanical constraints
instead of trusting the diffusion model to infer them.

## Data

The corpus behind orchid-clip-v8 was assembled from iNaturalist research-grade
observations, GBIF, the Smithsonian NMNH, Wikimedia Commons, CC-licensed Flickr and
OrchidRoots, then put through a quality-filter pipeline: CLIP-cosine outlier rejection,
perceptual-hash deduplication, and a GBIF lineage filter to catch synonym collapse before it
reached training.

---

<div style="font-size:0.92em;">
<strong>Code:</strong>
<a href="https://github.com/musharna/orchid-clip">orchid-clip</a> ·
<a href="https://github.com/musharna/orchid-hybrid-visualizer">orchid-hybrid-visualizer</a><br>
<strong>Models &amp; demos:</strong>
<a href="https://huggingface.co/musharna/orchid-clip-v8">orchid-clip-v8</a> ·
<a href="https://huggingface.co/spaces/musharna/orchid-genus-id">live genus ID demo</a>
</div>
