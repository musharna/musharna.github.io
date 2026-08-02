---
layout: page
title: Lobelia Silhouettes
description: Automating leaf-trait extraction from digitized herbarium specimens of Lobelia sect. Lobelia.
img: assets/img/lobelia/lobelia_silhouettes.jpg
importance: 1
category: herbarium vision
related_publications: false
---

<div style="border:1px solid rgba(0,0,0,0.1); border-left:4px solid #4a5d3a; border-radius:8px; padding:0.9rem 1.1rem; margin:0.3rem 0 1.4rem;">
  <strong>TL;DR.</strong> Herbaria hold hundreds of millions of pressed plants, and almost every measurable trait on them is locked inside a photograph. This project asked whether that measurement could be automated for one clade — <em>Lobelia</em> sect. <em>Lobelia</em>, 23 eastern North American wildflowers — by pairing aggregator-scale specimen acquisition with instance segmentation. It reached a working two-stage detection-then-segmentation pipeline over a hand-audited corpus of <strong>2,733 specimen images</strong>, and ran headlong into the reason this problem is still open: <strong>a rosette does not decompose into leaves the way a model expects it to.</strong>
  <div style="margin-top:0.5rem; font-size:0.9em;">
    <strong>On this page:</strong>
    <a href="#the-data-is-already-collected">The data is already collected</a> ·
    <a href="#acquisition-was-the-first-real-problem">Acquisition</a> ·
    <a href="#the-record-is-long-tailed">The long tail</a> ·
    <a href="#the-pipeline">The pipeline</a> ·
    <a href="#the-dismembered-sheet-track">Dismembered sheets</a> ·
    <a href="#what-didnt-work">What didn't work</a> ·
    <a href="#status">Status</a>
  </div>
</div>

