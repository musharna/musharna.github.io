---
layout: page
title: orchid-clip-v8
description: long-tail-aware CLIP for orchid identification — fine-tuned from BioCLIP 2 on 2.5M images / 10K species
img: assets/img/orchidgan/orchidgan_card.webp
importance: 1
category: orchid-vision
related_publications: false
---

Part of the [Orchid Vision]({{ '/projects/OrchidVision/' | relative_url }}) program.

**orchid-clip-v8** is a CLIP model fine-tuned from BioCLIP 2 (ViT-L/14) on a curated orchid dataset: ~2.5M images / ~10,000 binomials post-WCVP synonym dedup, narrowed to **1.14M images / 5,124 species** after quality, photo, and image↔label cosine filters. It outputs a 768-dimensional L2-normalized image embedding suitable for fine-grained species classification, retrieval, and as a frozen feature extractor for downstream orchid tasks (bloom-stage, disease, mounting style).

## Why this exists

There is no orchid-specific vision foundation model. BioCLIP and BioCLIP 2 are excellent generalists across the tree of life, but they are trained on a label distribution heavily biased toward easy-to-photograph birds, mammals, and herbarium-friendly plants. On orchid long-tail genera — *Stelis*, *Lepanthes*, *Bulbophyllum* — they degrade hard. Most cultivated orchids worldwide are species the foundation models have effectively never seen.

Five training versions in: v2 → v6 → v7 → v8. Earlier versions failed for instructive reasons (curriculum collapse, synonym-confusion floors, head-class oversampling); v8 lands by stacking three small wins on top of the v7 contrastive recipe.

{% include figure.liquid path="assets/img/orchidclip/fig2_class_freq.png" class="img-fluid rounded z-depth-1" alt="Log-log species-frequency distribution of the v8 training pool: 5,124 species, 1.14M rows, median 23 rows/species." caption="Figure 1. The v8 training pool spans four orders of magnitude in per-species sample count (median 23 rows/species; 101 species hit the 2,000-row inverse-sqrt cap). The long tail is where this work earns its keep." %}

## Eval

Clean held-out test, n = 4,000 images, 547 species, stratified hash-bucketed (no train leakage):

| model              | top-1     | top-5     | genus-top-1 |
| ------------------ | --------- | --------- | ----------- |
| BioCLIP 2 baseline | 0.873     | 0.978     | 0.992       |
| **orchid-clip-v8** | **0.911** | **0.986** | **0.991**   |

Per-genus top-1 — the long tail is where v8 actually earns its keep:

| genus           |    n | v8        | BioCLIP 2 | Δ        |
| --------------- | ---: | --------- | --------- | -------- |
| *Stelis*        |   25 | **0.640** | 0.400     | **+24.0 pp** |
| *Lepanthes*     |   40 | **0.800** | 0.525     | **+27.5 pp** |
| *Bulbophyllum*  |   41 | **0.732** | 0.585     | **+14.6 pp** |
| *Maxillaria*    |   94 | **0.787** | 0.649     | **+13.8 pp** |
| *Pleurothallis* |  100 | **0.800** | 0.690     | **+11.0 pp** |
| *Habenaria*     |  232 | **0.922** | 0.845     | **+7.7 pp**  |
| *Masdevallia*   |   64 | **0.859** | 0.781     | **+7.8 pp**  |
| *Prosthechea*   |  145 | **0.890** | 0.855     | **+3.5 pp**  |
| *Ophrys*        | 2754 | **0.933** | 0.905     | **+2.8 pp**  |
| *Dendrobium*    |  161 | **0.919** | 0.907     | +1.2 pp  |

{% include figure.liquid path="assets/img/orchidclip/fig1_per_genus.png" class="img-fluid rounded z-depth-1" alt="Per-genus top-1 accuracy: orchid-clip-v8 vs BioCLIP 2 baseline. Long-tail Pleurothallidinae (Stelis, Lepanthes, Bulbophyllum, Maxillaria, Pleurothallis) gain 11–28 pp; head genera shift only marginally." caption="Figure 2. The v8 win is concentrated on long-tail Pleurothallidinae genera that BioCLIP 2 struggles with. Head genera (Ophrys, Habenaria, Dendrobium) move only marginally — flat aggregate accuracy hides where the actual lift lives." %}

