---
layout: page
title: MCP Servers
description: "MCP servers for plant genomics and research with LLMs: locus lookup, dataset search, phenotyping, phylogenetics, breeding simulation, and the job broker that runs the heavy work."
img: assets/img/mcpservers/card.svg
importance: 1
category: research tooling
related_publications: false
---

These are the Model Context Protocol servers I maintain. Most of them are for plant
genomics: they let an agent in Claude Code or any other MCP client look up a locus, pull
a dataset, measure a plant image, build a tree or simulate a breeding programme without
leaving the conversation. Each one is on PyPI and speaks stdio, so it needs one config
entry to install.

The design rule I try to hold across all of them is simple: when a tool computes a
number, it also returns what the number was computed from. A trait comes with its
segmentation mask, a tree with its bootstrap values, a breeding outcome with its spread
across replicates. That is not decoration. In each of these cases a wrong answer looks
exactly like a right one until you see the supporting output.

## Genomics

<div class="row mt-4">
<div class="col-md-6">
  <h3><img src="{{ '/assets/img/mcpservers/plant-genomics-mcp.png' | relative_url }}" alt="" width="48" height="48" style="vertical-align: middle; border-radius: 10px; margin-right: 12px;"><a href="https://github.com/musharna/plant-genomics-mcp">plant-genomics-mcp</a></h3>
  <p><strong>53 tools across 23 public backends</strong>: Ensembl Plants, Phytozome,
  UniProt, AlphaFold DB, PDBe, InterPro, JASPAR, PANTHER, OrthoDB, AraGWAS, NCBI BLAST,
  Gramene, KEGG, STRING-DB, ATTED-II, BAR and more. Includes cross-source synthesis tools
  so one locus question does not turn into twenty browser tabs. stdio and Streamable-HTTP.
  There is a hosted demo on <a href="https://huggingface.co/spaces/musharna/plant-genomics-mcp">Hugging Face Spaces</a>.</p>
</div>
<div class="col-md-6">
  <h3><img src="{{ '/assets/img/mcpservers/data-aggregator-mcp.png' | relative_url }}" alt="" width="48" height="48" style="vertical-align: middle; border-radius: 10px; margin-right: 12px;"><a href="https://github.com/musharna/data-aggregator-mcp">data-aggregator-mcp</a></h3>
  <p>Search and fetch datasets across <strong>Zenodo, DataCite, NCBI omics (GEO / SRA /
  BioProject)</strong> and the literature (PubMed, OpenAIRE) through one interface with
  one record format. Finding data on a topic stops depending on which registry you
  happened to guess first.</p>
</div>
</div>

<div class="row mt-3">
<div class="col-md-6">
  <h3><img src="{{ '/assets/img/mcpservers/plantcv-mcp.png' | relative_url }}" alt="" width="48" height="48" style="vertical-align: middle; border-radius: 10px; margin-right: 12px;"><a href="https://github.com/musharna/plantcv-mcp">plantcv-mcp</a></h3>
  <p>Plant trait measurement with <strong>PlantCV</strong>. Every call returns the trait
  values <em>and the segmentation overlay they were measured from</em>. A bad segmentation
  still produces a plausible-looking leaf area, so the overlay is the only way to catch it.</p>
</div>
<div class="col-md-6">
  <h3><img src="{{ '/assets/img/mcpservers/phylokit-mcp.png' | relative_url }}" alt="" width="48" height="48" style="vertical-align: middle; border-radius: 10px; margin-right: 12px;"><a href="https://github.com/musharna/phylokit-mcp">phylokit-mcp</a></h3>
  <p>Phylogenetic inference with <strong>IQ-TREE 2</strong> via piqtree.
  <code>infer_tree</code> always runs a bootstrap and returns per-clade support. On an
  alignment simulated from a known 7-taxon tree and cut to 60 sites, the returned topology
  contained a clade that does not exist, and the support values were the only part of the
  output that said so.</p>
