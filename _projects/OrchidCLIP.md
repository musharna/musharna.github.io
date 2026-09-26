---
layout: page
title: Orchids
description: Computer vision on orchids. An identification model, a GAN, and a hybrid visualizer.
img: assets/img/orchidclip/orchidclip_card.png
importance: 1
category: independent research
related_publications: false
---

[Demo](https://huggingface.co/spaces/musharna/orchid-genus-id) · [Model](https://huggingface.co/musharna/orchid-clip-v8) · [Code](https://github.com/musharna/orchid-clip) · [Hybrid visualizer](https://huggingface.co/spaces/musharna/orchid-hybrid-visualizer)

Orchids have over 30,000 species, and photos of them online are uneven. A few cultivated genera have most of the images, many tropical species have only a handful, and labels are often slightly wrong: the right genus with the wrong species, old synonyms, cultivar names. Most of my time on this went into cleaning data.

## Identification: orchid-clip-v8

A fine-tune of [BioCLIP 2](https://huggingface.co/imageomics/bioclip-2) (ViT-L/14) on 1.14M photos of 5,124 species. Rare species were sampled more often (weight ∝ 1/√n), names were mapped to accepted species in WCVP, and images that scored badly against their own label were dropped.

| model              | top-1 per image | top-1 per genus | top-5     |
| ------------------ | --------------- | --------------- | --------- |
| BioCLIP 2          | 0.873           | 0.768           | 0.978     |
| **orchid-clip-v8** | **0.911**       | **0.844**       | **0.986** |

The holdout is 4,000 images from a hash-partitioned 2% bucket. It is mostly _Ophrys_, so the per-genus column (14 genera, each weighted equally) is the fairer comparison. Gains were largest on small genera such as _Lepanthes_ and _Stelis_. It is a closed-set test against the 547 species in the holdout, and 320 of the 355 errors are between species of the same genus.

<div class="row justify-content-center mt-3 mb-2">
  <div class="col-12 p-0">
    <iframe src="{{ '/assets/plotly/orchidclip_per_genus.html' | relative_url }}"
            title="Per-genus top-1 accuracy, orchid-clip-v8 vs BioCLIP 2"
            loading="lazy" frameborder="0" scrolling="no"
            style="width:100%; height:580px; border:1px solid var(--global-divider-color); border-radius:8px;">
    </iframe>
  </div>
</div>

The demo ranks a photo against 18,858 species, so species accuracy there is lower. It names a species only when the top two scores are far enough apart, and otherwise gives just the genus. The cutoff was tuned and scored on the same 7,137 images (named species right 90% of the time, a name given for 60% of photos), so those numbers are optimistic. For species never seen in training (n = 187), genus top-1 is about 0.48. It works best on field photos, and much worse on herbarium sheets and illustrations.

## OrchidGAN

My first orchid model: StyleGAN2-ADA, starting from weights pretrained on a public flowers dataset and fine-tuned on curated _Cattleya_ photos. It makes plausible blooms, but it has no idea which orchid it drew, which is what led to the identification model. The training images are not redistributed.

<div class="row justify-content-sm-center mt-3">
  <div class="col-sm-6">
    {% include figure.liquid path="assets/img/orchidgan/orchidgan_card.webp" title="OrchidGAN samples" alt="Generated Cattleya orchid blooms from the StyleGAN2-ADA model." class="img-fluid rounded z-depth-1" %}
  </div>
</div>

## Cattleya hybrid visualizer

A _Cattleya_ cross takes four to seven years to flower. The [visualizer](https://huggingface.co/spaces/musharna/orchid-hybrid-visualizer) renders a guess at what a cross between two species might look like. A rule-based phenotype engine blends the parents' traits (pigment channels handled separately, dominance rules, recessive traits allowed through more in later generations) into a short prompt for SDXL with an ancestry LoRA. It covers 119 species, and the rules are heuristics. Every image is a prediction, not a photograph.

<div class="row justify-content-sm-center mt-3">
  <div class="col-sm-6">
    {% include figure.liquid path="assets/img/orchidvisualizer/card.jpg" title="C. Hardyana, predicted" alt="A generated image of large magenta Cattleya flowers with ruffled petals and deep crimson lips." class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Predicted <em>Cattleya</em> Hardyana (<em>C. dowiana</em> × <em>C. warscewiczii</em>).
</div>

Across 1,002 registered hybrids, a hybrid's orchid-clip-v8 embedding sits closer to the midpoint of its parents than a shuffled null (cosine 0.910 vs 0.730), and this replicates on an independent backbone (DINOv2: 0.886 vs 0.539).

Code: [orchid-clip](https://github.com/musharna/orchid-clip) · [orchid-hybrid-visualizer](https://github.com/musharna/orchid-hybrid-visualizer)