This was my undergraduate research at **Kent State University**, advised by **Dr. Andrea Case** in the Department of Biological Sciences. The proposal is dated December 2021, and the work ran through 2022 with a final data pull in early 2024. It sat inside a larger NSF-funded programme — [**BEE: Ecological and evolutionary processes affecting the co-existence of close relatives**](https://www.nsf.gov/awardsearch/showAward?AWD_ID=2015606) (DEB-2015606, Case at Kent State; collaborative with Lynda Delph at Indiana and Nico Cellinese at Florida) — which uses _Lobelia_ sect. _Lobelia_ as a model for why closely related species do or don't manage to live alongside each other. My piece of it was the phenotype side: getting trait data out of herbarium sheets without measuring every one by hand.

## The data is already collected

The argument for this work is that the specimens already exist. Roughly four centuries of botanists have pressed, mounted and labelled plants, and digitization programmes have since photographed a large fraction of them and put the images behind public APIs. What has _not_ happened is the measurement. A sheet photographed at 5100 × 3500 px contains leaf areas, blade widths, petiole dimensions, stem thickness and phenology — all of it visible, essentially none of it in a database.

_Lobelia_ sect. _Lobelia_ is a good test case precisely because it is awkward. The clade spans 23 species with real morphological range, from the tall red-flowered _L. cardinalis_ to the small aquatic _L. dortmanna_, and several of them grow as **basal rosettes**. Most published herbarium-vision work targets plants with clearly separated, planar leaves on a stem. A rosette pressed flat is a pile of overlapping blades radiating from one point, and the whole difficulty of the project is downstream of that fact.

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

A later, narrower pull for _L. siphilitica_ alone is permanently citable, since GBIF mints a DOI for every download: **[10.15468/dl.5gavr9](https://doi.org/10.15468/dl.5gavr9)** — 452 preserved-specimen records across 19 institutional datasets, retrieved 2024-02-16.

## The record is long-tailed

Splitting the retained images by species exposes something the project didn't set out to find. Herbarium coverage of this clade is _extremely_ uneven:

| species         | images |     | species               | images |
| --------------- | -----: | --- | --------------------- | -----: |
| _L. cardinalis_ |    811 |     | _L. appendiculata_    |     44 |
| _L. spicata_    |    468 |     | _L. elongata_         |     26 |
| _L. kalmii_     |    315 |     | _L. floridana_        |     23 |
| _L. glandulosa_ |    230 |     | _L. brevifolia_       |     23 |
| _L. puberula_   |    206 |     | _L. georgiana_        |     20 |
| _L. paludosa_   |    127 |     | _L. canbyi_           |     18 |
| _L. feayana_    |    122 |     | _L. flaccidifolia_    |     11 |
| _L. nuttallii_  |    115 |     | _L. rogersii_         |      9 |
| _L. dortmanna_  |    111 |     | _L. gattingeri_       |      2 |
| _L. homophylla_ |     51 |     | _L. apalachicolensis_ |      1 |

Three orders of magnitude separate the best- and worst-sampled species — 811 sheets for _L. cardinalis_, a single usable one for _L. apalachicolensis_. Showy, common, widely cultivated plants get collected; narrow endemics do not. Any model trained on this corpus inherits that skew, and any trait comparison across the clade has to carry it as a caveat rather than average it away.

## The pipeline

Specimen sheets are large and mostly empty, which makes naive whole-image segmentation wasteful and imprecise. The workflow was therefore two-stage, built on **GinJinn2** (a herbarium-oriented wrapper over Detectron2) with a Mask R-CNN R101-FPN backbone:

1. **Annotate.** Training masks were drawn in CVAT and exported as COCO. Sheets were rescaled from 5100 × 3500 to 1200 × 800, with model inputs normalized to 256 × 256. Target was 500+ annotated images, split 60 / 20 / 20 into train / validation / test.
2. **Detect.** Sheets were cut into 2048 px sliding windows with 512 px overlap so that individual leaves occupied a usable fraction of the frame. Bounding boxes were predicted per window, then merged back across window seams to reconstruct whole-sheet predictions.
3. **Crop.** Merged boxes were cropped with 25% padding, turning one sheet into many single-leaf images.
4. **Segment.** A separate instance-segmentation model ran on the crops, producing the per-leaf masks that the morphometrics depend on — and the silhouettes at the top of this page.

Splitting detection from segmentation matters: it lets the detector work at sheet scale, where context disambiguates a leaf from a label or a scale bar, while the segmentation model sees a tightly framed leaf and can spend its resolution on the margin, which is where the shape information actually lives.

## The dismembered-sheet track

Running alongside the digital pipeline was a physical one, used both to generate clean training data and to provide ground truth. Specimens were dismembered, laid out and photographed, then processed under a fixed protocol: rotate every image in ImageJ so leaf tips face the same direction, record the 1 cm scale standard, and measure base-to-first-leaf, base-to-first-flower, and stem thickness at both the base and the first flower. Leaves too folded or damaged to read were excluded by explicit criterion rather than by eye.

Leaf area then came from the **`LeafArea`** R package driving ImageJ, calibrated at 85 px/cm:

```r
library(LeafArea)
run.ij(set.directory = ".../leafcrops",
       distance.pixel = 85,
       known.distance = 1,   # cm
       trim.pixel     = 0)
```

Orientation is the quiet constraint here. Nearly every leaf-morphometrics tool assumes leaves are aligned on a common axis, which is trivial for a dismembered specimen you photographed yourself and decidedly not trivial for an arbitrary herbarium sheet.

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

This is completed undergraduate work, presented here as a record rather than as a maintained project. It has not been published, and the pipeline is not packaged for reuse.

The wider programme it belonged to has since published its phylogenomic arm — Godden et al. (2025), _Population-level phylogenomic analysis yields insights into species cohesion and population substructure of_ Lobelia _section_ Lobelia _(Campanulaceae)_, **Molecular Phylogenetics and Evolution** 212:108410 ([doi:10.1016/j.ympev.2025.108410](https://doi.org/10.1016/j.ympev.2025.108410)) — under the same NSF awards.

**Provenance.** Specimen images are the property of their holding institutions and are used here under their respective terms; the GBIF download above is CC BY-NC 4.0. Counts on this page come from the project's own acquisition ledger, and the two incomplete species tabs are flagged rather than silently dropped.