</div>
</div>

<div class="row mt-3">
<div class="col-md-6">
  <h3><img src="{{ '/assets/img/mcpservers/breedsim-mcp.png' | relative_url }}" alt="" width="48" height="48" style="vertical-align: middle; border-radius: 10px; margin-right: 12px;"><a href="https://github.com/musharna/breedsim-mcp">breedsim-mcp</a></h3>
  <p>Breeding-scheme simulation with <strong>AlphaSimR</strong>, genomic selection included.
  <code>run_program</code> runs several replicates and reports per-cycle mean, standard
  deviation and confidence interval. Five seeds of the same three-cycle programme gave
  genetic gains with <strong>sd 0.247</strong>, which is why a single run is not an answer.</p>
</div>
<div class="col-md-6">
  <h3><img src="{{ '/assets/img/mcpservers/jobd.png' | relative_url }}" alt="" width="48" height="48" style="vertical-align: middle; border-radius: 10px; margin-right: 12px;"><a href="https://github.com/musharna/jobd">jobd</a></h3>
  <p>A <strong>self-hosted, GPU-aware job broker</strong> for your own machines, with the
  queue exposed over MCP. An agent submits a long job, the broker routes it by GPU and tool
  tags and serializes GPU access across machines and sessions, and the job outlives the
  conversation that started it. It is what runs the heavy work the other servers imply.</p>
</div>
</div>

## Not genomics

<div class="row mt-3">
<div class="col-md-6">
  <h3><img src="{{ '/assets/img/mcpservers/ldraw-mcp.png' | relative_url }}" alt="" width="48" height="48" style="vertical-align: middle; border-radius: 10px; margin-right: 12px;"><a href="https://github.com/musharna/ldraw-mcp">ldraw-mcp</a></h3>
  <p>Renders LDraw / LEGO models to images with <strong>real part geometry</strong> (studs,
  glass, tires) through headless Blender and ImportLDraw, so a vision-capable model can
  actually look at a brick build instead of guessing from a parts list.</p>
</div>
<div class="col-md-6">
  <h3><img src="{{ '/assets/img/mcpservers/tmodloader-mcp.png' | relative_url }}" alt="" width="48" height="48" style="vertical-align: middle; border-radius: 10px; margin-right: 12px;"><a href="https://github.com/musharna/tmodloader-mcp">tmodloader-mcp</a></h3>
  <p>Drives a running <strong>tModLoader</strong> (Terraria) instance from an agent: launch
  it, query it, screenshot it, and read the game state back as structured data. Built for
  testing mods with an agent in the loop.</p>
</div>
</div>

## Install

```bash
pip install plant-genomics-mcp data-aggregator-mcp plantcv-mcp phylokit-mcp jobd ldraw-mcp tmodloader-mcp
```

`breedsim-mcp` is also on PyPI but needs R 4.3 or newer with a shared library, and
installing it compiles AlphaSimR, which takes minutes rather than seconds. Its README
covers the prerequisites.

Each server ships an MCP client config example in its README.

---

<div style="font-size:0.92em;">
<strong>Archived and citable</strong> — concept DOIs resolve to the latest release:<br>
<a href="https://doi.org/10.5281/zenodo.21636352">plant-genomics-mcp</a> ·
<a href="https://doi.org/10.5281/zenodo.21636332">data-aggregator-mcp</a> ·
<a href="https://doi.org/10.5281/zenodo.21713516">plantcv-mcp</a> ·
<a href="https://doi.org/10.5281/zenodo.21713870">phylokit-mcp</a> ·
<a href="https://doi.org/10.5281/zenodo.21713210">breedsim-mcp</a> ·
<a href="https://doi.org/10.5281/zenodo.21713452">ldraw-mcp</a> ·
<a href="https://doi.org/10.5281/zenodo.21636369">jobd</a><br>
See the <a href="{{ '/publications/' | relative_url }}">publications</a> page for full citations.
</div>
