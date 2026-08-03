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
  <strong>TL;DR.</strong> Herbaria hold hundreds of millions of pressed plants, and almost every measurable trait on them is locked inside a photograph. This project built a <strong>semi-automated pipeline for getting leaf traits out</strong>: dismember and digitize a voucher, crop leaves in ImageJ, measure area and perimeter with the <code>LeafArea</code> package in R. The result: <strong>species differ in how leaf perimeter scales with leaf area, and populations of one species differ too.</strong> A second analysis of the same material, two years later and by a different method, reaches the same conclusion.
  <div style="margin-top:0.7rem;">
    <a href="https://github.com/musharna/lobelia-leaf-morphometrics" style="display:inline-block; background:#24292e; color:#fff; padding:0.35rem 0.85rem; border-radius:6px; text-decoration:none; font-weight:600; margin:0 0.4rem 0.3rem 0;">💻 Code on GitHub</a>
    <a href="https://doi.org/10.15468/dl.5gavr9" style="display:inline-block; background:#4a5d3a; color:#fff; padding:0.35rem 0.85rem; border-radius:6px; text-decoration:none; font-weight:600; margin-bottom:0.3rem;">🌿 GBIF download DOI</a>
  </div>
  <div style="margin-top:0.5rem; font-size:0.9em;">
    <strong>On this page:</strong>
    <a href="#why-measure-leaf-traits-at-all">Why leaf traits</a> ·
    <a href="#the-data-is-already-collected">The data is already collected</a> ·
    <a href="#building-the-corpus">Building the corpus</a> ·
    <a href="#the-record-is-long-tailed">The long tail</a> ·
    <a href="#the-pipeline">The pipeline</a> ·
    <a href="#what-the-measurements-showed">What it showed</a> ·
    <a href="#the-diversity-being-measured">The diversity</a> ·
    <a href="#does-outline-alone-identify-a-species">Does outline identify a species?</a> ·
    <a href="#do-the-two-analyses-agree">Do they agree?</a> ·
    <a href="#why-existing-tools-didnt-fit">Why existing tools didn't fit</a> ·
    <a href="#status">Status</a>
  </div>
</div>

