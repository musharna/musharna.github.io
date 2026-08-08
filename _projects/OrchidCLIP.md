---
layout: page
title: OrchidCLIP
description: A long-tail-aware CLIP model for fine-grained orchid identification across 5,124 species.
img: assets/img/orchidclip/orchidclip_card.png
importance: 2
# Deep dive: page and URL stay live, card comes off the /projects/ grid. Reached
# from the Orchid Vision hub, which links all three. Not in display_categories.
category: orchid deep dive
related_publications: false
---

<div style="border:1px solid var(--global-divider-color); border-left:4px solid #2c5282; border-radius:8px; padding:0.9rem 1.1rem; margin:0.3rem 0 1.4rem;">
  <strong>TL;DR.</strong> <strong>orchid-clip-v8</strong> is a long-tail-aware orchid CLIP model: top-1 <strong>0.911</strong> across 5,124 species, with gains concentrated on the rarest genera. It also ran into a wall. Across <em>six</em> independent extension attempts, <strong>genus structure transfers but within-genus species identity stays locked</strong>. The live demo therefore serves a <em>calibrated genus</em>, naming a species only when the top-1/top-2 margin earns it.
  <div style="margin-top:0.7rem;">
    <a href="https://huggingface.co/spaces/mjarnold/orchid-genus-id" style="display:inline-block; background:#cc4e0b; color:#fff; padding:0.35rem 0.85rem; border-radius:6px; text-decoration:none; font-weight:600; margin:0 0.4rem 0.3rem 0;">🌿 Try the live demo</a>
    <a href="https://huggingface.co/mjarnold/orchid-clip-v8" style="display:inline-block; background:#2c5282; color:#fff; padding:0.35rem 0.85rem; border-radius:6px; text-decoration:none; font-weight:600; margin:0 0.4rem 0.3rem 0;">🤗 Model on HF</a>
    <a href="https://github.com/musharna/orchid-clip" style="display:inline-block; background:#24292e; color:#fff; padding:0.35rem 0.85rem; border-radius:6px; text-decoration:none; font-weight:600; margin-bottom:0.3rem;">💻 Code on GitHub</a>
  </div>
  <div style="margin-top:0.5rem; font-size:0.9em;">
    <strong>On this page:</strong>
    <a href="#the-long-tail-is-the-point">The long tail</a> ·
    <a href="#what-lifted-the-long-tail-and-what-didnt">What lifted it</a> ·
    <a href="#errors-are-taxonomy-shaped">Taxonomy-shaped errors</a> ·
    <a href="#the-embedding-up-close">The embedding</a> ·
    <a href="#can-the-species-gap-be-closed-six-attempts-one-wall">Six attempts, one wall</a> ·
    <a href="#building-around-the-boundary">Try the demo</a> ·
    <a href="#what-finally-moved-the-tail">What moved the tail</a> ·
    <a href="#status">Status &amp; usage</a>
  </div>
</div>

**orchid-clip-v8** is a CLIP model fine-tuned from BioCLIP 2 for fine-grained orchid identification. Orchidaceae is one of the largest plant families and one of the most heavily long-tailed domains in biological vision: a handful of cultivated genera dominate every public image source, while thousands of tropical-epiphyte species have fewer than 30 labeled images on the entire internet. v8 lifts top-1 accuracy from 0.873 (BioCLIP 2 baseline) to **0.911** on a stratified 4,000-image holdout. The gains fall where the training was aimed, on long-tail Pleurothallidinae genera, which gain +14 to +28 pp.

## Headline

| model              | top-1     | top-5     | genus-top-1 |
| ------------------ | --------- | --------- | ----------- |
| BioCLIP 2          | 0.873     | 0.978     | 0.992       |
| **orchid-clip-v8** | **0.911** | **0.986** | **0.991**   |

The +3.8 pp top-1 lift comes at no meaningful cost in genus-top-1 (0.991 vs 0.992, within noise). The gains are therefore real species discrimination within genera: the decision boundary did not simply coarsen.

