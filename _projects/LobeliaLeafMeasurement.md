---
layout: page
title: Leaf measurement in Lobelia
description: Leaf area and perimeter measured from photographs of dismembered Lobelia sect. Lobelia vouchers.
img: assets/img/lobelia/truescale_plate.png
importance: 2
category: academic research
related_publications: true
---

Undergraduate research at Kent State University in Dr. Andrea Case's lab, supported by NSF award [DEB-2015606](https://www.nsf.gov/awardsearch/showAward?AWD_ID=2015606). The award uses _Lobelia_ sect. _Lobelia_ to study why close relatives do or do not live alongside each other. As an undergraduate I worked on measuring leaf traits from voucher photographs. The [_Lobelia_ silhouettes]({{ '/projects/LobeliaSilhouettes/' | relative_url }}) came earlier, in 2018–2019.

## Why leaf shape

Leaf shape varies between close relatives growing in the same place, and that variation is tied to how a leaf works: light interception, temperature, water supply and plasticity {% cite nicotra2011leafshape tsukaya2018leafshape %}. Comparing it across a group of species needs shape measured as numbers, for many plants.

_Lobelia_ sect. _Lobelia_ is an awkward case for this. It included 23 species as scoped when this work began, from the tall red-flowered _L. cardinalis_ to the small aquatic _L. dortmanna_. Several grow as basal rosettes, and a rosette pressed flat is a pile of overlapping leaves radiating from one point.

## What I did

1. Vouchers were taken apart and photographed so the leaves lie flat and separate.
2. I cropped leaves one by one in **ImageJ**, excluding by eye those too folded or torn to measure.
3. I measured leaf area and perimeter with the **`LeafArea`** R package, calibrated against a 1 cm scale.

In exploratory plots of the best-sampled species, the relationship between leaf perimeter and leaf area looked different between species, and between collection sites of _L. elongata_. This was not tested statistically. The specimen photographs and measurements belong to the Case lab and are not published here.

A deep-learning step to segment leaves directly from whole herbarium sheets was planned but not carried out.
