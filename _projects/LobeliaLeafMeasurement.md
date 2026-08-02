---
layout: page
title: Automating leaf measurement
description: Extracting leaf traits from digitized herbarium specimens of Lobelia sect. Lobelia at aggregator scale.
img: assets/img/lobelia/clade_leaf_shapes.png
og_image: https://musharna.github.io/assets/img/lobelia/shape_space.png
importance: 2
category: academic research
related_publications: true
---

<div style="border:1px solid var(--global-divider-color); border-left:4px solid #4a5d3a; border-radius:8px; padding:0.9rem 1.1rem; margin:0.3rem 0 1.4rem;">
  <strong>TL;DR.</strong> Herbaria hold hundreds of millions of pressed plants, and almost every measurable trait on them is locked inside a photograph. This project built a <strong>semi-automated pipeline for getting leaf traits out</strong> — collect vouchers, dismember and digitize them, crop leaves in ImageJ, and measure area and perimeter with the <code>LeafArea</code> package in R. It produced real measurements and a real result: <strong>species differ in how leaf perimeter scales with leaf area, and populations of one species differ too.</strong> The fully automatic version — computer vision that segments leaves straight off an undissected sheet — was scoped, started, and <strong>never finished</strong>.
  <div style="margin-top:0.7rem;">
    <a href="https://github.com/musharna/lobelia-leaf-morphometrics" style="display:inline-block; background:#24292e; color:#fff; padding:0.35rem 0.85rem; border-radius:6px; text-decoration:none; font-weight:600; margin:0 0.4rem 0.3rem 0;">💻 Code on GitHub</a>
    <a href="https://doi.org/10.15468/dl.5gavr9" style="display:inline-block; background:#4a5d3a; color:#fff; padding:0.35rem 0.85rem; border-radius:6px; text-decoration:none; font-weight:600; margin-bottom:0.3rem;">🌿 GBIF download DOI</a>
  </div>
  <div style="margin-top:0.5rem; font-size:0.9em;">
    <strong>On this page:</strong>
    <a href="#why-measure-leaf-traits-at-all">Why leaf traits</a> ·
    <a href="#the-data-is-already-collected">The data is already collected</a> ·
    <a href="#acquisition-was-the-first-real-problem">Acquisition</a> ·
    <a href="#the-record-is-long-tailed">The long tail</a> ·
    <a href="#the-diversity-being-measured">The diversity</a> ·
    <a href="#does-outline-alone-identify-a-species">Does outline identify a species?</a> ·
    <a href="#the-pipeline-that-actually-ran">The pipeline</a> ·
    <a href="#what-the-measurements-showed">What it showed</a> ·
    <a href="#the-part-that-was-never-finished">What was never finished</a> ·
    <a href="#what-didnt-work">What didn't work</a> ·
    <a href="#status">Status</a>
  </div>
</div>