Three ablation rounds (v9 H/14 backbone swap, v10 hierarchical genus-species sampler, v11 auxiliary genus head) each regressed against v8. v8 is the production checkpoint.

## What worked

1. **WCVP synonym dedup.** All training rows remapped through World Checklist of Vascular Plants 2026-01-07. The biggest single v7 confusion pair (*Ophrys fuciflora* → *holosericea*, 149× — 29% of all v7 errors) collapsed because they were always the same species under accepted nomenclature.
2. **Inverse-sqrt class sampling with per-species cap.** Long-tail genera get sampled in proportion to `1/√n_rows` rather than uniform-by-row, lifting *Stelis* / *Lepanthes* / *Bulbophyllum* top-1 by 12–28 pp without hurting head-class accuracy.
3. **Cosine-based filter.** Drop the bottom percentile of training rows by image↔binomial cosine against the previous training generation (v6). Removes the rows where the label is wrong before the next model has a chance to memorize the mistake.
4. **Subfamily-gated quality filter.** Only Apostasioideae / Cypripedioideae / Epidendroideae / Orchidoideae / Vanilloideae rows survive. Removes the long tail of iNaturalist mistags into Orchidaceae homonym genera (e.g., insect taxa in *Pentatominae*).

{% include figure.liquid path="assets/img/orchidclip/fig3_synonym_collapse.png" class="img-fluid rounded z-depth-1" alt="Top 12 v7 intra-genus error pairs as a horizontal bar chart. The Ophrys fuciflora ↔ holosericea pair (149 errors) is highlighted in red and dwarfs the next-largest error (20). WCVP collapses this synonym pair to a single accepted binomial, eliminating it entirely from v8." caption="Figure 3. The dominant v7 error mode (point 1 above): one synonym pair, *Ophrys fuciflora* ↔ *holosericea*, 149 errors = 29% of all v7 mistakes. WCVP 2026-01-07 collapses it to a single accepted binomial — gone in v8 by definition, not by learning." %}

## What didn't

- **v9 — BioCLIP 2.5-H ViT-H/14 swap.** The bigger backbone underperformed v8 by −2.5 pp top-1 at the same training budget; resume training with another 800K samples closed 73% of the gap but ended in a wash, not a win. Architecture wasn't the bottleneck.
- **v10 — hierarchical genus / species sampler.** Cardinality-blind sampling lifted some long-tail genera but dropped others (*Caladenia* −21 pp, *Pterostylis* −12 pp). Net regression.
- **v11 — auxiliary genus classification head with λ_g=0.5.** Genus-top-1 +0.6 pp, macro-genus −0.2 pp, top-1 −0.7 pp. The head learned but didn't transfer to the species-level objective.

The instructive lesson across v9–v11: at this scale, hygiene of the label distribution matters more than architecture or auxiliary objectives. The v8 wins all came from the dataset side.

## Embedding-space topology

What does the model actually *learn* about taxonomy? I projected the 18,858 per-binomial image centroids from v8 into 2D with UMAP and ran K-means at k = #ground-truth classes for each WCVP rank, comparing the cluster assignment to the true labels:

| rank      |    n   | k_true |  ARI  |  NMI  |
| --------- | -----: | -----: | ----: | ----: |
| genus     | 18,858 |    359 | 0.076 | **0.576** |
| tribe     |  7,870 |     19 | 0.168 | 0.414 |
| subfamily |  8,022 |      5 | **0.261** | 0.364 |

The headline is **NMI = 0.576 at the genus level** — emergent genus structure that the model was never directly supervised on. Genus is composed implicitly: every species in *Stelis* shares enough visual coherence that the embedding pulls them together without a "this is a *Stelis*" signal in training. This is the BioCLIP-style emergent-hierarchy result, but for orchids: confirmation that a frozen v8 image encoder is a useful **genus-level retriever**, not just a species classifier.

