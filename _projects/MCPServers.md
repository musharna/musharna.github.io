---
layout: page
title: MCP Servers
description: Model Context Protocol servers that let an AI agent run the instrument, not just read about it — plant genomics, phenotyping, research-data acquisition, and the broker that schedules the GPU work.
img: assets/img/mcpservers/card.svg
importance: 1
category: research tooling
related_publications: false
---

Most of what an AI agent can reach through the **Model Context Protocol** is _retrieval_ —
search an index, fetch a record, summarize it. That is the easy tier, and it is crowded.

The harder tier is **compute**: tools that actually run the analysis, return a number that
did not exist before the call, and show enough of their working that the number can be
checked. These servers sit in that tier. Each one is on PyPI and speaks stdio, so it drops
into Claude Code or any MCP client with a single config entry.

## The servers

<div class="row mt-4">
<div class="col-md-6">
  <h3><a href="https://github.com/musharna/plant-genomics-mcp">plant-genomics-mcp</a></h3>
  <p><strong>50 tools across 23 public backends</strong> — Ensembl Plants, Phytozome,
  UniProt, AlphaFold DB, PDBe, InterPro, JASPAR, PANTHER, OrthoDB, AraGWAS, NCBI BLAST,
  Gramene, KEGG, STRING-DB, ATTED-II, BAR and more — plus cross-source synthesis, so a
  locus question does not become twenty browser tabs. stdio and Streamable-HTTP.</p>
</div>
<div class="col-md-6">
  <h3><a href="https://github.com/musharna/data-aggregator-mcp">data-aggregator-mcp</a></h3>
  <p>Unified research-data acquisition. Search and fetch datasets across <strong>Zenodo,
  DataCite, NCBI omics (GEO / SRA / BioProject)</strong> and the literature
  (PubMed, OpenAIRE) behind <em>one normalized model</em> — the point being that
  "find me data on X" stops depending on which registry you happened to guess.</p>
</div>
</div>

<div class="row mt-3">
<div class="col-md-6">
  <h3><a href="https://github.com/musharna/plantcv-mcp">plantcv-mcp</a></h3>
  <p>Exposes <strong>PlantCV as a measurement instrument</strong>: plant traits <em>and the
  segmentation overlay they were measured from</em>. Returning the overlay is the whole
  design — a trait value with no picture of what was segmented is a number you have to take
  on faith, and a wrong segmentation produces a perfectly plausible one.</p>
</div>
<div class="col-md-6">
  <h3><a href="https://github.com/musharna/ldraw-mcp">ldraw-mcp</a></h3>
  <p>Renders LDraw / LEGO models to images with <strong>real part geometry</strong> — studs,
  glass, tires — via headless Blender and ImportLDraw. It gives a vision-capable model eyes
  for brick builds, which turns "describe this model" into something it can actually check.
  The odd one out, and the most fun.</p>
</div>
</div>

## The thing underneath

<div class="row mt-3">
<div class="col-md-12">
  <h3><a href="https://github.com/musharna/jobd">jobd</a></h3>
  <p>A <strong>self-hostable, GPU-aware job broker</strong> for your own machines, with
  native MCP integration. Not a data server — it is what runs the work the others imply.
  Agents submit long jobs, the broker serializes GPU access across machines and sessions,
  and the job outlives the conversation that started it. It exists because "run this
  overnight" and "an agent starts it" are hard to hold together otherwise.</p>
</div>
</div>

## Install

All five are on PyPI:

```bash
pip install plant-genomics-mcp data-aggregator-mcp plantcv-mcp ldraw-mcp jobd
```

Each ships an MCP client config example in its README.

---

<div style="font-size:0.92em;">
<strong>Archived and citable</strong> — concept DOIs resolve to the latest release:<br>
<a href="https://doi.org/10.5281/zenodo.21636352">plant-genomics-mcp</a> ·
<a href="https://doi.org/10.5281/zenodo.21636332">data-aggregator-mcp</a> ·
<a href="https://doi.org/10.5281/zenodo.21636369">jobd</a><br>
See the <a href="{{ '/publications/' | relative_url }}">publications</a> page for full citations.
</div>
