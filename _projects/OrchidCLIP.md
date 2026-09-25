---
layout: page
title: OrchidCLIP
description: A BioCLIP 2 fine-tune for orchid identification, with a demo that names a species only when confident.
img: assets/img/orchidclip/orchidclip_card.png
importance: 2
category: orchid deep dive
related_publications: false
---

<div style="border:1px solid var(--global-divider-color); border-left:4px solid #2c5282; border-radius:8px; padding:0.9rem 1.1rem; margin:0.3rem 0 1.4rem;">
  <strong>TL;DR.</strong> <strong>orchid-clip-v8</strong> is BioCLIP 2 (ViT-L/14) fine-tuned on orchid photos with a sampler that favours rare species. On a 14-genus holdout, top-1 averaged per genus rises from 0.768 to <strong>0.844</strong>, with the largest gains on small Pleurothallidinae genera. Telling apart species within a genus remains the hard part, so the demo reports a genus and names a species only when the model is confident.
  <div style="margin-top:0.7rem;">
    <a href="https://huggingface.co/spaces/musharna/orchid-genus-id" style="display:inline-block; background:#cc4e0b; color:#fff; padding:0.35rem 0.85rem; border-radius:6px; text-decoration:none; font-weight:600; margin:0 0.4rem 0.3rem 0;">🌿 Try the demo</a>
    <a href="https://huggingface.co/musharna/orchid-clip-v8" style="display:inline-block; background:#2c5282; color:#fff; padding:0.35rem 0.85rem; border-radius:6px; text-decoration:none; font-weight:600; margin:0 0.4rem 0.3rem 0;">🤗 Model on HF</a>
    <a href="https://github.com/musharna/orchid-clip" style="display:inline-block; background:#24292e; color:#fff; padding:0.35rem 0.85rem; border-radius:6px; text-decoration:none; font-weight:600; margin-bottom:0.3rem;">💻 Code on GitHub</a>
  </div>
</div>

Orchid photos online are heavily skewed: a few cultivated genera dominate, while many tropical species have only a handful of labeled images in the public sources used here. orchid-clip-v8 is a CLIP model fine-tuned from [BioCLIP 2](https://huggingface.co/imageomics/bioclip-2) to do better on those rare species.

## Results

| model              | top-1 per image | top-1 per genus | top-5     | genus-top-1 |
| ------------------ | --------------- | --------------- | --------- | ----------- |
| BioCLIP 2          | 0.873           | 0.768           | 0.978     | 0.992       |
| **orchid-clip-v8** | **0.911**       | **0.844**       | **0.986** | **0.991**   |

The holdout is the first 4,000 images of a 2% hash-partitioned bucket of the corpus. _Ophrys_ makes up 2,754 of those images and both models already do well on it, so the per-image average (+3.8 pp) is dominated by one genus. The per-genus average (+7.6 pp) weights the 14 genera with at least 20 holdout images equally. This is a **closed-set** benchmark: each image is ranked only against the 547 species present in the holdout.

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
  Per-genus top-1 accuracy of orchid-clip-v8 vs BioCLIP 2. Hover any bar for the exact values.
</div>

| genus           |   n | v8        | BioCLIP 2 | Δ            |
| --------------- | --: | --------- | --------- | ------------ |
| _Stelis_        |  25 | **0.640** | 0.400     | **+24.0 pp** |
| _Lepanthes_     |  40 | **0.800** | 0.525     | **+27.5 pp** |
| _Bulbophyllum_  |  41 | **0.732** | 0.585     | **+14.6 pp** |
| _Maxillaria_    |  94 | **0.787** | 0.649     | **+13.8 pp** |
| _Pleurothallis_ | 100 | **0.800** | 0.690     | **+11.0 pp** |

These genera have few holdout images, so each figure carries wide uncertainty.

## Training

The training pool is 1.14M images covering 5,124 species (each with at least 3 images). Three choices mattered most:

1. **Rare-species sampling.** Each image is sampled with weight ∝ `1/√n` for its species, capped at 2,000 per species.
2. **Synonym resolution.** Names were mapped to accepted names in the World Checklist of Vascular Plants (WCVP). The largest error source in the previous model, _Ophrys fuciflora_ → _O. holosericea_, disappeared because WCVP treats them as one species.
3. **Label-noise filter.** Training images that scored poorly against their own label under the previous model were dropped.

## Where the errors fall

Of the 355 holdout errors, 320 (90%) are confusions between two species of the same genus, typically sister species that specialists separate on fine floral detail. Treat a top-1 prediction as "this genus, probably this species".

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
  UMAP of 18,601 species prototypes (the mean v8 embedding of each species' photos), coloured by WCVP subfamily. Species of the same genus form tight clusters.
</div>

## The demo

The [demo](https://huggingface.co/spaces/musharna/orchid-genus-id) ranks each photo against one image centroid per species for 18,858 named species. That is far more candidates than the closed-set benchmark, so species accuracy is lower than in the table above. When the gap between the top two species scores is small, the demo reports only **"Genus _X_ (species uncertain)"**.

The threshold was chosen on a set of 7,137 images so that, on that same set, named species are correct 90% of the time while a species is named for 60% of photos. Because it was tuned and scored on the same images, and has not been checked on a separate test set, treat those figures as optimistic. For species never seen in training (n = 187), genus top-1 is about 0.48.

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
  Precision of named species against the share of photos that get a species name, on the 7,137-image calibration set. The star is the demo's threshold.
</div>

<div class="row justify-content-center mt-2 mb-2">
  <div class="col-12 p-0">
    <iframe src="https://musharna-orchid-genus-id.hf.space"
            title="Orchid genus-ID demo (Hugging Face Space)"
            loading="lazy" frameborder="0"
            style="width:100%; height:900px; border:1px solid var(--global-divider-color); border-radius:8px;">
    </iframe>
  </div>
</div>
<div class="caption">
  The demo, embedded. The first request wakes the free CPU Space, which takes a few seconds.
</div>

## Limitations

- The holdout is dominated by iNaturalist photos. Accuracy drops sharply on herbarium specimens and botanical illustrations; use the model on field photos.
- Several attempts to improve within-genus species accuracy on the model side did not help; adding photos for rare species did.

## Using the model

`orchid-clip-v8` is an [open_clip](https://github.com/mlfoundations/open_clip) checkpoint (ViT-L/14):

```python
# pip install open_clip_torch huggingface_hub torch pillow
import torch, open_clip
from huggingface_hub import snapshot_download
from PIL import Image

ckpt = snapshot_download("musharna/orchid-clip-v8")          # model_config.json + open_clip_pytorch_model.bin
model, _, preprocess = open_clip.create_model_and_transforms("ViT-L-14", pretrained=None)
state = torch.load(f"{ckpt}/open_clip_pytorch_model.bin", map_location="cpu", weights_only=False)
model.load_state_dict(state["state_dict"]); model.eval()     # weights live under state["state_dict"]

img = preprocess(Image.open("orchid.jpg").convert("RGB")).unsqueeze(0)
with torch.no_grad():
    feat = model.encode_image(img)
feat = feat / feat.norm(dim=-1, keepdim=True)                # 768-d, L2-normalized
```

The model repo includes [`embed_example.py`](https://huggingface.co/musharna/orchid-clip-v8/blob/main/embed_example.py), which also shows scoring against a list of species names.