{% include figure.liquid path="assets/img/orchidclip/fig4_umap_subfamily.png" class="img-fluid rounded z-depth-1" alt="UMAP projection of 18,858 v8 image-centroid prototypes colored by WCVP subfamily. Cypripedioideae and Vanilloideae form distinct islands; Epidendroideae and Orchidoideae overlap in the central region." caption="Figure 4. UMAP of v8 species centroids, colored by WCVP subfamily (n=8,022 known). Cypripedioideae (slipper orchids) and Vanilloideae land in clean islands. The two megadiverse subfamilies — Epidendroideae and Orchidoideae — partially mix, which is reflected in the modest subfamily ARI of 0.26. A hierarchical contrastive loss (BioCLIP-2 style) is the natural next lever for tightening this." %}

## Errors prefer close relatives

If the embedding has internalized taxonomy, then mistakes should be *biased* mistakes — predicting a sibling species, not a random orchid. To test this, I bucketed each of v8's 355 holdout errors by WCVP rank distance between the true and predicted class, and compared to a null where predictions are drawn uniformly from the 18,858-binomial label space:

| rank distance         | observed | null   | lift over chance |
| --------------------- | -------: | -----: | ---------------: |
| same genus (d=1)      |   90.1%  |  1.6%  | **58×**          |
| same tribe (d=2)      |    4.8%  | 14.8%  | 0.32×            |
| same subfamily (d=3)  |    2.3%  | 20.4%  | 0.11×            |
| diff subfamily (d=4)  |    0.3%  | 51.9%  | 0.01×            |

90% of errors are *same-genus, different-species* — a 58× lift over the chance rate of 1.6%. Cross-subfamily mistakes are essentially absent (0.3% observed vs 52% null). This is the practical confidence story: when v8 says *Stelis galeata* and the truth is *S. pachyglossa*, that's the dominant failure mode; when it confuses *Stelis* with anything outside Pleurothallidinae, that effectively never happens.

{% include figure.liquid path="assets/img/orchidclip/fig6_phylo_bias.png" class="img-fluid rounded z-depth-1" alt="Bar chart comparing observed v8 error fractions to a uniform-random null distribution at each taxonomic rank distance. Observed errors are concentrated 58x over null at the same-genus distance and below chance at every other rank, showing strong phylogenetic bias toward close relatives." caption="Figure 5. v8 errors at each WCVP rank distance vs. a uniform-random null over the 18,858-binomial prototype space. The 58× lift at same-genus and the near-zero rate at cross-subfamily mean that downstream callers can treat v8's top-1 as 'this genus, probably this species' and trust the genus-level signal much more than the species-level one." %}

## Use as a frozen embedding

```python
import open_clip, torch
from PIL import Image

model, _, preprocess = open_clip.create_model_and_transforms('ViT-L-14', pretrained=None)
state = torch.load('open_clip_pytorch_model.bin', map_location='cpu', weights_only=False)
model.load_state_dict(state['state_dict'])  # wrapped — keys live under state_dict
model.eval().cuda()

img = preprocess(Image.open('flower.jpg').convert('RGB')).unsqueeze(0).cuda()
with torch.no_grad():
    feat = model.encode_image(img)
    feat = feat / feat.norm(dim=-1, keepdim=True)  # (1, 768) L2-normalized
```

Hugging Face release in progress; this page will be updated with the model card link.

## Citation

```bibtex
@misc{orchid_clip_v8_2026,
  title  = {orchid-clip-v8: long-tail-aware CLIP for orchid identification},
  author = {Arnold, M.},
  year   = {2026},
  note   = {Fine-tuned from BioCLIP 2 ViT-L/14}
}
```

Paper in writing: *Long-Tail-Aware CLIP for Orchid Identification* (target: TreeOfLife / NeurIPS workshop track).