> **† Which number is the product?** This is a **closed-set** benchmark: each holdout image is ranked (image→text) against only the **547 species that appear in the 4,000-image holdout**. The deployed demo faces the full **open set** of all **18,858** named species, a 34× larger candidate pool, so its species top-1 starts at **0.71** before the abstain buys it back to **0.90**; genus stays reliable (~0.94) on the open set too. (The live demo now ranks each photo against per-species **image centroids** rather than the text table. The open-set rates are essentially unchanged, but a source-expansion pass has since lifted the _starved tail_ well above them; see below.) [How the two compare →](#building-around-the-boundary)

## The long tail is the point

<div class="row justify-content-center mt-3 mb-2">
  <div class="col-12 p-0">
    <iframe src="{{ '/assets/plotly/orchidclip_per_genus.html' | relative_url }}"
            title="Interactive per-genus top-1 accuracy, orchid-clip-v8 vs BioCLIP 2"
            loading="lazy" frameborder="0" scrolling="no"
            style="width:100%; height:580px; border:1px solid var(--global-divider-color); border-radius:8px;">
    </iframe>
  </div>
</div>
<div class="caption">
  Per-genus top-1 accuracy of orchid-clip-v8 vs BioCLIP 2, sorted by long-tail Δ. Hover any bar for the exact accuracies and Δ. Lift concentrates on the smallest, longest-tailed Pleurothallidinae genera.
</div>

| genus           |   n | v8        | BioCLIP 2 | Δ            |
| --------------- | --: | --------- | --------- | ------------ |
| _Stelis_        |  25 | **0.640** | 0.400     | **+24.0 pp** |
| _Lepanthes_     |  40 | **0.800** | 0.525     | **+27.5 pp** |
| _Bulbophyllum_  |  41 | **0.732** | 0.585     | **+14.6 pp** |
| _Maxillaria_    |  94 | **0.787** | 0.649     | **+13.8 pp** |
| _Pleurothallis_ | 100 | **0.800** | 0.690     | **+11.0 pp** |

The biggest lifts come on the smallest, longest-tailed genera. _Stelis_ (~1,300 species worldwide, n=25 in the holdout) gains +24 pp; _Lepanthes_ (~1,200 species, n=40) gains +27.5 pp. Head genera like _Ophrys_ (n=2,754) gain modestly but never regress.

{% include figure.liquid path="assets/img/orchidclip/few_shot_curve.png" title="few-shot data efficiency" alt="A two-by-two grid of line charts comparing orchid-CLIP v8 (left column) with BioCLIP 2 (right), plotting top-1 and macro-genus accuracy against labels per species for three probes. v8's curves start high and stay near a dashed zero-shot ceiling; BioCLIP 2's start far lower and climb steeply." caption="Few-shot adaptation on 190 rare *seen* species, three probes over frozen v8 (left) vs BioCLIP 2 (right). v8's zero-shot (dashed, 0.97) already sits at the ceiling, so extra labels barely help; BioCLIP 2 needs ~25 labels/species to reach where v8 starts." class="img-fluid rounded z-depth-1" %}

## What lifted the long tail (and what didn't)

The training pool is 1.14M images covering 5,124 species after WCVP synonym dedup, a previous-generation cosine quality filter, and a `min_species ≥ 3` threshold. The class-frequency distribution is heavily skewed:

<div class="row justify-content-center mt-3 mb-2">
  <div class="col-md-11 p-0">
    <iframe src="{{ '/assets/plotly/orchidclip_class_freq.html' | relative_url }}"
            title="Interactive log-log species-frequency distribution of the v8 training pool"
            loading="lazy" frameborder="0" scrolling="no"
            style="width:100%; height:470px; border:1px solid var(--global-divider-color); border-radius:8px;">
    </iframe>
  </div>
</div>
<div class="caption">
  Log-log species-frequency of the 1.14M-image v8 training pool — every point is one of 5,124 species; hover for its exact image count. Median 23 rows, floor 3; the orange line is the 2,000-per-species sampler cap that the 101 head species exceed.
</div>

The recipe that worked:

1. **Inverse-square-root long-tail sampler.** Sample each `(binomial, image)` pair with weight ∝ `1/√n_rows_in_class`, with a per-species cap of 2,000. Less aggressive than uniform-by-class (which over-corrects and hurts head accuracy), much more tail-friendly than uniform-by-row.
2. **WCVP 2026 synonym dedup.** Of 26,928 unique binomials in the raw label space, 4,504 binomials covering 69,467 image rows resolved to a different _accepted_ name. The largest single confusion in the previous-generation v7 model was _Ophrys fuciflora_ → _Ophrys holosericea_ (29% of all v7 errors), which collapsed entirely under WCVP because they are the same accepted species.
3. **Previous-generation cosine filter.** Drop the bottom percentile of training rows by previous-generation image↔binomial cosine. Rows that score poorly against their claimed binomial under a previous orchid-specific model are most likely label errors or off-target images.

{% include figure.liquid path="assets/img/orchidclip/synonym_collapse.png" title="WCVP synonym collapse" alt="A horizontal bar chart of the most frequent v7 intra-genus confusion pairs. The top bar, Ophrys fuciflora versus holosericea, is highlighted dark red at 149 errors and dwarfs every other pair, the next largest being 20." caption="The dominant v7 confusion pairs on the 4,000-row holdout. _Ophrys fuciflora_ → _holosericea_ (149 errors) is a WCVP synonym — the same accepted species — so it collapses entirely under the 2026 dedup; resolving synonyms removes the single largest error source before a single training step." class="img-fluid rounded z-depth-1" %}

The dedup holds up both ways. Re-running the holdout in WCVP-_accepted_ label space scores top-1 **0.9145**, essentially identical to the raw-label **0.911**, because collapsing _fuciflora_ → _holosericea_ just surfaces the next cryptic pair (_Ophrys argolica_ → _sphegodes_) beneath it. The residual within-genus confusion therefore reflects real morphology.

Three substantial ablations against this recipe each underperformed:

- **v9**, a backbone swap to BioCLIP 2.5-H ViT-H/14: regressed −2.5 pp top-1.
- **v10**, a hierarchical genus-species sampler: regressed on macro-genus (cardinality-blind across genera).
- **v11**, an auxiliary genus classification head: lifted genus-top-1 by +0.6 pp but regressed top-1 by −0.7 pp.

At this scale, in this domain, the dominant variable is the label distribution. Architectural and auxiliary-objective changes that would help on a balanced dataset can actively hurt when the underlying label space is heavily skewed and noisy.

## Errors are taxonomy-shaped

{% include figure.liquid path="assets/img/orchidclip/phylo_bias.png" title="phylogenetic confusion bias" alt="A grouped bar chart of error fraction against taxonomic distance, comparing observed v8 errors with a uniform-random null. Same-genus errors are 90 percent observed versus near zero under the null, and the pattern inverts at greater distances." caption="Observed v8 error distribution across WCVP rank distances vs. a uniform-random null over the 18,858-species candidate space (the full text-ranking vocabulary). Same-genus errors are 58× more common than chance." class="img-fluid rounded z-depth-1" %}

When v8 _is_ wrong, it's wrong in a structured way. Bucketing errors by WCVP rank distance between the true and predicted class:

| rank distance        | observed |  null | lift over null |
| -------------------- | -------: | ----: | -------------: |
| same genus (d=1)     |    90.1% |  1.6% |        **58×** |
| same tribe (d=2)     |     4.8% | 14.8% |          0.32× |
| same subfamily (d=3) |     2.3% | 20.4% |          0.11× |
| diff subfamily (d=4) |     0.3% | 51.9% |          0.01× |

_(The observed column sums to 97.5% — the remaining 9 of 355 errors fall on predictions with no resolvable WCVP rank distance to the true class.)_

Errors at d=1 are 58× more common than chance; cross-subfamily mistakes are essentially absent. Downstream consumers should read v8's top-1 prediction as **"this genus, probably this species"** rather than as a hard species label. The model's effective competence is at the genus level, with a residual species-level disambiguation problem in cryptic-species complexes.

Which species does v8 actually mix up? Pulling its 355 holdout errors apart, **320 (90%) are within-genus** and only 35 cross a genus boundary. The within-genus mistakes cluster in the cryptic, long-tailed genera the sampler targets, sister species that even specialists separate on subtle floral-segment detail:

| genus           | within-genus errors | rate | an illustrative cryptic pair |
| --------------- | :-----------------: | :--: | ---------------------------- |
| _Maxillaria_    |       19 / 94       | 20%  | _hematoglossa_ → _meleagris_ |
| _Lepanthes_     |       8 / 40        | 20%  | _tachirensis_ → _scopula_    |
| _Pleurothallis_ |      17 / 100       | 17%  | _cordata_ → _erymnochila_    |
| _Encyclia_      |      15 / 101       | 15%  | _tampensis_ → _adenocarpos_  |
| _Oncidium_      |       7 / 57        | 12%  | _sphacelatum_ → _obryzatum_  |
| _Masdevallia_   |       7 / 64        | 11%  | _bonplandii_ → _floribunda_  |

Every pair is two species of the _same_ genus, so the mistake stays inside the genus knot. (The single largest raw within-genus count, _Ophrys fuciflora_ → _holosericea_ at 82, is deliberately left out: it's the WCVP synonym from ["What lifted the long tail"](#what-lifted-the-long-tail-and-what-didnt), the _same accepted species_ mislabeled in the holdout, a labeling artifact rather than a real confusion.)

## The embedding, up close

That taxonomy-shaped error structure is something you can _see_. Below is the same v8 prototype space as the cover figure, made explorable: every point is one of **18,601 species** (its mean v8 image embedding) projected to 2D with UMAP and colored by WCVP subfamily. Hover any point to read off its species, genus, and how many images built the prototype; drag to zoom into a clade.

<div class="row justify-content-center mt-3 mb-2">
  <div class="col-12 p-0">
    <iframe src="{{ '/assets/plotly/orchidclip_umap_subfamily.html' | relative_url }}"
            title="Interactive UMAP of 18,601 orchid-clip-v8 species prototypes colored by WCVP subfamily"
            loading="lazy" frameborder="0" scrolling="no"
            style="width:100%; height:620px; border:1px solid var(--global-divider-color); border-radius:8px;">
    </iframe>
  </div>
</div>
<div class="caption">
  UMAP of all 18,601 v8 species prototypes (per-binomial mean image embedding), colored by WCVP subfamily. Use the <strong>color</strong> dropdown to recolor by tribe — the finer the level, the tighter the knots.
</div>

> **Three species counts, three scopes.** The page carries three numbers because three things are being measured: **5,124** species have ≥3 training images (the holdout-eval space); **18,858** is every species in the shipped gallery the live demo ranks each photo against, now one per-species v8 **image centroid** each (each built from ≥1 photo); **18,601** of those _also_ carry a known orchid subfamily, and those are the points plotted above (a few hundred centroids whose subfamily is empty or non-orchid are dropped from that plot).

Zoom into almost any neighborhood and the points resolve into tight, same-genus knots. The genus level is what v8 has learned to separate. The within-genus species detail that the six extension attempts below all chase is the residual spread _inside_ those knots, and the projection never cleanly pulls it apart.

## Can the species gap be closed? Six attempts, one wall

That "this genus, probably this species" framing raises the obvious question: can the residual species-disambiguation problem be fixed? v8 already shows the embedding organizes the domain hierarchically, so the species detail ought to be reachable with the right extra lever. I ran six independent extension attempts, each from a different mechanism class, each with its own kill-gate. All six landed in the same place: **genus structure transfers and stays decodable; species identity does not.**

| extension lever                                            | genus               | species                      |
| ---------------------------------------------------------- | ------------------- | ---------------------------- |
| a second modality: herbarium scans / written descriptions  | 0.81–0.93           | 0.005 → 0.686, then plateaus |
| more capacity: 2× ViT-H backbone, clade mixture-of-experts | n/a                 | no lever found               |
| interpretability: sparse autoencoder over frozen features  | partial             | 0 of 13 morphology axes      |
| open-set recognition: reject never-seen species            | card holds          | novel-rejection 0.155        |
| generative augmentation: synthesize tail species           | n/a                 | no lift past 2–3 real photos |
| model-free control: classical CV morphology, no v8         | (within-photo only) | cross-modal corr ≈ 0         |

Two are worth spelling out. **A second modality** is the most direct lever: give the model a dried herbarium specimen or a written description per species. It recovers genus cheaply, but within-genus species climbs only from 0.005 to 0.686 as the alignment improves, and there it sticks; neither more capacity nor more data moves it. Each modality separates species _from itself_ (herbarium→herbarium 0.88, photo→photo 0.99), but those axes don't line up across the gap between them.

The **model-free control** is the cleanest. Setting v8 aside entirely, I measured fourteen classical computer-vision features (color clusters, texture, symmetry, aspect ratio) straight off the pixels. Within photos they tell congeneric species apart above chance across all 52 genera tested; across the photo-to-herbarium gap the per-species values correlate at essentially zero on every axis, even for the best-measured species. That locates the wall in the data itself.

{% include figure.liquid path="assets/img/orchidclip/crossmodal_climb.png" title="the cross-modal climb" alt="A line chart across three training stages with two series. Genus top-1 stays roughly flat near 0.81 to 0.93, while species top-1 climbs from 0.005 through 0.077 to 0.686 and then stops short of 0.69." caption="The most direct lever, spelled out. Across three alignment stages the genus signal stays flat near the top while within-genus species top-1 climbs two orders of magnitude — 0.005 → 0.077 → 0.686 — and then stalls below 0.69. The mechanism keeps improving; the species ceiling holds." class="img-fluid rounded z-depth-1" %}

A single failed extension would be a tuning anecdote. Six independent failures, each with its own gate, all landing on the identical _genus-survives / species-locked_ split is evidence about the embedding itself. It also generalizes: this is the fine-grained-taxonomy face of the **modality gap** that contrastive image-text models are known to exhibit.

## Building around the boundary

If the species gap is structural, the useful response is to serve predictions at the granularity the embedding actually earns. The [deployed **Orchid Photo → ID card**](https://huggingface.co/spaces/mjarnold/orchid-genus-id) does that: a zero-training layer reads the margin between the top-1 and top-2 species scores and, when it's too thin, abstains to **"Genus _X_ (species uncertain)"** rather than committing to a confident wrong binomial. That one rule lifts shown-species precision from 0.71 to **0.90** while still naming a species on 57% of photos.

That 0.71 starting point is lower than the **0.911** headline at the top of this page because the two measure different things. The headline is a **closed-set** benchmark, with each image ranked against only the **547 species present in the holdout**. The card faces the full **open set** of all **18,858** named species, a 34× larger candidate pool, so it can confuse a photo with any orchid on Earth rather than with the few hundred in a test split. (The card now ranks against per-species **image centroids** rather than the text table; the open-set species rate is essentially unchanged at ~0.71, while the starved tail is much improved. See [what moved the tail](#what-finally-moved-the-tail), below.) Genus stays reliable either way (~0.94 here); the abstain is what buys species precision back.

The trade-off is adjustable: every point below is one threshold on the top1−top2 margin, sweeping how often the card commits to a species against how often it's right when it does.

<div class="row justify-content-center mt-3 mb-2">
  <div class="col-md-10 p-0">
    <iframe src="{{ '/assets/plotly/orchidclip_risk_coverage.html' | relative_url }}"
            title="Shown-species precision vs coverage — the abstain trade-off"
            loading="lazy" frameborder="0" scrolling="no"
            style="width:100%; height:480px; border:1px solid var(--global-divider-color); border-radius:8px;">
    </iframe>
  </div>
</div>
<div class="caption">
  Risk–coverage for the species-abstain, from the deployed calibration (n=7,137 leakage-safe holdout). The orange star is the live operating point — τ=0.0164, precision 0.90 at 57% coverage; grey at far right is the no-abstain baseline (0.71).
</div>

<strong><a href="https://huggingface.co/spaces/mjarnold/orchid-genus-id">Try it live →</a></strong> Upload an orchid photo; the card names a species when the margin is confident and falls back to the genus when it isn't.

<div class="row justify-content-center mt-2 mb-2">
  <div class="col-12 p-0">
    <iframe src="https://mjarnold-orchid-genus-id.hf.space"
            title="Live orchid genus-ID demo (HuggingFace Space)"
            loading="lazy" frameborder="0"
            style="width:100%; height:900px; border:1px solid var(--global-divider-color); border-radius:8px;">
    </iframe>
  </div>
</div>
<div class="caption">
  The live <a href="https://huggingface.co/spaces/mjarnold/orchid-genus-id">genus-ID Space</a>, embedded. The first request wakes the free CPU Space and loads the ViT-L/14 tower (a few seconds); after that, each photo embeds and ranks against 18,858 species in real time.
</div>

## What finally moved the tail

<div style="border:1px solid rgba(232,89,12,0.35); border-left:4px solid #e8590c; border-radius:8px; background:rgba(232,89,12,0.05); padding:0.9rem 1.1rem; margin:0.5rem 0 1.3rem;">
  <strong style="color:#c54b0a;">The first lever that moved the species wall was the data, not the model.</strong>
  Folding the missing photos into the starved tail lifts <strong>species top-1 from 0.16 to 0.50</strong> and <strong>genus from 0.64 to 0.81</strong> on those species, a 3× species gain, while overall accuracy holds flat. The live card now ranks against that expanded image-centroid gallery.
</div>

<div class="row justify-content-center mt-3 mb-2">
  <div class="col-md-9 p-0">
    <iframe src="{{ '/assets/plotly/orchidclip_tail_coverage.html' | relative_url }}"
            title="Starved-tail photo coverage before vs after the source-expansion"
            loading="lazy" frameborder="0" scrolling="no"
            style="width:100%; height:440px; border:1px solid var(--global-divider-color); border-radius:8px;">
    </iframe>
  </div>
</div>
<div class="caption">
  Photos per species for the 3,597 starved-tail species, before and after the source-expansion. Mass drains out of the 1–2-photo bin into 3–30 — the coverage the within-genus signal was starved of (median 2 → 5).
</div>

<div class="row justify-content-center mt-3 mb-2">
  <div class="col-md-10 p-0">
    <iframe src="{{ '/assets/plotly/orchidclip_tail_sources.html' | relative_url }}"
            title="Net-new tail images by source"
            loading="lazy" frameborder="0" scrolling="no"
            style="width:100%; height:520px; border:1px solid var(--global-divider-color); border-radius:8px;">
    </iframe>
  </div>
</div>
<div class="caption">
  Where the 27,770 net-new images came from. Three homogeneous catalogs (New Guinea, Epidendra, OrchidWeb) were scraped but <em>discarded</em>: standardized rendering drags centroids off the field-photo manifold and hurts accuracy.
</div>

Six embedding-side levers couldn't move within-genus species identity, but part of the wall sits in the _inputs_. The deepest-tail species are starved: the corpus carries a median of ~2 photos for them, too few to pin a stable centroid. A targeted **source-expansion** pass, drawing on vendor, captive, and curated photo sources the iNaturalist-dominated corpus misses, feeds those species the views they lacked, and the deployed card ranks against the expanded image-centroid gallery.

This cuts against a purely architectural reading of the wall. Where the embedding is finally fed enough views of a rare species, it _can_ separate it; the six levers stalled because they re-tuned the model rather than its inputs. Two caveats. Blending helps _only_ the starved species: pooling the same sources into already-well-photographed species _regresses_ them (catalog-style images drag a healthy centroid off the field-photo manifold), so the deploy blends the thin tail and leaves the rest untouched. And the genuinely-unphotographed deep tail still resists, which is a data-collection problem rather than a modeling one.

## Status

The frozen v8 image encoder is released on HuggingFace as <a href="https://huggingface.co/mjarnold/orchid-clip-v8"><code>mjarnold/orchid-clip-v8</code></a> (MIT), a foundation embedding for downstream orchid tasks, and the abstain-gated genus-ID card runs as a live Space at <a href="https://huggingface.co/spaces/mjarnold/orchid-genus-id"><code>mjarnold/orchid-genus-id</code></a>. The full extension program above, six mechanism classes with their kill-gates plus the v9–v11 ablations, is written up as a negative-results manuscript, _"Genus Transfers, Species Doesn't: A Mechanism-Invariant Boundary in a Fine-Grained Taxonomic Embedding."_ The interactive UMAP above projects those v8 species centroids colored by WCVP subfamily. Cypripedioideae and Vanilloideae form clean islands while the two megadiverse subfamilies (Epidendroideae and Orchidoideae) partially overlap, and that overlap is where the within-genus species ceiling lives.

### Where it works, and where it doesn't

Every benchmark here is on an **iNaturalist-dominated** holdout, and v8 inherits that distribution. On other in-situ _photo_ sources it degrades only mildly: OrchidRoots, Tree-of-Life, and Flickr cohorts lose **−0.10 to −0.11** top-1, with genus largely intact. But on **botanically-curated archives** heavy with herbarium specimens and illustrations (IOSPE, POWO) it **collapses**: top-1 falls to **0.14–0.19** and even _genus_ drops to ~0.55. The within-genus species wall documented above is a property of field _photographs_; herbarium and illustration imagery is a separate, larger modality gap, and exactly the second-modality lever in the six-attempt table. Heads built on v8 inherit this: deploy it on field photos, not on scanned plates.

### Using v8 as an embedding

`orchid-clip-v8` is an [open_clip](https://github.com/mlfoundations/open_clip) checkpoint (ViT-L/14, fine-tuned on top of BioCLIP 2). Loading it and embedding a photo is a few lines:

```python
# pip install open_clip_torch huggingface_hub torch pillow
import torch, open_clip
from huggingface_hub import snapshot_download
from PIL import Image

ckpt = snapshot_download("mjarnold/orchid-clip-v8")          # model_config.json + open_clip_pytorch_model.bin
model, _, preprocess = open_clip.create_model_and_transforms("ViT-L-14", pretrained=None)
state = torch.load(f"{ckpt}/open_clip_pytorch_model.bin", map_location="cpu", weights_only=False)
model.load_state_dict(state["state_dict"]); model.eval()     # weights live under state["state_dict"]

img = preprocess(Image.open("orchid.jpg").convert("RGB")).unsqueeze(0)
with torch.no_grad():
    feat = model.encode_image(img)
feat = feat / feat.norm(dim=-1, keepdim=True)                # 768-d, L2-normalized
```

That 768-d feature is the foundation embedding. Cosine-rank it against per-species image centroids or text embeddings for ID, or use it directly for retrieval and downstream heads (bloom-stage, disease, mounting-style). The repo ships [`embed_example.py`](https://huggingface.co/mjarnold/orchid-clip-v8/blob/main/embed_example.py) (with zero-shot scoring against arbitrary species names) and a `sanity_check.py`.

---

<p style="font-size:0.85em; margin-top:1rem;">Last updated June 2026 · <a href="https://huggingface.co/mjarnold/orchid-clip-v8">orchid-clip-v8</a> (MIT) · live demo <a href="https://huggingface.co/spaces/mjarnold/orchid-genus-id">orchid-genus-id</a> · code <a href="https://github.com/musharna/orchid-clip">github.com/musharna/orchid-clip</a>. All accuracies are on a stratified, iNaturalist-dominated holdout; closed-set unless noted.</p>
