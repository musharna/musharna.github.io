---
layout: page
title: OrchidCLIP
description: A long-tail-aware CLIP model for fine-grained orchid identification across 5,124 species.
img: assets/img/orchidclip/orchidclip_card.png
importance: 1
category:
related_publications: false
---

<div style="border:1px solid rgba(0,0,0,0.1); border-left:4px solid #2c5282; border-radius:8px; padding:0.9rem 1.1rem; margin:0.3rem 0 1.4rem;">
  <strong>TL;DR.</strong> <strong>orchid-clip-v8</strong> is a long-tail-aware orchid CLIP model — top-1 <strong>0.911</strong> across 5,124 species, gains concentrated on the rarest genera. Its sharper lesson is a wall: across <em>six</em> independent extension attempts, <strong>genus structure transfers but within-genus species identity stays locked</strong>. So rather than guess a binomial, the live demo serves a <em>calibrated genus</em> — naming a species only when the top-1/top-2 margin earns it.
  <div style="margin-top:0.7rem;">
    <a href="https://huggingface.co/spaces/mjarnold/orchid-genus-id" style="display:inline-block; background:#e8590c; color:#fff; padding:0.35rem 0.85rem; border-radius:6px; text-decoration:none; font-weight:600; margin:0 0.4rem 0.3rem 0;">🌿 Try the live demo</a>
    <a href="https://huggingface.co/mjarnold/orchid-clip-v8" style="display:inline-block; background:#2c5282; color:#fff; padding:0.35rem 0.85rem; border-radius:6px; text-decoration:none; font-weight:600; margin-bottom:0.3rem;">🤗 Model on HF</a>
  </div>
  <div style="margin-top:0.5rem; font-size:0.9em;">
    <strong>On this page:</strong>
    <a href="#the-long-tail-is-the-point">The long tail</a> ·
    <a href="#errors-are-taxonomy-shaped">Taxonomy-shaped errors</a> ·
    <a href="#the-embedding-up-close">The embedding</a> ·
    <a href="#can-the-species-gap-be-closed-six-attempts-one-wall">Six attempts, one wall</a> ·
    <a href="#building-around-the-boundary-not-against-it">Try the demo</a>
  </div>
</div>

**orchid-clip-v8** is a CLIP model fine-tuned from BioCLIP 2 for fine-grained orchid identification. Orchidaceae is one of the largest plant families and one of the most heavily long-tailed domains in biological vision — a handful of cultivated genera dominate every public image source while thousands of tropical-epiphyte species have fewer than 30 labeled images on the entire internet. v8 lifts top-1 accuracy from 0.873 (BioCLIP 2 baseline) to **0.911** on a stratified 4,000-image holdout, with the gains concentrated exactly where they should be: long-tail Pleurothallidinae genera gain +14 to +28 pp.

## Headline

| model              | top-1     | top-5     | genus-top-1 |
| ------------------ | --------- | --------- | ----------- |
| BioCLIP 2          | 0.873     | 0.978     | 0.992       |
| **orchid-clip-v8** | **0.911** | **0.986** | **0.991**   |

The +3.8 pp top-1 lift comes at no cost in genus-top-1, confirming that the gains are real species discrimination within genera, not a coarsening of the decision boundary.

## The long tail is the point

<div class="row justify-content-center mt-3 mb-2">
  <div class="col-12 p-0">
    <iframe src="{{ '/assets/plotly/orchidclip_per_genus.html' | relative_url }}"
            title="Interactive per-genus top-1 accuracy, orchid-clip-v8 vs BioCLIP 2"
            loading="lazy" frameborder="0" scrolling="no"
            style="width:100%; height:580px; border:1px solid rgba(0,0,0,0.08); border-radius:8px;">
    </iframe>
  </div>
</div>
<div class="caption">
  Per-genus top-1 accuracy of orchid-clip-v8 vs BioCLIP 2, sorted by long-tail Δ. Hover any bar for the exact accuracies and Δ. Lift concentrates on the smallest, longest-tailed Pleurothallidinae genera.
