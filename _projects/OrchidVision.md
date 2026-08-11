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
**over 30,000 species**, more than any other plant family, the distribution is heavily
long-tailed, and a large share of online image labels are wrong in subtle, load-bearing
ways: right genus with the wrong species, obsolete synonyms treated as distinct taxa,
cultivar names standing in for species. Most of the work in this program has gone into
curation rather than architecture.

## Three pieces, built in this order

<div class="row mt-4">
<div class="col-md-6">
  <h3><a href="{{ '/projects/OrchidGAN/' | relative_url }}">OrchidGAN</a> — generative</h3>
  <p>StyleGAN2-ADA fine-tuned on a curated set of <em>Cattleya</em>. Established that orchid
  floral morphology is learnable and produced a navigable latent "morphospace" supporting
  seed sampling, interpolation and style mixing. This is where the program started.</p>
</div>
<div class="col-md-6">
  <h3><a href="{{ '/projects/OrchidCLIP/' | relative_url }}">orchid-clip-v8</a> — recognition</h3>
  <p>A long-tail-aware CLIP for fine-grained orchid ID: <strong>+7.6 pp top-1 averaged per
  genus</strong> over the BioCLIP 2 baseline (0.844 vs 0.768), and up to <strong>+28 pp</strong>
  on the rarest. Across six independent attempts, genus structure transfers while
  within-genus species identity stays locked.</p>
</div>
</div>

<div class="row mt-3">
<div class="col-md-6">
  <h3><a href="{{ '/projects/OrchidVisualizer/' | relative_url }}">Cattleya Hybrid Visualizer</a> — guided hybridization</h3>
  <p>SDXL plus an ancestry LoRA, prompted from a botanical phenotype engine that blends
  parent traits as independent pigment channels with dominance rules and
  generation-dependent recessive thresholds. Predicts what a cross would plausibly look
  like, four to seven years before it flowers.</p>
</div>
<div class="col-md-6">
  <h3>Where it goes next: closing the loop</h3>
  <p>The three pieces are not yet a system. The next step is to let recognition
  <em>gate</em> generation: score each generated bloom against a per-species prototype and
  reject the ones that miss, so generation becomes a measurable loop instead of something a
  human eyeballs. That loop is designed but not built.</p>
</div>
</div>

## The through-line

Each piece exists because the previous one exposed a limit.

OrchidGAN showed the morphology was learnable but had no notion of _which_ orchid it had
drawn. That demanded recognition, so orchid-clip-v8 was trained, and it found a ceiling:
genus transfers, species does not. The live demo serves a calibrated genus and names a
species only when the top-1/top-2 margin earns it, so it abstains instead of committing to
a confidently wrong binomial.

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
