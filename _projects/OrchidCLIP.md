---
layout: page
title: Orchids
description: An identification model, a GAN, a hybrid visualizer, and 170 years of Cattleya hybrid registrations.
img: assets/img/orchidclip/orchidclip_card.png
importance: 1
category: independent research
related_publications: false
---

[Demo](https://huggingface.co/spaces/musharna/orchid-genus-id) · [Model v8](https://huggingface.co/musharna/orchid-clip-v8) · [Model v9cw05](https://huggingface.co/musharna/orchid-clip-v9cw05) · [Code](https://github.com/musharna/orchid-clip) · [Hybrid visualizer](https://huggingface.co/spaces/musharna/orchid-hybrid-visualizer)

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

The demo ranks a photo against 25,342 species, so species accuracy there is lower. Since November 2026 it averages the scores of two models: orchid-clip-v8 and [orchid-clip-v9cw05](https://huggingface.co/musharna/orchid-clip-v9cw05), a fine-tune of BioCLIP 2.5 (ViT-H/14) averaged half-and-half with its base weights. It names a species only when the top score is far enough ahead of the runner-up and of every species in other genera, and otherwise gives just the genus. On 5,050 photos held out of training and of the demo's references, species top-1 is 0.78 and genus top-1 is 0.93. The cutoffs were tuned on those same photos (named species right 94% of the time, a name given for 67% of photos), so those two numbers are optimistic. On 1,885 iNaturalist photos posted in early November 2026, which nothing was trained or tuned on, species top-1 was 0.83 and named species were right 96% of the time, with a name given for 67% of photos. The second model was chosen from four candidates on the held-out photos. On 5,438 other November photos it raised species top-1 from 0.71 to 0.79, but many of those show only leaves or seed pods, where it helps most, so the gain on flower photos is probably smaller. For species with no reference images in the demo, genus top-1 is about 0.65, and the demo wrongly names a species for 18% of their photos. It works best on field photos, and much worse on herbarium sheets and illustrations.

About 6,900 of the 25,342 species are in the demo only as a herbarium sheet or a botanical drawing, usually a single one, because no photo of the living plant was available. Most are in large genera of small-flowered species such as _Stelis_, _Bulbophyllum_ and _Lepanthes_. The demo rarely recognizes a photo of these: 6 of 109 test images were identified. The held-out photos include sheets and drawings too. On the 2,983 that are iNaturalist photos, species top-1 is 0.87; on the 598 from the two sources that are mostly sheets and drawings, it is 0.31. I tested removing the sheets and drawings from the references, and it did not change results on photos, so they stay.

Until October 2026 the demo was missing about 5,200 species in the tribes Vandeae and Cymbidieae, including _Phalaenopsis_, _Vanda_, _Oncidium_ and _Cymbidium_. The build step filtered by subfamily and left out the older name Vandoideae, which those species carry in the source data, so photos of them could only match some other genus. Adding them raised held-out genus top-1 from 0.80 to 0.92. A similar error left out another 1,020 species until November 2026, mostly in genera such as _Satyrium_ and _Arethusa_ whose photos were tagged with a wrong subfamily (_Satyrium_ is also a butterfly genus). Later that month, 66 duplicate entries were merged into the species they copied. Most were a species filed under the wrong genus, such as _Orchis acaule_ for _Cypripedium acaule_, or a misspelling. Each sat so close to the real species that the demo would not name it: it named _C. acaule_ correctly on 4 of 63 November photos before the merge and 60 after.

### Color forms

Many orchid species have rare color forms, such as white (alba) forms that lack the usual pink or purple. Growers value them, but there are few photos of them, so the demo had learned most species from their usual color. To find them, I cut out the flower in each photo with SAM 3 and measured how much of it was pink, purple or red. Among 378 species whose flowers are normally strongly colored, 2,373 photos in 294 species (leaving out herbarium sheets and illustrations) had almost none. I looked at the most promising photo for about 250 species. 118 showed a real color form (37 genera), 41 were junk (only leaves, a tiny flower, or an orange flower, which the color rule counts as uncolored), and for 89 I could not tell from the photo.

The demo got these photos wrong. With each photo removed from the demo's references, the top match was the right species for 44% of form photos in 107 species, against 89% for ordinary photos of the same species. The wrong answer was usually a close relative, often one that is normally pale, such as _Laelia albida_ for a white _Laelia autumnalis_. Most of that gap is not about color, though. Form photos are also unusual photos, and equally unusual photos with normal color were right only 57% of the time (46% for the form photos of the same 91 species, a difference that could be chance).

The fix is a second reference for each of those species, built from its uncolored photos. A photo is scored against both, and the better match counts. In a test planned before it was run, top-1 on 98 form photos rose from 45% to 68%, and a named species was right 92% of the time instead of 63%. A second reference built from random photos of the same species did not help. Results on ordinary photos, the November photos and the held-out photos moved by 0.1 points or less. The cost falls on close relatives: on 791 photos of the 44 species that form photos had been mistaken for, top-1 fell from 74.6% to 72.7%, with 15 photos now going to a species with a form reference and none gained. The form photos come from the training collection, and only species with a confirmed form get the second reference, so the gain on new photos is probably smaller. The color rule still misses blue and orange forms.

<div class="row justify-content-center mt-3 mb-2">
  <div class="col-12 p-0">
    <iframe src="{{ '/assets/plotly/orchidclip_color_forms.html' | relative_url }}"
            title="Species top-1 in the demo with and without color-form references, by photo set"
            loading="lazy" frameborder="0" scrolling="no"
            style="width:100%; height:400px; border:1px solid var(--global-divider-color); border-radius:8px;">
    </iframe>
  </div>
</div>

Coerulea forms, where the usual purple turns bluish, need a different search, because the color measure puts ordinary purple flowers in the same blue-purple range. I downloaded 253 Flickr photos that growers had captioned as coerulea, semi-alba or aurea, and used half the species to find the direction in the demo's embedding that separates coerulea photos from ordinary photos of their species. On the other half, tested once, it ranked a coerulea photo above an ordinary reference photo 88% of the time (42 photos, 14 species). The same method failed for semi-alba, and I have not searched with aurea. I then looked at the reference photos that scored highest. In _Cattleya_, the source of most of the captioned photos, 43 of 76 were coerulea (14 species), counting flowers that show it only in the lip, as growers do. In other genera 2 of 45 were. A coerulea reference for those species did not help. The demo named the right species on 63 of 77 captioned coerulea photos with or without one, and the misses were look-alike _Cattleya_ species.

### Reference photos

Each species used to be scored against one reference, the average of its photos. A photo that looks unlike that average, such as an odd angle, a color form or a plant not in flower, scored poorly even when the collection held a near-identical photo. The demo now also compares a photo with each of its 435,962 reference photos, and scores a species by the mean of its average-reference score and its closest photo's score.

I found this while checking the test set. The 8,837 held-out photos were split off photo by photo, and 3,773 of them have another photo of the same iNaturalist observation (the same plant on the same day) among the references. Another 14 are of species the demo cannot name. The old demo scored 0.78 on the 3,773 and 0.72 on the 5,050 that are left. Earlier versions of this page gave 0.74 for all of them together, which was too high. The held-out figures above use only the 5,050.

On those 5,050 photos, the change raised species top-1 from 0.72 to 0.78. I then fixed the method and the cutoff and scored 1,885 new iNaturalist photos once. Species top-1 went from 0.79 to 0.82, photos named correctly from 65% to 68%, and photos named wrongly from 6.2% to 5.3%. A second idea did not survive that step: reweighting the embedding to ignore variation within a species gained 2 points on the held-out photos and nothing on new ones.

The gain is in species with many photos. On three photos from each of 4,605 species, most of them rarely photographed, nothing changed. The cutoff is also lower now, so for species with no references the demo wrongly names a species for 38% of photos instead of 32%. The color-form references stay: without them, form photos lose 8 points. The close relatives that had paid for those references go from 74% to 79%.

<div class="row justify-content-center mt-3 mb-2">
  <div class="col-12 p-0">
    <iframe src="{{ '/assets/plotly/orchidclip_photo_refs.html' | relative_url }}"
            title="Species top-1 in the demo before and after comparing with single reference photos, by photo set"
            loading="lazy" frameborder="0" scrolling="no"
            style="width:100%; height:440px; border:1px solid var(--global-divider-color); border-radius:8px;">
    </iframe>
  </div>
</div>

### Photos without flowers

Those reference photos were all of flowers. Photos marked as showing no flower (leaves, buds, seed pods, whole plants) had been left out, so a photo like that was compared only with flowers. I added 117,506 of them as references for 3,251 species, plus a second average reference built from them for 2,731 species. The demo now holds 553,468 reference photos. Its code did not change.

I tuned on half of 7,224 held-out non-flower photos, fixed the method and the cutoff, and scored the other 3,633 once. Species top-1 went from 0.61 to 0.79, genus top-1 from 0.82 to 0.96, photos named correctly from 47% to 63%, and photos named wrongly from 14% to 5%. On the 1,885 new flower photos, species top-1 went from 0.82 to 0.83. That was their second use, as a check against harm.

The held-out non-flower photos come from the same collection as the references. Photos of the same observation were kept apart, but the same plant photographed on another day can be on both sides, so the gain on entirely new photos is probably smaller. For species with no references, the demo now wrongly names a species for 39% of photos instead of 38%.

### Species the demo doesn't have

For a photo of a species with no references, any species name is wrong, and the demo gave one for 39% of such photos. On those photos the runners-up tend to come from several genera. For a species the demo knows, they are mostly close relatives. The demo now names a species only if the top score also leads the best species of every other genus by a set amount.

I set that amount on half of the species and tested it once on the other half. Wrong names on species with no references fell from 45 of 121 photos to 23. On 2,474 photos of species the demo knows, it kept 1,538 of 1,611 right names and dropped 85 of 184 wrong ones. The cost is fewer names. On the 1,885 new flower photos, photos named correctly went from 70% to 65% and photos named wrongly from 4.9% to 2.6%.

## OrchidGAN

My first orchid model: StyleGAN2-ADA, starting from weights pretrained on a public flowers dataset and fine-tuned on curated _Cattleya_ photos. It makes plausible blooms, but it has no idea which orchid it drew, which is what led to the identification model. The training images are not redistributed.

<div class="row justify-content-sm-center mt-3">
  <div class="col-sm-6">
    {% include figure.liquid path="assets/img/orchidgan/orchidgan_card.webp" title="OrchidGAN samples" alt="Generated Cattleya orchid blooms from the StyleGAN2-ADA model." class="img-fluid rounded z-depth-1" %}
  </div>
</div>

## Cattleya hybrid visualizer

A _Cattleya_ cross takes four to seven years to flower. The [visualizer](https://huggingface.co/spaces/musharna/orchid-hybrid-visualizer) shows what 27 registered crosses might look like. A rule-based phenotype engine blends the parents' traits (pigment channels handled separately, dominance rules, recessive traits allowed through more in later generations) into a short prompt for SDXL with an ancestry LoRA. The engine covers 119 species, and its rules are heuristics. Every image is a prediction, not a photograph.

<div class="row justify-content-sm-center mt-3">
  <div class="col-sm-6">
    {% include figure.liquid path="assets/img/orchidvisualizer/card.jpg" title="C. Hardyana, predicted" alt="A generated image of large magenta Cattleya flowers with ruffled petals and deep crimson lips." class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Predicted <em>Cattleya</em> Hardyana (<em>C. dowiana</em> × <em>C. warscewiczii</em>).
</div>

Across 1,002 registered hybrids, a real hybrid's orchid-clip-v8 embedding sits closer to its parents' midpoint than a shuffled null (cosine 0.910 vs 0.730), and this replicates on an independent backbone (DINOv2: 0.886 vs 0.539). Hybrids also sit off the line between their parents, and further off when the parents look more different (Spearman ρ 0.52, n = 485, permutation p < 0.001; 0.65 on DINOv2). This is visual similarity, not genetics. Weighting the blend by the dominance rules did not beat the plain midpoint.

Code: [orchid-clip](https://github.com/musharna/orchid-clip) · [orchid-hybrid-visualizer](https://github.com/musharna/orchid-hybrid-visualizer)

## Cattleya hybridization over time

A course project (2025) on about 18,700 registered _Cattleya_ hybrids from the RHS register, as republished on [OrchidRoots](https://www.orchidroots.com/). Nineteenth-century crosses were mostly species × species. Hybrid × hybrid crosses rose through the corsage era, peaked around 1960, then fell steeply, and the three kinds of cross are closer to an even mix today. Mean ancestors per hybrid rose from about 2 to about 22 by the 1970s and has stayed there since.

<div class="row justify-content-sm-center mt-3">
  <div class="col-sm-10">
    {% include figure.liquid path="assets/img/cattleya/trends_by_type.png" title="Cattleya hybrid registrations by type" alt="Two panels. Top: Cattleya hybrid registrations per year from 1848 to 2024 (5-year moving average), split into primary, complex and highly complex crosses, with the corsage era of 1920 to 1950 shaded. Bottom: each kind of cross as a share of registrations in each 5-year period." class="img-fluid rounded z-depth-1" %}
  </div>
</div>

The number of hybrids a species has produced is clustered on the phylogeny, but only a species-level tree shows it: Pagel's λ, Moran's I and Abouheif's C<sub>mean</sub> are significant there, and nothing is significant on a tree of subgeneric ranks. Blomberg's K is not significant on either.

Code and write-up: [cattleya-hybridization](https://github.com/musharna/cattleya-hybridization)