</div>

| genus           |    n | v8        | BioCLIP 2 | Δ            |
| --------------- | ---: | --------- | --------- | ------------ |
| _Stelis_        |   25 | **0.640** | 0.400     | **+24.0 pp** |
| _Lepanthes_     |   40 | **0.800** | 0.525     | **+27.5 pp** |
| _Bulbophyllum_  |   41 | **0.732** | 0.585     | **+14.6 pp** |
| _Maxillaria_    |   94 | **0.787** | 0.649     | **+13.8 pp** |
| _Pleurothallis_ |  100 | **0.800** | 0.690     | **+11.0 pp** |

The biggest lifts come on the smallest, longest-tailed genera — _Stelis_ (~1,300 species worldwide, n=25 in our holdout) gains +24 pp; _Lepanthes_ (~1,200 species, n=40) gains +27.5 pp. Head genera like _Ophrys_ (n=2,754) gain modestly but never regress.

{% include figure.liquid path="assets/img/orchidclip/few_shot_curve.png" title="few-shot data efficiency" caption="Few-shot adaptation on rare *seen* species (190 species): top-1 and macro-genus vs labels-per-species for NN-prototype / linear-probe / prompt-init probes over frozen v8 (left) vs BioCLIP 2 (right). v8's zero-shot (dashed, 0.97) already sits at the ceiling — extra per-species labels barely help, because the long-tail signal is already in the embedding; BioCLIP 2 needs ~25 labels/species to approach where v8 starts." class="img-fluid rounded z-depth-1" %}

## What lifted the long tail (and what didn't)

The training pool is 1.14M images covering 5,124 species after WCVP synonym dedup, a previous-generation cosine quality filter, and a `min_species ≥ 3` threshold. The class-frequency distribution is heavily skewed:

<div class="row justify-content-center mt-3 mb-2">
  <div class="col-md-11 p-0">
    <iframe src="{{ '/assets/plotly/orchidclip_class_freq.html' | relative_url }}"
            title="Interactive log-log species-frequency distribution of the v8 training pool"
            loading="lazy" frameborder="0" scrolling="no"
            style="width:100%; height:470px; border:1px solid rgba(0,0,0,0.08); border-radius:8px;">
    </iframe>
  </div>
</div>
<div class="caption">
  Log-log species-frequency of the 1.14M-image v8 training pool — every point is one of 5,124 species; hover for its exact image count. Median 23 rows, floor 3; the orange line is the 2,000-per-species sampler cap that the 101 head species exceed.
</div>

The recipe that worked:

1. **Inverse-square-root long-tail sampler** — sample each `(binomial, image)` pair with weight ∝ `1/√n_rows_in_class`, with a per-species cap of 2,000. Less aggressive than uniform-by-class (which over-corrects and hurts head accuracy), much more tail-friendly than uniform-by-row.
2. **WCVP 2026 synonym dedup** — of 26,928 unique binomials in the raw label space, 4,504 binomials covering 69,467 image rows resolved to a different _accepted_ name. The largest single confusion in our previous-generation v7 model was _Ophrys fuciflora_ → _Ophrys holosericea_ (29% of all v7 errors), which collapsed entirely under WCVP because they are the same accepted species.
3. **Previous-generation cosine filter** — drop the bottom percentile of training rows by previous-generation image↔binomial cosine. Rows that score poorly against their claimed binomial under a previous orchid-specific model are most likely label errors or off-target images.

{% include figure.liquid path="assets/img/orchidclip/synonym_collapse.png" title="WCVP synonym collapse" caption="The dominant v7 confusion pairs on the 4,000-row holdout. _Ophrys fuciflora_ → _holosericea_ (149 errors) is a WCVP synonym — the same accepted species — so it collapses entirely under the 2026 dedup; resolving synonyms removes the single largest error source before a single training step." class="img-fluid rounded z-depth-1" %}

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

## The embedding, up close

