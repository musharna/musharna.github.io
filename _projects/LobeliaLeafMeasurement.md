---
layout: page
title: Automating leaf measurement
description: Extracting leaf traits from digitized herbarium specimens of Lobelia sect. Lobelia at aggregator scale.
img: assets/img/lobelia/clade_leaf_shapes.png
og_image: https://musharna.github.io/assets/img/lobelia/shape_synthesis.png
importance: 2
category: academic research
related_publications: true
---

<div style="border:1px solid var(--global-divider-color); border-left:4px solid #4a5d3a; border-radius:8px; padding:0.9rem 1.1rem; margin:0.3rem 0 1.4rem;">
  <strong>TL;DR.</strong> Herbaria hold hundreds of millions of pressed plants, with almost every measurable trait locked inside a photograph. This project built a <strong>semi-automated pipeline for getting leaf traits out</strong>: dismember and digitize a voucher, crop leaves in ImageJ, measure area and perimeter with the <code>LeafArea</code> package in R. The result: <strong>species differ in how leaf perimeter scales with leaf area, and populations of one species differ too.</strong> A second analysis two years later, by a different method, agrees.
  <div style="margin-top:0.7rem;">
    <a href="https://github.com/musharna/lobelia-leaf-morphometrics" style="display:inline-block; background:#24292e; color:#fff; padding:0.35rem 0.85rem; border-radius:6px; text-decoration:none; font-weight:600; margin:0 0.4rem 0.3rem 0;">💻 Code on GitHub</a>
    <a href="https://doi.org/10.15468/dl.5gavr9" style="display:inline-block; background:#4a5d3a; color:#fff; padding:0.35rem 0.85rem; border-radius:6px; text-decoration:none; font-weight:600; margin-bottom:0.3rem;">🌿 GBIF download DOI</a>
  </div>
</div>