My undergraduate research at **Kent State University**, advised by **Dr. Andrea Case**: proposal dated December 2021, work through 2022, last data pull in early 2024. It sat inside a larger NSF programme, [**BEE: Ecological and evolutionary processes affecting the co-existence of close relatives**](https://www.nsf.gov/awardsearch/showAward?AWD_ID=2015606) (DEB-2015606, Case at Kent State; with Lynda Delph at Indiana and Nico Cellinese at Florida), which uses _Lobelia_ sect. _Lobelia_ as a model for why closely related species do or don't manage to live alongside each other. My piece was the phenotype side: trait data off herbarium sheets without measuring every one by hand.

It is the later of my two pieces of _Lobelia_ work; the [digital reconstruction of _Lobelia_ silhouettes]({{ '/projects/LobeliaSilhouettes/' | relative_url }}) came first, finished in early 2019, before this grant existed. Both end in a plant reduced to an outline, but they make opposite choices about scale: **that one is reconstruction for depiction and keeps true size, this one is segmentation for measurement and normalises size away.**

## Why measure leaf traits at all

Leaf shape varies enormously between close relatives in the same place, and that variation is tied to how a leaf works. The functional hypotheses are well rehearsed {% cite nicotra2011leafshape tsukaya2018leafshape %}: **light interception**, **thermoregulation**, **water-supply trade-offs**, **phenotypic plasticity**. Testing any of them across a clade needs leaf shape as a _number_, for a lot of plants. Getting that number was the bottleneck.

## The data is already collected

Centuries of botanists have pressed, mounted and labelled plants, and digitization programmes have since photographed a large fraction of them and put the images behind public APIs. What has _not_ happened is the measurement. A sheet photographed at 5100 × 3500 px holds leaf areas, blade widths, petiole dimensions, stem thickness and phenology. All of it is visible. Almost none of it is in a database.

_Lobelia_ sect. _Lobelia_ is a good test case because it is awkward: 23 species as scoped in 2021 (the 2025 phylogenomic paper puts it at 26), from the tall red-flowered _L. cardinalis_ to the small aquatic _L. dortmanna_. Several grow as **basal rosettes**, where most published herbarium-vision work assumes clearly separated, planar leaves on a stem. A rosette pressed flat is a pile of overlapping blades radiating from one point, and much of the difficulty is downstream of that fact.

## Building the corpus

Records came from GBIF, SERNEC, iDigBio and the Kent State herbarium, filtered to preserved specimens with coordinates, no flagged geospatial issues, and an attached image.

The tedious part was that aggregators return duplicates. The same physical sheet surfaces repeatedly under one `gbifID`, sometimes with several images of differing usefulness. Each species was reconciled by hand, every deletion logged with its reasoning in a per-species ledger. That ledger survives, and is the most precise description of the dataset:

| stage                       |     count |
| --------------------------- | --------: |
| species accounted for       |        23 |
| occurrence records screened |     2,906 |
| specimen images retained    | **2,733** |

<div class="caption">
Totals cover the <strong>20 of 23</strong> species tabs complete on both ends. Three are unfinished: <em>batsonii</em> was never tallied, and <em>inflata</em> and <em>siphilitica</em> record intake but no final figure. So the true corpus is larger than 2,733, not smaller. Retrieved 2022-01-14.
</div>

A later, narrower pull for _L. siphilitica_ is permanently citable, since GBIF mints a DOI per download {% cite gbif2024lobeliasiphilitica %}: **[10.15468/dl.5gavr9](https://doi.org/10.15468/dl.5gavr9)**, 452 preserved-specimen records across 19 institutional datasets, retrieved 2024-02-16.

## The record is long-tailed

Splitting the retained images by species exposes something the project didn't set out to find. Coverage of this clade is _extremely_ uneven:

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
Specimen images retained per species, after de-duplication. Hover any point for the records screened and the share kept. Points on a <strong>log</strong> axis instead of bars: the range spans three orders of magnitude, and bar length encodes value from a zero baseline a log axis does not have.
</div>

Three orders of magnitude separate the best- and worst-sampled species: **811 sheets for _L. cardinalis_, a single usable one for _L. apalachicolensis_**. Showy, common, cultivated plants get collected; narrow endemics do not. Any model trained here inherits that skew, and any clade-wide trait comparison has to carry it as a caveat instead of averaging it away.

## The pipeline

"Semi-automated" is the operative word. A human is in the loop at several steps:

1. **Voucher collection.** _Lobelia_ collected from multiple sites, as vouchers.
2. **Digitization and "dismemberment."** The specimen is taken apart and photographed, so leaves lie flat, separated and unobscured.
3. **Whole-plant traits** in **ImageJ** against the 1 cm scale standard: base-to-first-leaf, base-to-first-flower, stem thickness at base and at first flower. Images are rotated so leaf tips face the same way, because nearly every morphometrics tool assumes a common axis.
4. **Semi-automated leaf cropping** (ImageJ), so one sheet becomes many single-leaf images. Leaves too folded or torn to read are excluded by explicit criterion, not by eye.
5. **Semi-automated area and perimeter** via the **`LeafArea`** R package driving ImageJ, calibrated at 85 px/cm:

```r
library(LeafArea)
run.ij(set.directory = ".../leafcrops",
       distance.pixel = 85,
       known.distance = 1,   # cm
       trim.pixel     = 0)
```

6. **Analysis** in R / RStudio.

Thresholding each crop gives the binary mask that area and perimeter come from. It is also where the material fights back:

{% include figure.liquid path="assets/img/lobelia/leaf_series_spicata.png" title="thresholded leaf series showing damaged laminae, Lobelia spicata" alt="Ten black leaf outlines from one Lobelia spicata specimen; several are visibly torn or truncated and one carries a hole through the middle of the blade." caption="Thresholded leaf series for one _L. spicata_ specimen (voucher AC17073), and a distinctly uncooperative one. Several laminae are torn through and one is punctured. **An area measured from these is wrong while looking perfectly valid in a spreadsheet.** Decades-old pressed material is full of them, hence the explicit exclusion criterion." class="img-fluid rounded z-depth-1" %}

## What the measurements showed

Perimeter scales with area differently in different species. That is a shape statement, not a size one: a leaf that gains perimeter quickly as it gains area is narrower, or more dissected, or more toothed.

{% include figure.liquid path="assets/img/lobelia/leafarea_perimeter_species.png" title="Leaf area versus perimeter across the four best-sampled species" alt="Scatter plot of leaf perimeter against leaf area for four Lobelia species, each with its own dashed regression line; glandulosa rises most steeply, elongata least." caption="Leaf area against perimeter for the four best-sampled species (n > 49 each). Each carries its own slope. _L. glandulosa_ gains perimeter fastest per unit area and _L. elongata_ slowest, and _elongata_ also reaches far larger leaves than the rest. Original analysis, R / ggplot2." class="img-fluid rounded z-depth-1" %}

And the same relationship separates **populations within a single species**:

{% include figure.liquid path="assets/img/lobelia/leafarea_perimeter_sites.png" title="Leaf area versus perimeter within Lobelia elongata, by collection site" alt="Scatter plot of leaf perimeter against leaf area for Lobelia elongata, coloured by four collection site codes, each with its own dashed regression line of differing slope." caption="_L. elongata_ alone, split by collection site. The four sites do not share a slope. Plants from one put on perimeter faster than plants from another. Whatever drives leaf shape here operates **below the species level**, which is what makes a clade-wide automated measurement worth building. Original analysis, R / ggplot2." class="img-fluid rounded z-depth-1" %}

That nesting is the substantive finding: **shape differs between species, and it differs between populations of the same species.** Any clade-scale story has to survive that second layer.

## The diversity being measured

The same extraction run across the clade, one representative leaf per species:

{% include figure.liquid path="assets/img/lobelia/clade_leaf_shapes.png" title="Leaf outlines across nine species of Lobelia sect. Lobelia" alt="Nine black leaf silhouettes in a row, labelled by species, ranging from a very narrow linear blade for glandulosa to broad ovate blades for apalachicolensis and spicata." caption="A **composed montage**: one leaf per species, from that species' own thresholded mask and **scaled to a common length**, so it compares _shape_, not size. _L. glandulosa_ is nearly linear, _L. cardinalis_ falcate and tapering, _L. apalachicolensis_ and _L. spicata_ broad and blunt. Leaves were chosen by solidity, not size, since the largest component in a mask is often a stem fragment." class="img-fluid rounded z-depth-1" %}

Nine species, not ten. _L. canbyi_ is absent because its only mask cannot supply a leaf: the largest component in it is a stem sliver, 3,257 px at 0.55 solidity, against 0.93–0.97 for a clean blade. That is a thresholding failure, and dropping the species is more precise than showing debris under its name.

## Does outline alone identify a species?

Showing that the shapes differ is not the same as showing they _separate_. Each of the 104 thresholded masks yields multiple leaves, so the question can be asked quantitatively: **486 leaves from 88 specimens across 8 species**, each outline resampled to 128 equally spaced pseudo-landmarks, aligned, scaled to unit centroid size, and ordinated by PCA.

{% include figure.liquid path="assets/img/lobelia/shape_space.png" title="Leaf shape space, small multiples by species" alt="Eight small scatter panels, one per species, each plotting PC1 against PC2 with that species highlighted in green against all 486 leaves in grey. L. glandulosa sits far left; L. apalachicolensis and L. inflata sit right." caption="Small multiples rather than one eight-colour scatter, because points fall adjacent and eight categorical hues cannot be made reliably distinct. Grey is all 486 leaves; green the named species. _L. glandulosa_ holds the narrow extreme, _L. apalachicolensis_ and _L. inflata_ the broad end." class="img-fluid rounded z-depth-1" %}

**PC1 carries 48% of shape variance and is almost exactly leaf breadth.** Its correlation with directly measured width-to-length is **r = 0.978**, so the axis is a checked quantity, not a label I assigned by eye. Species order along it monotonically, from _L. glandulosa_ at a width:length of 0.109 to _L. apalachicolensis_ at 0.439. That axis is also where the species signal lives, and essentially nowhere else:

|                                         |       PC1 |   PC2 |
| --------------------------------------- | --------: | ----: |
| share of shape variance                 |       48% |   26% |
| between-species share of that axis (η²) | **0.493** | 0.006 |

PC2 is real variation. It is just variation _within_ plants, not between species.

Classifying species from outline alone, with **cross-validation grouped by specimen** so no leaf from a test plant is ever seen in training:

|                                                              |  accuracy |
| ------------------------------------------------------------ | --------: |
| LDA, grouped by specimen                                     | **0.372** |
| permuted-label null                                          |     0.166 |
| majority-class baseline                                      |     0.191 |
| _LDA, naive split (leaves of one plant span train and test)_ |   _0.430_ |

So outline alone runs at roughly **twice chance**. The naive split scores 6 points higher, which is the size of the pseudo-replication illusion you get free if you forget that ten leaves off one plant are not ten independent observations.

**What this does not show.** Sampling is uneven (93 leaves from _puberula_, 26 from _inflata_; 21 specimens for _glandulosa_, 3 for _apalachicolensis_), so per-species positions are not equally trustworthy. Absolute size is discarded by construction, and size is a real diagnostic character. Venation, margin dentition and pubescence are not in an outline at all. The whole thing is also **calibrated against itself**: PC1 is checked against my own width-to-length measurement of the same masks, not against any outside description of these plants. I tried the external version, ranking the eight species by the leaf-shape terms an independent published treatment gives them, and it was too underpowered to settle anything.

So outline is a genuine species character here, if a weak one, and worth measuring rather than assuming.

## Do the two analyses agree?

The 2024 measurements and the [outline ordination](#does-outline-alone-identify-a-species) I ran on the recovered masks in 2026 chase the same thing by different routes: area and perimeter off a thresholded leaf, versus 128 landmarks and PCA. They should agree. Mostly they do.

{% include figure.liquid path="assets/img/lobelia/shape_synthesis.png" title="Landmark shape versus perimeter-to-area, across 486 leaves" alt="Scatter of perimeter over square-root of area against PC1 of leaf outline for 486 leaves, showing a strong negative relationship, with species means labelled by leader lines and Lobelia glandulosa a clear outlier at the narrow end." caption="Every leaf measured both ways. **PC1 of the outline against perimeter/√area**, a dimensionless index, so leaf size cancels out and no calibration is needed. The two agree strongly (**r = −0.82**): narrow leaves carry more perimeter per unit area, exactly as they should." class="img-fluid rounded z-depth-1" %}

**Where they agree:** _L. glandulosa_ is the outlier on both, by a wide margin. Narrowest outline, and by far the most perimeter per unit area. The same species the 2024 plot picks out with the steepest slope, found two years apart by two methods that share no code and barely share a concept.

**Where they differ.** The 2024 figure fits a _straight_ line to perimeter against area, but for a fixed shape perimeter grows with the **square root** of area, so a straight-line slope depends on the range of leaf sizes a species happens to span. _L. elongata_ reaches ~30 cm² while the others stop near 5–10, and a line fitted across that wider range is necessarily shallower. Its gentle slope is therefore partly a size effect, and on the dimensionless index it sits mid-pack.

That doesn't undo the original result. It sharpens it: **perimeter/√area separates shape from size, where a raw area-versus-perimeter slope confounds them.**

## Why existing tools didn't fit

The morphometrics tooling was surveyed before anything was built, and most of it assumes material that digitized herbarium sheets never supply:

| tool               | outcome                                                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **MorphoLeaf**     | Needs single leaves on a clean, high-contrast, clutter-free background with uniform orientation. Herbarium sheets are none of those. |
| **LeafJ** (ImageJ) | Failed to detect whole leaves on our samples; manual correction was more work than measuring by hand.                                |
| **LeafMachine**    | Promising, but MATLAB-licensed.                                                                                                      |
| **MASS**           | Also MATLAB.                                                                                                                         |
| **TraitEx**        | Would not import our leaf images at all.                                                                                             |
| **Morphidas**      | Too little documentation to evaluate.                                                                                                |

That survey is why the pipeline above exists, and it points at the general lesson: the binding constraint here is rarely the model. It is that measurement tools assume an idealized input, and pressed specimens are the opposite of idealized. The flattened rosette is the sharpest case, where blades overlap and converge on a single point.

## Status

Completed undergraduate work, recorded here rather than maintained. Presented at **Michigan State University on 9 February 2024** as _Semi-Automated Extraction of Leaf Traits from Herbarium Vouchers_, and not written up for publication in its own right.

The 2,733-image corpus was assembled for a further step the project never reached: segmenting leaves straight off an intact sheet, to run the whole clade at aggregator scale. That design was worked out on **GinJinn2**, a herbarium-oriented wrapper over Detectron2, with a Mask R-CNN backbone and annotation in **CVAT**, and rehearsed end to end on the tool's own tutorial data. The talk files it under future work.

Supported by the **Choose Ohio First Scholarship Program**, the **Kent State Biotechnology Program**, and a **VT-REEL Undergraduate Research Fellowship**. Advised by **Dr. Andrea Case** with **Dr. Christopher Blackwood**, alongside Case lab members Tony Miller, Megan Brown, Princess Abu and Svea Hall.

Code and notes are on GitHub at [**musharna/lobelia-leaf-morphometrics**](https://github.com/musharna/lobelia-leaf-morphometrics): acquisition and Hough line-removal notebooks, GinJinn2 and annotation commands, the dismembered-sheet protocol, the tool survey, and the ledger the counts here come from. Notebook outputs are stripped and **no specimen imagery is included**: the raw sheets carry all-rights-reserved notices burned into the pixels regardless of the licence field on the aggregator record.

The wider programme has since published its phylogenomic arm, under the same NSF awards {% cite godden2025lobelia %}.

**Provenance.** Specimen images belong to their holding institutions; the GBIF download above is CC BY-NC 4.0. Counts come from the project's own acquisition ledger, with the two partial species tabs flagged in place.