That taxonomy-shaped error structure is something you can *see*. Below is the same v8 prototype space as the cover figure, made explorable: every point is one of **18,601 species** — its mean v8 image embedding — projected to 2D with UMAP and colored by WCVP subfamily. Hover any point to read off its species, genus, and how many images built the prototype; drag to zoom into a clade.

<div class="row justify-content-center mt-3 mb-2">
  <div class="col-12 p-0">
    <iframe src="{{ '/assets/plotly/orchidclip_umap_subfamily.html' | relative_url }}"
            title="Interactive UMAP of 18,601 orchid-clip-v8 species prototypes colored by WCVP subfamily"
            loading="lazy" frameborder="0" scrolling="no"
            style="width:100%; height:620px; border:1px solid rgba(0,0,0,0.08); border-radius:8px;">
    </iframe>
  </div>
</div>
<div class="caption">
  Interactive UMAP of all 18,601 orchid-clip-v8 species prototypes (per-binomial mean image embedding), colored by WCVP subfamily. Use the <strong>color</strong> dropdown (top-left) to recolor the same projection by tribe — the finer the level, the tighter the knots. Hover to identify a point; drag to zoom, double-click to reset.
</div>

Zoom into almost any neighborhood and the points resolve into tight, same-genus knots — the genus level is exactly what v8 has learned to separate. The within-genus species detail that the six extension attempts below all chase is the residual spread *inside* those knots, and it is the part the projection never cleanly pulls apart.

## Can the species gap be closed? Six attempts, one wall

That "this genus, probably this species" framing raises the obvious question: the residual species-disambiguation problem — can we *fix* it? v8 already proves the embedding organizes the domain hierarchically, so the species detail ought to be reachable with the right extra lever. We ran six independent extension attempts, each from a different mechanism class, each with its own kill-gate. They converge on one sharp answer: **genus structure transfers, survives, and stays decodable; species identity stalls, collapses, or refuses to be extracted — every single time.**

| extension lever | genus | species |
| --- | --- | --- |
| a second modality — herbarium scans / written descriptions | 0.81–0.93 | 0.005 → 0.686, then plateaus |
| more capacity — 2× ViT-H backbone, clade mixture-of-experts | — | no lever found |
| interpretability — sparse autoencoder over frozen features | partial | 0 of 13 morphology axes |
| open-set recognition — reject never-seen species | card holds | novel-rejection 0.155 |
| generative augmentation — synthesize tail species | — | no lift past 2–3 real photos |
| model-free control — classical CV morphology, no v8 | (within-photo only) | cross-modal corr ≈ 0 |

A few are worth spelling out. **A second modality** is the most direct lever — give the model a dried herbarium specimen or a written description per species. It recovers genus cheaply but within-genus species climbs only from 0.005 to 0.686 as the alignment improves, and there it sticks; neither more capacity nor more data moves it. Each modality separates species *from itself* (herbarium→herbarium 0.88, photo→photo 0.99), but those axes don't line up across the gap between them. The **model-free control** is the cleanest: we threw out v8 entirely and measured fourteen classical computer-vision features — color clusters, texture, symmetry, aspect ratio — straight off the pixels. Within photos they tell congeneric species apart above chance across all 52 genera we tested; across the photo-to-herbarium gap the per-species values correlate at essentially zero on every axis, even for the best-measured species. The wall isn't a quirk of v8's learned features — it's in the data.

{% include figure.liquid path="assets/img/orchidclip/crossmodal_climb.png" title="the cross-modal climb" caption="The most direct lever, spelled out. Across three alignment stages the genus signal stays flat near the top while within-genus species top-1 climbs two orders of magnitude — 0.005 → 0.077 → 0.686 — and then stalls below 0.69. The mechanism keeps improving; the species ceiling holds." class="img-fluid rounded z-depth-1" %}

Six levers, one wall. A single failed extension is a tuning anecdote; six independent failures, each with its own gate, all landing on the identical *genus-survives / species-locked* split is evidence about the embedding itself. And it generalizes: this is the fine-grained-taxonomy face of the **modality gap** that contrastive image-text models are known to exhibit, and no published herbarium-to-field plant system reports clean within-genus species transfer either.

