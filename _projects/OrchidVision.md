---
layout: page
title: Orchid Vision
description: a computer-vision pipeline for orchid imagination — generation, recognition, and guided hybridization
img: assets/img/orchidgan/orchidgan_card.webp
importance: 0
category: orchid-vision
related_publications: false
---

**Orchid Vision** is an umbrella for the orchid-focused computer-vision work happening in this group. The thread that ties it all together: orchids are an ideal stress test for fine-grained botanical CV, because there are roughly 28,000 accepted species, the long tail is brutal, and most online image labels are wrong in subtle ways (genus right, species off; obsolete synonyms; mistaken cultivar names). Building a model that survives that environment forces you to do unglamorous data-curation work — and that work, more than the architecture, is what determines the model.

Four pieces, built in this order, each one feeding the next:

<div class="row mt-4">
<div class="col-md-6">
  <h4><a href="{{ '/projects/OrchidGAN/' | relative_url }}">OrchidGAN</a> — generative</h4>
  <p>StyleGAN2-ADA fine-tuned on a curated set of <em>Cattleya</em> orchids. Demonstrated that orchid floral morphology is learnable; established a usable latent "morphospace" for sampling, interpolation, and style mixing. Where the program started.</p>
</div>
<div class="col-md-6">
  <h4><a href="{{ '/projects/OrchidCLIP/' | relative_url }}">orchid-clip-v8</a> — recognition</h4>
  <p>Long-tail-aware CLIP fine-tuned from BioCLIP 2 ViT-L/14 on ~2.5M orchid images covering ~10K post-WCVP-dedup species. Beats BioCLIP 2 by +3.8 pp top-1 overall and +14–28 pp on long-tail Pleurothallidinae genera (<em>Stelis</em>, <em>Lepanthes</em>, <em>Bulbophyllum</em>). Released as a frozen image encoder for downstream orchid tasks.</p>
</div>
</div>

<div class="row mt-3">
<div class="col-md-6">
  <h4><a href="{{ '/projects/OrchidVisualizer/' | relative_url }}">Cattleya Hybrid Visualizer</a> — guided hybridization</h4>
  <p>SDXL with per-species LoRAs, prompted from a botanical-genetics phenotype engine that blends parent traits using pigment-channel rules and dominance overrides. Generates plausible images of hypothetical <em>Cattleya</em> hybrids that haven't been bred yet — useful for breeders before they commit two years to a cross.</p>
</div>
<div class="col-md-6">
  <h4>Closing the loop — CLIP-guided rejection sampling</h4>
  <p>The visualizer doesn't always get a generation right; the recognition model is the gate. Each generated image is scored against a per-species prototype centroid; below-threshold samples are rejected and re-sampled. Recognition turns generation into a measurable, improvable loop.</p>
</div>
</div>

## Timeline

- **2024** — OrchidGAN (StyleGAN2-ADA Cattleya morphospace).
- **2025** — Began the orchid scraper / dataset (iNaturalist research-grade, GBIF, Smithsonian NMNH, Wikimedia, Flickr CC, OrchidRoots). Quality-filter pipeline (CLIP-cosine, perceptual-hash dedup, GBIF lineage filter).
- **2026 Q1** — orchid-CLIP v2 → v8. WCVP synonym dedup. Inverse-sqrt long-tail sampler. Per-species prototype centroids over 18,858 binomials.
- **2026 Q2** — Cattleya Hybrid Visualizer (phenotype engine + SDXL + per-species LoRAs). CLIP-guided rejection loop wired in.
- **In progress** — Frozen v8 image encoder release for downstream foundation use; long-tail-aware CLIP paper / TreeOfLife contribution.

## Why orchids

Orchidaceae is one of the two largest plant families and is heavily long-tailed: a handful of cultivated genera (*Phalaenopsis*, *Cattleya*, *Dendrobium*) dominate every public image source, while thousands of species in *Bulbophyllum*, *Stelis*, *Lepanthes*, *Pleurothallis*, and the tropical epiphyte radiation have <30 labeled images on the entire internet combined. Anything that works on orchids works on the whole long tail of plant CV. Anything that fails on orchids was overfit to the head.

That, and orchids are beautiful.

## Code & artifacts

- **Visualizer + recognition model:** [github.com/musharna/orchid-sdxl](https://github.com/musharna/orchid-sdxl) (private during development).
- **Scraper + scraping infrastructure:** part of the same repo, modular (iNat, GBIF, Smithsonian, Wikimedia, Flickr, OrchidRoots adapters).
- **Frozen v8 image encoder:** Hugging Face release in progress.
- **Paper:** in writing — *Long-Tail-Aware CLIP for Orchid Identification*.