Undergraduate research at **Kent State University**, advised by **Dr. Andrea Case**. It sat inside the NSF programme [**BEE**](https://www.nsf.gov/awardsearch/showAward?AWD_ID=2015606) (DEB-2015606), which uses _Lobelia_ sect. _Lobelia_ as a model for why close relatives do or don't live alongside each other; my piece was the phenotype side. The [_Lobelia_ silhouettes]({{ '/projects/LobeliaSilhouettes/' | relative_url }}) came earlier, in 2019: **that one is reconstruction for depiction and keeps true size, this one is segmentation for measurement and normalises size away.**

## Why bother

Leaf shape varies between close relatives in the same place, and that variation is tied to how a leaf works: light interception, thermoregulation, water-supply trade-offs, plasticity {% cite nicotra2011leafshape tsukaya2018leafshape %}. Testing any of it across a clade needs shape as a _number_, for a lot of plants.

_Lobelia_ sect. _Lobelia_ is a good test case because it is awkward: 23 species as scoped in 2021, 26 in the 2025 phylogenomic revision {% cite godden2025lobelia %}, from the tall red-flowered _L. cardinalis_ to the small aquatic _L. dortmanna_. Several grow as **basal rosettes**, where herbarium-vision work generally assumes separated, planar leaves on a stem. A rosette pressed flat is a pile of overlapping blades radiating from one point.

## The corpus

Records came from GBIF, SERNEC, iDigBio and the Kent State herbarium, filtered to preserved specimens with coordinates, no flagged geospatial issues, and an image. Aggregators return duplicates: the same physical sheet surfaces repeatedly under one `gbifID`. Each species was reconciled by hand, every deletion logged in a per-species ledger.

| stage                       |     count |
| --------------------------- | --------: |
| species accounted for       |        23 |
| occurrence records screened |     2,906 |
| specimen images retained    | **2,733** |

<div class="caption">
Totals cover the <strong>20 of 23</strong> species tabs complete on both ends. <em>batsonii</em> was never tallied; <em>inflata</em> and <em>siphilitica</em> record intake but no final figure. The true corpus is larger than 2,733, not smaller. Retrieved 2022-01-14.
</div>

A later, narrower pull for _L. siphilitica_ is permanently citable, since GBIF mints a DOI per download {% cite gbif2024lobeliasiphilitica %}: **[10.15468/dl.5gavr9](https://doi.org/10.15468/dl.5gavr9)**, 452 preserved-specimen records across 19 institutional datasets, retrieved 2024-02-16.

Splitting by species exposed something the project didn't set out to find:

<div class="row justify-content-center mt-3 mb-2">
  <div class="col-12 p-0">
    <iframe src="{{ '/assets/plotly/lobelia_species_counts.html' | relative_url }}"
            title="Interactive chart: specimen images retained per Lobelia species, on a log scale"
            loading="lazy" frameborder="0" scrolling="no"
            style="width:100%; height:580px; border:1px solid var(--global-divider-color); border-radius:8px;">
    </iframe>
  </div>
</div>
<div class="caption">
Images retained per species after de-duplication. Hover for records screened and share kept. On a <strong>log</strong> axis rather than bars: bar length encodes value from a zero baseline a log axis does not have.
</div>

**811 sheets for _L. cardinalis_, one usable sheet for _L. apalachicolensis_.** Showy, common, cultivated plants get collected; narrow endemics do not. Any model trained here inherits that skew, and any clade-wide comparison has to carry it as a caveat rather than average it away.

## The pipeline

"Semi-automated" is the operative word. A human is in the loop throughout:

1. **Voucher collection** from multiple sites.
2. **Digitization and "dismemberment."** The specimen is taken apart and photographed, so leaves lie flat, separated and unobscured.
3. **Whole-plant traits** in **ImageJ** against the 1 cm scale standard: base-to-first-leaf, base-to-first-flower, stem thickness at base and at first flower. Images are rotated to a common axis, which nearly every morphometrics tool assumes.
4. **Leaf cropping** (ImageJ), one sheet becoming many single-leaf images. Leaves too folded or torn to read are excluded by explicit criterion, not by eye.
5. **Area and perimeter** via the **`LeafArea`** R package driving ImageJ, calibrated at 85 px/cm:

```r
library(LeafArea)
run.ij(set.directory = ".../leafcrops",
       distance.pixel = 85,
       known.distance = 1,   # cm
       trim.pixel     = 0)
```

6. **Analysis** in R / RStudio.

Thresholding each crop gives the binary mask the measurements come from. It is also where the material fights back:

{% include figure.liquid path="assets/img/lobelia/leaf_series_spicata.png" title="thresholded leaf series showing damaged laminae, Lobelia spicata" alt="Ten black leaf outlines from one Lobelia spicata specimen; several are visibly torn or truncated and one carries a hole through the middle of the blade." caption="One _L. spicata_ specimen (voucher AC17073), an uncooperative one: several laminae torn through, one punctured. **An area measured from these is wrong while looking perfectly valid in a spreadsheet.**" class="img-fluid rounded z-depth-1" %}

Existing tools were surveyed first. Most assume material digitized herbarium sheets never supply:

| tool               | outcome                                                                       |
| ------------------ | ----------------------------------------------------------------------------- |
| **MorphoLeaf**     | Needs single leaves, clean high-contrast background, uniform orientation.     |
| **LeafJ** (ImageJ) | Failed to detect whole leaves; hand-correcting cost more than hand-measuring. |
| **LeafMachine**    | Promising, but MATLAB-licensed.                                               |
| **MASS**           | Also MATLAB.                                                                  |
| **TraitEx**        | Would not import our images.                                                  |
| **Morphidas**      | Too little documentation to evaluate.                                         |

The binding constraint is rarely the model. It is that measurement tools assume idealized input and pressed specimens are the opposite, the flattened rosette most of all.

## What it showed

Perimeter scales with area differently in different species. That is a shape statement, not a size one: a leaf gaining perimeter quickly as it gains area is narrower, or more dissected, or more toothed.

{% include figure.liquid path="assets/img/lobelia/leafarea_perimeter_species.png" title="Leaf area versus perimeter across the four best-sampled species" alt="Scatter plot of leaf perimeter against leaf area for four Lobelia species, each with its own dashed regression line; glandulosa rises most steeply, elongata least." caption="The four best-sampled species (n > 49 each), each with its own slope. _L. glandulosa_ gains perimeter fastest per unit area, _L. elongata_ slowest, and _elongata_ also reaches far larger leaves." class="img-fluid rounded z-depth-1" %}

{% include figure.liquid path="assets/img/lobelia/leafarea_perimeter_sites.png" title="Leaf area versus perimeter within Lobelia elongata, by collection site" alt="Scatter plot of leaf perimeter against leaf area for Lobelia elongata, coloured by four collection site codes, each with its own dashed regression line of differing slope." caption="_L. elongata_ alone, split by collection site. The four sites do not share a slope, so whatever drives leaf shape here operates **below the species level**." class="img-fluid rounded z-depth-1" %}

That nesting is the finding: **shape differs between species, and between populations of the same species.** Any clade-scale story has to survive the second layer.

{% include figure.liquid path="assets/img/lobelia/clade_leaf_shapes.png" title="Leaf outlines across nine species of Lobelia sect. Lobelia" alt="Nine black leaf silhouettes in a row, labelled by species, ranging from a very narrow linear blade for glandulosa to broad ovate blades for apalachicolensis and spicata." caption="A **composed montage**: one leaf per species, from that species' own mask, **scaled to a common length** so it compares _shape_, not size. Leaves were chosen by solidity, not size." class="img-fluid rounded z-depth-1" %}

Nine species, not ten. The largest component in a mask is often a stem fragment, and _L. canbyi_'s only mask is nothing else: 3,257 px at 0.55 solidity against 0.93–0.97 for a clean blade. Dropping it is more precise than showing debris under its name.

## A second method, two years later

The 2024 result had never been checked against anything but itself. In 2026 I re-analysed the 104 recovered masks by a different route: **486 leaves from 88 specimens across 8 species**, each outline resampled to 128 pseudo-landmarks, aligned, scaled to unit centroid size and ordinated by PCA. No area, no perimeter, no shared code.

**PC1 carries 48% of shape variance and is almost exactly leaf breadth**, correlating with measured width-to-length at **r = 0.978**, so the axis is checked rather than assigned by eye. Species order along it monotonically, _L. glandulosa_ at 0.109 to _L. apalachicolensis_ at 0.439, and it holds essentially all the species signal: between-species share (η²) **0.493** on PC1 against **0.006** on PC2.

Classifying from outline alone, **cross-validated grouped by specimen** so no leaf from a test plant is seen in training:

|                                                              |  accuracy |
| ------------------------------------------------------------ | --------: |
| LDA, grouped by specimen                                     | **0.372** |
| permuted-label null                                          |     0.166 |
| majority-class baseline                                      |     0.191 |
| _LDA, naive split (leaves of one plant span train and test)_ |   _0.430_ |

Roughly **twice chance**: a genuine species character, if a weak one. The naive split scores 6 points higher, which is the size of the pseudo-replication illusion you get free by forgetting that ten leaves off one plant are not ten independent observations.

Does it agree with 2024?

{% include figure.liquid path="assets/img/lobelia/shape_synthesis.png" title="Landmark shape versus perimeter-to-area, across 486 leaves" alt="Scatter of perimeter over square-root of area against PC1 of leaf outline for 486 leaves, showing a strong negative relationship, with species means labelled by leader lines and Lobelia glandulosa a clear outlier at the narrow end." caption="Every leaf measured both ways. **PC1 against perimeter/√area**, dimensionless, so size cancels and no calibration is needed. They agree at **r = −0.82**." class="img-fluid rounded z-depth-1" %}

_L. glandulosa_ is the outlier on both by a wide margin, the same species the 2024 plot picks out with the steepest slope.

They part company on _L. elongata_. Perimeter grows with the **square root** of area for a fixed shape, so the 2024 straight-line slope depends on the range of leaf sizes a species spans, and _elongata_ reaches ~30 cm² where the others stop near 5–10. Its gentle slope is partly a size effect, and on the dimensionless index it sits mid-pack. That sharpens the original result rather than undoing it.

**What this does not show.** Sampling is uneven (93 leaves from _puberula_, 26 from _inflata_; 21 specimens for _glandulosa_, 3 for _apalachicolensis_). Absolute size is discarded by construction, and size is a real diagnostic character. Venation, dentition and pubescence are not in an outline at all. PC1 is also **calibrated against itself**, checked against my own width-to-length measurement of the same masks rather than any outside description of these plants; the external version I tried was too underpowered to settle anything.

## Status

Completed undergraduate work, recorded here rather than maintained.

Code, protocol, notebooks and ledger: [**musharna/lobelia-leaf-morphometrics**](https://github.com/musharna/lobelia-leaf-morphometrics). **No specimen imagery is included**: the raw sheets carry all-rights-reserved notices burned into the pixels regardless of the licence field on the aggregator record. Images belong to their holding institutions; the GBIF download is CC BY-NC 4.0.
