---
layout: page
title: OrchidCLIP
description: A long-tail-aware CLIP model for fine-grained orchid identification across 5,124 species.
img: assets/img/orchidclip/orchidclip_card.png
importance: 1
category:
related_publications: false
---

**orchid-clip-v8** is a CLIP model fine-tuned from BioCLIP 2 for fine-grained orchid identification. Orchidaceae is one of the largest plant families and one of the most heavily long-tailed domains in biological vision — a handful of cultivated genera dominate every public image source while thousands of tropical-epiphyte species have fewer than 30 labeled images on the entire internet. v8 lifts top-1 accuracy from 0.873 (BioCLIP 2 baseline) to **0.911** on a stratified 4,000-image holdout, with the gains concentrated exactly where they should be: long-tail Pleurothallidinae genera gain +14 to +28 pp.

## Headline

| model              | top-1     | top-5     | genus-top-1 |
| ------------------ | --------- | --------- | ----------- |
| BioCLIP 2          | 0.873     | 0.978     | 0.992       |
| **orchid-clip-v8** | **0.911** | **0.986** | **0.991**   |

The +3.8 pp top-1 lift comes at no cost in genus-top-1, confirming that the gains are real species discrimination within genera, not a coarsening of the decision boundary.

## The long tail is the point

{% include figure.liquid path="assets/img/orchidclip/per_genus.png" title="per-genus top-1 v8 vs BioCLIP 2" caption="Per-genus top-1 accuracy of orchid-clip-v8 vs BioCLIP 2, sorted by Δ. Lift concentrates on long-tail Pleurothallidinae genera." class="img-fluid rounded z-depth-1" %}

| genus           |    n | v8        | BioCLIP 2 | Δ            |
| --------------- | ---: | --------- | --------- | ------------ |
| _Stelis_        |   25 | **0.640** | 0.400     | **+24.0 pp** |
| _Lepanthes_     |   40 | **0.800** | 0.525     | **+27.5 pp** |
| _Bulbophyllum_  |   41 | **0.732** | 0.585     | **+14.6 pp** |
| _Maxillaria_    |   94 | **0.787** | 0.649     | **+13.8 pp** |
| _Pleurothallis_ |  100 | **0.800** | 0.690     | **+11.0 pp** |

The biggest lifts come on the smallest, longest-tailed genera — _Stelis_ (~1,300 species worldwide, n=25 in our holdout) gains +24 pp; _Lepanthes_ (~1,200 species, n=40) gains +27.5 pp. Head genera like _Ophrys_ (n=2,754) gain modestly but never regress.

## What lifted the long tail (and what didn't)

The training pool is 1.14M images covering 5,124 species after WCVP synonym dedup, a previous-generation cosine quality filter, and a `min_species ≥ 3` threshold. The class-frequency distribution is heavily skewed:

{% include figure.liquid path="assets/img/orchidclip/class_freq.png" title="v8 training pool class frequency" caption="Log-log species-frequency distribution of the 1.14M-image v8 training pool. Median species: 23 rows. Floor: 3 rows. 101 species hit the per-species cap of 2,000." class="img-fluid rounded z-depth-1" %}

The recipe that worked:

1. **Inverse-square-root long-tail sampler** — sample each `(binomial, image)` pair with weight ∝ `1/√n_rows_in_class`, with a per-species cap of 2,000. Less aggressive than uniform-by-class (which over-corrects and hurts head accuracy), much more tail-friendly than uniform-by-row.
2. **WCVP 2026 synonym dedup** — of 26,928 unique binomials in the raw label space, 4,504 binomials covering 69,467 image rows resolved to a different _accepted_ name. The largest single confusion in our previous-generation v7 model was _Ophrys fuciflora_ → _Ophrys holosericea_ (29% of all v7 errors), which collapsed entirely under WCVP because they are the same accepted species.
3. **Previous-generation cosine filter** — drop the bottom percentile of training rows by previous-generation image↔binomial cosine. Rows that score poorly against their claimed binomial under a previous orchid-specific model are most likely label errors or off-target images.

Three substantial ablations against this recipe each underperformed:

- **v9** — backbone swap to BioCLIP 2.5-H ViT-H/14 — regressed −2.5 pp top-1.
- **v10** — hierarchical genus-species sampler — regressed on macro-genus (cardinality-blind across genera).
- **v11** — auxiliary genus classification head — lifted genus-top-1 by +0.6 pp but regressed top-1 by −0.7 pp.

The lesson: at this scale, in this domain, the dominant variable is the label distribution. Architectural and auxiliary-objective changes that would help on a balanced dataset can actively hurt when the underlying label space is heavily skewed and noisy.

## Errors are taxonomy-shaped

{% include figure.liquid path="assets/img/orchidclip/phylo_bias.png" title="phylogenetic confusion bias" caption="Observed v8 error distribution across WCVP rank distances vs. a uniform-random null over the 18,858-binomial prototype space. Same-genus errors are 58× more common than chance." class="img-fluid rounded z-depth-1" %}

When v8 _is_ wrong, it's wrong in a structured way. Bucketing errors by WCVP rank distance between the true and predicted class:

| rank distance        | observed |  null | lift over null |
| -------------------- | -------: | ----: | -------------: |
| same genus (d=1)     |    90.1% |  1.6% |        **58×** |
| same tribe (d=2)     |     4.8% | 14.8% |          0.32× |
| same subfamily (d=3) |     2.3% | 20.4% |          0.11× |
| diff subfamily (d=4) |     0.3% | 51.9% |          0.01× |

Errors at d=1 are 58× more common than chance; cross-subfamily mistakes are essentially absent. The right framing for downstream consumers of v8's top-1 prediction is **"this genus, probably this species"** rather than as a hard species label. The model's effective competence is at the genus level, with a residual species-level disambiguation problem in cryptic-species complexes.

## Status

The frozen image encoder is being prepared for public release as a foundation embedding for downstream orchid tasks. A draft paper and the full v9–v11 negative-result ablations are in <a href="https://github.com/musharna/orchid-sdxl">musharna/orchid-sdxl</a>. The cover figure on this page is a UMAP projection of v8 species centroids colored by WCVP subfamily — Cypripedioideae and Vanilloideae form clean islands while the two megadiverse subfamilies (Epidendroideae and Orchidoideae) partially overlap. That overlap is the natural target for the v12 hierarchical-distance-weighted contrastive loss currently in training.
