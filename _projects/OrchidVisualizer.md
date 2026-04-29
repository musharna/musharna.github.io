---
layout: page
title: Cattleya Hybrid Visualizer
description: SDXL-based generation of plausible Cattleya orchid hybrids, prompted from a botanical-genetics phenotype engine and gated by a CLIP-trained scorer
img: assets/img/orchidgan/orchidgan_card.webp
importance: 2
category: orchid-vision
related_publications: false
---

Part of the [Orchid Vision]({{ '/projects/OrchidVision/' | relative_url }}) program.

The **Cattleya Hybrid Visualizer** generates images of hypothetical *Cattleya* orchid hybrids — crosses that have not been bred yet — by composing a botanically-grounded text description from each parent's species traits and rendering it with SDXL plus per-species LoRAs. A CLIP-trained recognition model gates each generation, rejecting samples that don't look like the requested cross.

## Why this is interesting

Orchid breeding is slow. A *Cattleya* hybrid takes roughly 4–7 years from cross to flowering. Breeders make decisions about which crosses to attempt based on intuition built up over decades of seeing parents and their offspring. The visualizer is an attempt to make that intuition explicit and queryable: given a hypothetical cross, what would it plausibly look like?

The interesting design question is how to keep generation honest. SDXL on its own will produce a beautiful orchid for any prompt — but it won't necessarily reflect the genetics of the requested parents. The phenotype engine encodes the rules; the recognition model enforces them.

## How it works

```
User picks two species + percentages + optional color forms (Gradio UI)
  → PhenotypeEngine.describe(ancestry, generation, forms)
    → normalize ancestry → look up phenotype_db.json (119 species)
    → apply color-form overrides (AOS variants)
    → suppress recessive traits at generation-dependent threshold
    → weighted merge across pigment / morphology channels
    → apply species-specific dominance overrides
    → compose ~77-token CLIP-optimized description
  → SDXL + LoRA inference (per-species LoRAs, ancestry-weighted)
  → orchid-CLIP scorer rejects below-threshold samples
  → return image + the actual prompt used
```

### The phenotype engine

Pigment chemistry rather than RGB color names. Anthocyanin, carotenoid, and co-pigment are encoded as independent biochemical channels. A magenta *Cattleya* and a yellow *Cattleya* don't blend to orange — they blend to a magenta-and-yellow flower with a mottled pattern, because the underlying pigment pathways are independent.

Generation depth controls recessive-trait suppression: F1 hybrids suppress recessives below 80% representation, F2 below 50%, F3+ below 25%. The formula is `max(25, 80 - (gen-1) * 30)`.

Color-form overrides handle the AOS (American Orchid Society) variant classification — alba, semi-alba, coerulea, flamea, etc. — by directly overriding pigment fields before merging.

The CLIP-optimized description is built around a "macro photograph of a Cattleya hybrid orchid flower" anchor, with lip described before petals (high CLIP weight on early tokens) and the description capped at the 77-token CLIP context window.

### The rejection loop

Each candidate generation is embedded by orchid-clip-v8, then cosine-scored against a per-species prototype centroid built from the training data. Below-threshold samples are rejected and re-sampled. This is what closes the loop between the generative and the recognition halves of Orchid Vision: generation becomes measurable, and the score is itself improvable.

For the rejection-loop scorer specifically, we use prototype-based retrieval over the v11 (auxiliary-head) model rather than the contrastive v8 — on a 216-image audit corpus of generated *Cattleya* images, v11+prototype scored +18.6 pp genus-top-1 over v8+contrastive. Different model for the gate vs. the production identifier.

## What surprised me along the way

- **Larger LoRA training datasets regressed.** The v2 LoRA trained on ~200 hand-curated images outperforms v6, v7, and v8 LoRAs trained on 10–100× more data. The visualizer uses v2 as a global "style anchor" (scale ~0.6) plus per-species LoRAs (total scale ~0.3) weighted by the cross's ancestry.
- **The v2 LoRA has a purple/lavender bias.** Have to suppress it in the negative prompt and emphasize warm colors with `(orange:1.3)` to render *Cattleya aurantiaca* hybrids correctly.
- **fp16 LoRA training NaNs out at this scale.** bf16 or fp32 only.
- **Most of the work isn't the model.** The phenotype engine is ~600 lines of botanical lookup tables and dominance rules, plus a careful CLIP-token budget. That's where the biology lives.

## Code

[github.com/musharna/project-x](https://github.com/musharna/project-x) — `phenotype_engine.py`, `crosses.py`, `phenotype_db.json` (119 species traits), `dominance_rules.json`, `app.py` (Gradio UI).

The 27 named crosses currently supported have parentage verified against the RHS International Orchid Register (13 of 27 had errors before manual verification — RHS is authoritative, not the various aggregator databases).

## Demo

A public Gradio Space is in progress. This page will be updated with the embed when it lands.
