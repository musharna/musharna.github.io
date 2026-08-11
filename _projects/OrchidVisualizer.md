---
layout: page
title: Cattleya Hybrid Visualizer
description: What would this orchid cross look like? SDXL steered by a botanical phenotype engine, for hybrids that take 4-7 years to actually flower.
img: assets/img/orchidvisualizer/card.jpg
importance: 4
# Deep dive — see OrchidCLIP.md. Not in display_categories.
category: orchid deep dive
related_publications: false
---

Part of the [Orchid Vision]({{ '/projects/OrchidVision/' | relative_url }}) program.

Orchid breeding is slow. A _Cattleya_ cross takes roughly **four to seven years** from
pollination to first flowering, and the decision about which cross to attempt is made years
before anyone sees the result. Breeders make that call on intuition built from decades of
watching parents and their offspring.

The **Cattleya Hybrid Visualizer** is an attempt to make that intuition explicit and
queryable. Given two parent species, it composes a botanically-grounded description of the
expected phenotype and renders it, so _"what would this cross plausibly look like?"_ gets
an answer before the four-year wait.

<div class="row justify-content-sm-center mt-4">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/orchidvisualizer/card.jpg" title="C. Hardyana, predicted" alt="A generated photograph of several large magenta Cattleya orchid flowers with broad ruffled petals and deep crimson frilled lips, set among strap-shaped green leaves." class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  <em>Cattleya</em> Hardyana — <em>C. dowiana</em> × <em>C. warscewiczii</em>, 50/50. One of
  27 registered crosses in the pre-rendered gallery.
</div>

## The problem

SDXL will produce a beautiful orchid for any prompt you give it. It will not, on its own,
produce an orchid that reflects the _genetics_ of the two parents you named. Left alone, the
model draws a generic pretty flower and the output tells you nothing.

Most of the work here therefore sits in the layer that decides what to ask for, rather than
in the generation itself.

## The phenotype engine

Parent traits are blended as **pigment chemistry, not colour names**. Anthocyanin,
carotenoid and co-pigment are modelled as independent biochemical channels. This matters
because a magenta _Cattleya_ crossed with a yellow one does not give you an orange
_Cattleya_: the pigment pathways are independent, so you get a magenta-and-yellow flower,
often mottled or patterned. A naive RGB blend gets this exactly wrong.

On top of the channel merge:

- **119 species** carry trait profiles in `phenotype_db.json`.
- **Dominance overrides** (`dominance_rules.json`) encode species-specific behaviour that a
  weighted average would flatten.
- **Recessive expression is generation-dependent.** The threshold relaxes as ancestry
  dilutes — F1 suppresses recessives hard, F2 admits them at 50%, F3 and beyond at 25% —
  so a trait hidden in the first generation can surface in the second, as it does in life.

The engine emits a ~77-token description shaped for CLIP's context window, which is what
actually reaches the model.

## Generation

- **Base model:** [`stabilityai/stable-diffusion-xl-base-1.0`](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0)
- **LoRA:** one ancestry-aware LoRA, applied at an ancestry-weighted scale (not publicly released)
- **Hue tokens:** small textual-inversion embeddings trained per pigment channel
  (anthocyanin-red, carotenoid-yellow), so colour can be steered independently of the prose
  prompt

The published gallery is pre-rendered at seed 42, F1 depth, under the diffusers regime the
LoRA was validated against. A live interactive generator (arbitrary parent pairs,
warm-colour control, multiple seeds) also exists, but needs ZeroGPU hardware to run
in-Space.

## The latent map

Each cross is also placed in [orchid-clip-v8]({{ '/projects/OrchidCLIP/' | relative_url }})
embedding space. The two parents sit at the ends of a chord and the predicted F1 at its
midpoint. Where a _real_ example of the hybrid exists, it is plotted **perpendicular** to
that chord, and its off-chord distance is what the plot is for.

That offset is the **transgressive residual**: the part of the real hybrid that is novel
beyond both parents rather than a blend of them.

The chord it is measured against **replicates on an independent backbone**. Across 1,002
registered grexes a hybrid sits nearer its parent midpoint than a shuffled null — cosine
0.910 against 0.730 under orchid-clip-v8, 0.886 against 0.539 under DINOv2 — and its
nearest neighbour is one of its parents under both. The residual off that chord is the
weaker half of the result: the same evaluation grades it **marginal**, so read it as a
direction worth measuring rather than a settled effect.

## Limits

- The parent species reference photos are real and CC-licensed; **every generated bloom is a
  prediction, not a photograph.** Nothing here is evidence of what a cross actually produced.
- There is **no automated recognition gate** on generation: samples are not scored against a
  per-species prototype and filtered. Output quality rests on the phenotype engine and the
  LoRA, with a human reviewing the results.
- 119 species is a fraction of _Cattleya_ and its allied genera. Crosses outside that set
  fall back to weaker trait inference.

---

**Code:** [github.com/musharna/orchid-hybrid-visualizer](https://github.com/musharna/orchid-hybrid-visualizer)