## Building around the boundary, not against it

If the species gap is structural, the right move is to stop pretending it's closed and serve predictions at the granularity the embedding actually earns. The [deployed **Orchid Photo → ID card**](https://huggingface.co/spaces/mjarnold/orchid-genus-id) does exactly that: a zero-training layer reads the margin between the top-1 and top-2 species scores and, when it's too thin, abstains to **"Genus *X* (species uncertain)"** rather than committing to a confident wrong binomial. That one rule lifts shown-species precision from 0.71 to **0.90** while still naming a species on 60% of photos — the genus survivor, bought back as a precision guarantee.

That 0.71 starting point is lower than the **0.911** headline at the top of this page for a reason worth stating plainly: the card ranks each photo against species *text* embeddings — a harder **cross-modal** path than v8's image-to-prototype classification, but the one that lets a single shipped text table cover all 18,858 species. Genus stays reliable either way (~0.94 here); the abstain is what buys species precision back.

That trade-off is the whole story, and you can ride it: every point below is one threshold on the top1−top2 margin, sweeping how often the card commits to a species against how often it's right when it does.

<div class="row justify-content-center mt-3 mb-2">
  <div class="col-md-10 p-0">
    <iframe src="{{ '/assets/plotly/orchidclip_risk_coverage.html' | relative_url }}"
            title="Shown-species precision vs coverage — the abstain trade-off"
            loading="lazy" frameborder="0" scrolling="no"
            style="width:100%; height:480px; border:1px solid rgba(0,0,0,0.08); border-radius:8px;">
    </iframe>
  </div>
</div>
<div class="caption">
  Risk–coverage trade-off for the species-abstain, straight from the deployed calibration (n=7,137 leakage-safe in-vocab holdout). The orange star is the live operating point — margin τ=0.0149, precision 0.90 at 60% coverage; the grey dot at far right is the no-abstain baseline (0.71). Hover any point to read its τ.
</div>

<strong><a href="https://huggingface.co/spaces/mjarnold/orchid-genus-id">Try it live →</a></strong> Upload an orchid photo; the card names a species when the margin is confident and falls back to the genus when it isn't.

<div class="row justify-content-center mt-2 mb-2">
  <div class="col-12 p-0">
    <iframe src="https://mjarnold-orchid-genus-id.hf.space"
            title="Live orchid genus-ID demo (HuggingFace Space)"
            loading="lazy" frameborder="0"
            style="width:100%; height:900px; border:1px solid rgba(0,0,0,0.08); border-radius:8px;">
    </iframe>
  </div>
</div>
<div class="caption">
  The live <a href="https://huggingface.co/spaces/mjarnold/orchid-genus-id">genus-ID Space</a>, embedded. The first request wakes the free CPU Space and loads the ViT-L/14 tower (a few seconds); after that, each photo embeds and ranks against 18,858 species in real time.
</div>

## Status

The frozen v8 image encoder is released on HuggingFace as <a href="https://huggingface.co/mjarnold/orchid-clip-v8"><code>mjarnold/orchid-clip-v8</code></a> (MIT) — a foundation embedding for downstream orchid tasks — and the abstain-gated genus-ID card runs as a live Space at <a href="https://huggingface.co/spaces/mjarnold/orchid-genus-id"><code>mjarnold/orchid-genus-id</code></a>. The full extension program above — six mechanism classes with their kill-gates, plus the v9–v11 ablations — is written up as a negative-results manuscript, _"Genus Transfers, Species Doesn't: A Mechanism-Invariant Boundary in a Fine-Grained Taxonomic Embedding."_ The interactive UMAP above projects those v8 species centroids colored by WCVP subfamily — Cypripedioideae and Vanilloideae form clean islands while the two megadiverse subfamilies (Epidendroideae and Orchidoideae) partially overlap, and that overlap is exactly where the within-genus species ceiling lives.