This was my undergraduate research at **Kent State University**, advised by **Dr. Andrea Case** in the Department of Biological Sciences. The proposal is dated December 2021, and the work ran through 2022 with a final data pull in early 2024. It sat inside a larger NSF-funded programme — [**BEE: Ecological and evolutionary processes affecting the co-existence of close relatives**](https://www.nsf.gov/awardsearch/showAward?AWD_ID=2015606) (DEB-2015606, Case at Kent State; collaborative with Lynda Delph at Indiana and Nico Cellinese at Florida) — which uses _Lobelia_ sect. _Lobelia_ as a model for why closely related species do or don't manage to live alongside each other. My piece of it was the phenotype side: getting trait data out of herbarium sheets without measuring every one by hand.

It is the **later** of my two pieces of _Lobelia_ work. The [digital reconstruction of _Lobelia_ silhouettes]({{ '/projects/LobeliaSilhouettes/' | relative_url }}) — whole-plant outlines restored from herbarium sheets — came first, finished in early 2019, before this grant existed. The two are easy to conflate, because both end in a plant reduced to an outline. They are not the same thing, and they make opposite choices about scale: that one is reconstruction for depiction and keeps true size, this one is segmentation for measurement and normalises size away.

## Why measure leaf traits at all

Leaf shape varies enormously, including between close relatives growing in the same place, and that variation is not decorative — it is tied to how a leaf works. The functional hypotheses are well rehearsed {% cite nicotra2011leafshape tsukaya2018leafshape %}: **light interception**, **thermoregulation**, **water-supply trade-offs**, and **phenotypic plasticity**. Testing any of them across a clade needs leaf shape as a _number_, for a lot of plants.

Which is the bottleneck this project attacked.

## The data is already collected

The argument for this work is that the specimens already exist. Centuries of botanists have pressed, mounted and labelled plants, and digitization programmes have since photographed a large fraction of them and put the images behind public APIs. What has _not_ happened is the measurement. A sheet photographed at 5100 × 3500 px contains leaf areas, blade widths, petiole dimensions, stem thickness and phenology — all of it visible, essentially none of it in a database.

_Lobelia_ sect. _Lobelia_ is a good test case precisely because it is awkward. The clade spanned 23 species as the project scoped it in 2021 — the section's circumscription has since moved, and the 2025 phylogenomic paper puts it at 26 with 24 sampled — with real morphological range, from the tall red-flowered _L. cardinalis_ to the small aquatic _L. dortmanna_, and several of them grow as **basal rosettes**. Most published herbarium-vision work targets plants with clearly separated, planar leaves on a stem. A rosette pressed flat is a pile of overlapping blades radiating from one point, and the whole difficulty of the project is downstream of that fact.

## Acquisition was the first real problem

Before any model could be trained, the corpus had to be assembled and audited. Records came from GBIF, SERNEC, iDigBio and the Kent State herbarium, filtered to preserved specimens with coordinates, no flagged geospatial issues, and an attached still image.

The tedious part was that aggregators return duplicates: the same physical sheet surfaces repeatedly under one `gbifID`, sometimes with several images of differing usefulness. Each species was reconciled by hand — duplicates identified, the most representative image kept, broken links purged, and every deletion logged with its reasoning in a per-species ledger.

That ledger survives, and it is the most honest description of the dataset:

| stage                       |     count |
| --------------------------- | --------: |
| species accounted for       |        23 |
| occurrence records screened |     2,906 |
| specimen images retained    | **2,733** |

<div class="caption">
Totals are over the <strong>20 of 23</strong> species tabs whose ledger entries are complete on both ends. Three tabs are unfinished — <em>batsonii</em> was never tallied, and <em>inflata</em> and <em>siphilitica</em> record their intake but not a final figure — so the true corpus is larger than 2,733, not smaller. Records were retrieved 2022-01-14.
</div>

A later, narrower pull for _L. siphilitica_ alone is permanently citable, since GBIF mints a DOI for every download {% cite gbif2024lobeliasiphilitica %} — **[10.15468/dl.5gavr9](https://doi.org/10.15468/dl.5gavr9)**, 452 preserved-specimen records across 19 institutional datasets, retrieved 2024-02-16.

## The record is long-tailed

Splitting the retained images by species exposes something the project didn't set out to find. Herbarium coverage of this clade is _extremely_ uneven:

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
Specimen images retained per species, after de-duplication. Hover any point for the occurrence records screened and the share kept. Shown as points on a <strong>log</strong> axis rather than bars: the range spans three orders of magnitude, and bar length encodes value from a zero baseline that a log axis does not have. The same numbers are tabulated below.
</div>

| species               | screened | retained |
| --------------------- | -------: | -------: |
| _L. cardinalis_       |      899 |      811 |
| _L. spicata_          |      484 |      468 |
| _L. kalmii_           |      334 |      315 |
| _L. glandulosa_       |      230 |      230 |
| _L. puberula_         |      211 |      206 |
| _L. paludosa_         |      129 |      127 |
| _L. feayana_          |      123 |      122 |
| _L. nuttallii_        |      116 |      115 |
| _L. dortmanna_        |      151 |      111 |
| _L. homophylla_       |       51 |       51 |
| _L. appendiculata_    |       44 |       44 |
| _L. elongata_         |       26 |       26 |
| _L. floridana_        |       24 |       23 |
| _L. brevifolia_       |       23 |       23 |
| _L. georgiana_        |       20 |       20 |
| _L. canbyi_           |       18 |       18 |
| _L. flaccidifolia_    |       11 |       11 |
| _L. rogersii_         |        9 |        9 |
| _L. gattingeri_       |        2 |        2 |
| _L. apalachicolensis_ |        1 |        1 |

Three orders of magnitude separate the best- and worst-sampled species — 811 sheets for _L. cardinalis_, a single usable one for _L. apalachicolensis_. Showy, common, widely cultivated plants get collected; narrow endemics do not. Any model trained on this corpus inherits that skew, and any trait comparison across the clade has to carry it as a caveat rather than average it away.

## The diversity being measured

All of the above is machinery. This is the thing it exists to capture — the same extraction run across the clade, one representative leaf per species:

{% include figure.liquid path="assets/img/lobelia/clade_leaf_shapes.png" title="Leaf outlines across nine species of Lobelia sect. Lobelia" alt="Nine black leaf silhouettes in a row, labelled by species, ranging from a very narrow linear blade for glandulosa to broad ovate blades for apalachicolensis and spicata." caption="A **composed montage**: one leaf per species, each taken from that species' own thresholded leaf mask and **scaled to a common length**. It therefore compares _shape_, not size — absolute scale is deliberately not preserved. The range is the point: _L. glandulosa_ is nearly linear, _L. cardinalis_ falcate and tapering, _L. apalachicolensis_ and _L. spicata_ broad and blunt. Representative leaves were chosen by solidity rather than by size, because the largest connected component in a mask is frequently a stem fragment rather than a leaf." class="img-fluid rounded z-depth-1" %}

Nine species, not ten. _L. canbyi_ is absent because its only mask cannot supply a leaf: the largest component in it is 3,257 px at 0.55 solidity — a stem sliver — against 0.93–0.97 for a clean blade. That is a thresholding failure, and dropping the species is more honest than showing debris under its name.

## Does outline alone identify a species?

Showing that the shapes differ is not the same as showing they _separate_. Every one of the 104 thresholded masks yields multiple leaves, so the question can be asked quantitatively: **486 leaves from 88 specimens across 8 species**, each outline resampled to 128 equally spaced pseudo-landmarks, aligned, scaled to unit centroid size, and ordinated by PCA. This follows the same family of method as the Procrustes pseudo-landmark approach the Case lab later published for leaf shape.

{% include figure.liquid path="assets/img/lobelia/shape_space.png" title="Leaf shape space, small multiples by species" alt="Eight small scatter panels, one per species, each plotting PC1 against PC2 with that species highlighted in green against all 486 leaves in grey. L. glandulosa sits far left; L. apalachicolensis and L. inflata sit right." caption="Small multiples rather than one eight-colour scatter — in a scatter any two points can fall adjacent, so eight categorical hues would be asking the reader to discriminate colours that cannot be made reliably distinct. Grey is all 486 leaves; green is the named species. _L. glandulosa_ occupies the narrow-leaf extreme; _L. apalachicolensis_ and _L. inflata_ sit at the broad end." class="img-fluid rounded z-depth-1" %}

**PC1 carries 48% of shape variance and is almost exactly leaf breadth** — its correlation with directly measured width-to-length is **r = 0.978**, so the axis is a checked quantity rather than a label I assigned by eye. Species order along it monotonically, from _L. glandulosa_ at a width:length of 0.109 to _L. apalachicolensis_ at 0.439.

That axis is also where the species signal lives, and essentially nowhere else:

|                                         |       PC1 |   PC2 |
| --------------------------------------- | --------: | ----: |
| share of shape variance                 |       48% |   26% |
| between-species share of that axis (η²) | **0.493** | 0.006 |

PC2 is real variation — it is just variation _within_ plants, not between species.

Classifying species from outline alone, with **cross-validation grouped by specimen** so no leaf from a test plant is ever seen in training:

|                                                              |  accuracy |
| ------------------------------------------------------------ | --------: |
| LDA, grouped by specimen                                     | **0.372** |
| permuted-label null                                          |     0.166 |
| majority-class baseline                                      |     0.191 |
| _LDA, naive split (leaves of one plant span train and test)_ |   _0.430_ |

So outline alone runs at roughly **twice chance** — a real signal, and a modest one. The naive split scores 6 points higher, which is the size of the pseudo-replication illusion you get for free if you forget that ten leaves off one plant are not ten independent observations.

**What this does not show.** Sampling is uneven (93 leaves from _puberula_, 26 from _inflata_) and specimen counts more so (21 for _glandulosa_, 3 for _apalachicolensis_), so the per-species positions are not equally trustworthy. Absolute size is discarded by construction, and size is a real diagnostic character. Venation, margin dentition and pubescence — all of which a botanist uses — are not in an outline at all. _L. cardinalis_ (3 leaves) and _L. canbyi_ (no usable leaf) are excluded entirely.

The honest reading is that leaf outline is a weak-but-genuine species character in this clade, and that the automation was never going to identify species from shape alone. That is a useful thing to have measured rather than assumed.

## The pipeline that actually ran

Presented at Michigan State in February 2024 as _Semi-Automated Extraction of Leaf Traits from Herbarium Vouchers_. "Semi-automated" is the operative word, and the honest one — a human is in the loop at several steps:

1. **Voucher collection.** _Lobelia_ collected from multiple sites, as vouchers.
2. **Digitization and "dismemberment."** The specimen is taken apart and photographed, so leaves lie flat, separated and unobscured.
3. **Whole-plant traits** measured in **ImageJ** against the 1 cm scale standard: base-to-first-leaf, base-to-first-flower, stem thickness at the base and at the first flower. Every image is rotated so leaf tips face the same way, because nearly every morphometrics tool assumes a common axis.
4. **Semi-automated leaf cropping** (ImageJ) — one sheet becomes many single-leaf images. Leaves too folded or torn to read are excluded by explicit criterion rather than by eye.
5. **Semi-automated area and perimeter** via the **`LeafArea`** R package driving ImageJ, calibrated at 85 px/cm:

```r
library(LeafArea)
run.ij(set.directory = ".../leafcrops",
       distance.pixel = 85,
       known.distance = 1,   # cm
       trim.pixel     = 0)
```

6. **Analysis** in R / RStudio.

Thresholding each cropped leaf gives a binary mask, and the mask is what area and perimeter are computed from:

{% include figure.liquid path="assets/img/lobelia/leaf_series_siphilitica.png" title="thresholded leaf series, Lobelia siphilitica" alt="Eight solid black leaf outlines from one Lobelia siphilitica specimen, arranged left to right from largest to smallest, each a smooth lance shape." caption="Thresholded leaf series for one _L. siphilitica_ specimen (voucher AC17142), largest to smallest. The size gradient down a single stem is real biological signal — and it is why a per-plant average is a poor summary of leaf shape." class="img-fluid rounded z-depth-1" %}

{% include figure.liquid path="assets/img/lobelia/leaf_series_spicata.png" title="thresholded leaf series showing damaged laminae, Lobelia spicata" alt="Ten black leaf outlines from one Lobelia spicata specimen; several are visibly torn or truncated and one carries a hole through the middle of the blade." caption="The same for _L. spicata_ (voucher AC17073), and a far less cooperative specimen — several laminae torn through, one punctured. An area measured from these is wrong while looking perfectly valid in a spreadsheet. Pressed material decades old is full of them, which is why the exclusion criterion is explicit." class="img-fluid rounded z-depth-1" %}

## What the measurements showed

Perimeter scales with area differently in different species — which is a shape statement, not a size one. A leaf that gains perimeter quickly as it gains area is narrower, or more dissected, or more toothed:

{% include figure.liquid path="assets/img/lobelia/leafarea_perimeter_species.png" title="Leaf area versus perimeter across the four best-sampled species" alt="Scatter plot of leaf perimeter against leaf area for four Lobelia species, each with its own dashed regression line; glandulosa rises most steeply, elongata least." caption="Leaf area against perimeter for the four best-sampled species (n > 49 each). Each species carries its own slope: _L. glandulosa_ gains perimeter fastest per unit area, _L. elongata_ slowest — and _elongata_ also reaches far larger leaves than the rest. Original analysis, R / ggplot2." class="img-fluid rounded z-depth-1" %}

And the same relationship separates **populations within a single species**:

{% include figure.liquid path="assets/img/lobelia/leafarea_perimeter_sites.png" title="Leaf area versus perimeter within Lobelia elongata, by collection site" alt="Scatter plot of leaf perimeter against leaf area for Lobelia elongata, coloured by four collection site codes, each with its own dashed regression line of differing slope." caption="_L. elongata_ alone, split by collection site. The four sites do not share a slope — plants from one site put on perimeter faster than plants from another. Whatever drives leaf shape here operates below the species level, which is the observation that makes a clade-wide automated measurement worth building. Original analysis, R / ggplot2." class="img-fluid rounded z-depth-1" %}

That nesting is the substantive finding: **shape differs between species, and it differs between populations of the same species.** Any clade-scale story about leaf shape has to survive that second layer.

## The part that was never finished

The ambition beyond the dismembered-sheet workflow was to skip the dismembering entirely — segment measurable leaves directly off an intact herbarium sheet, and run the whole clade at aggregator scale rather than one voucher at a time. That is what the 2,733-image corpus above was assembled for.

The design was worked out in detail. Sheets are large and mostly empty, so the plan was two-stage on **GinJinn2** (a herbarium-oriented wrapper over Detectron2) with a Mask R-CNN R101-FPN backbone: annotate in **CVAT**, cut sheets into 2048 px sliding windows with 512 px overlap, predict boxes per window and merge across seams, crop with padding, then run a separate instance-segmentation model on the crops. Sheets rescaled 5100 × 3500 → 1200 × 800, model inputs at 256 × 256, a 60 / 20 / 20 split, 500+ annotated images targeted.

**None of it was completed on _Lobelia_.** The workflow was rehearsed end to end on GinJinn's own tutorial dataset — every command in the working notes names `leucanthemum`, not a _Lobelia_ species — and those notes stop at `## not working???`. The project's own to-do list still reads "annotate small sets / create model / decide best model". The February 2024 talk files the whole thing under **Future Research Interests**.

So the honest boundary is this: the semi-automated measurement pipeline ran and produced the results above; the fully automatic one was scoped, prototyped against a tutorial, and left unfinished.

## What didn't work

The morphometrics tooling was surveyed before anything was committed to, and most of it did not survive contact with real specimens:

| tool               | outcome                                                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **MorphoLeaf**     | Needs single leaves on a clean, high-contrast, clutter-free background with uniform orientation. Herbarium sheets are none of those. |
| **LeafJ** (ImageJ) | Failed to detect whole leaves on our samples; manual correction was more work than measuring by hand.                                |
| **LeafMachine**    | Promising, but MATLAB-licensed.                                                                                                      |
| **MASS**           | Also MATLAB.                                                                                                                         |
| **TraitEx**        | Would not import our leaf images at all.                                                                                             |
| **Morphidas**      | Too little documentation to evaluate.                                                                                                |

Two things are worth saying plainly. First, the binding constraint on this kind of work is rarely the model — it is that measurement tools assume an idealized input that digitized herbarium material never satisfies. Second, the rosette problem was never fully solved. Delineating individual leaves in a flattened rosette, where blades overlap and converge on a single point, remained the hard open edge of the project.

## Status

This is completed undergraduate work, presented here as a record rather than as a maintained project. It was presented at **Michigan State University on 9 February 2024** as _Semi-Automated Extraction of Leaf Traits from Herbarium Vouchers_, but was never written up for publication in its own right, and the pipeline is not packaged for reuse.

Supported by the **Choose Ohio First Scholarship Program** and the **Kent State Biotechnology Program**, and by a **VT-REEL Undergraduate Research Fellowship**. Advised by **Dr. Andrea Case** with **Dr. Christopher Blackwood**, alongside Case lab members Tony Miller, Megan Brown, Princess Abu and Svea Hall.

The code and the original workflow notes are now on GitHub at [**musharna/lobelia-leaf-morphometrics**](https://github.com/musharna/lobelia-leaf-morphometrics) — the GBIF acquisition and Hough line-removal notebooks, the GinJinn2 and annotation commands, the dismembered-sheet protocol, the morphometrics tool survey, and the per-species acquisition ledger the counts on this page come from. Notebook outputs are stripped, and **no specimen imagery is included**: the raw sheets carry all-rights-reserved notices burned into the pixels regardless of the licence field on the aggregator record.

The wider programme it belonged to has since published its phylogenomic arm, under the same NSF awards {% cite godden2025lobelia %}.

**Provenance.** Specimen images are the property of their holding institutions and are used here under their respective terms; the GBIF download above is CC BY-NC 4.0. Counts on this page come from the project's own acquisition ledger, and the two incomplete species tabs are flagged rather than silently dropped.
