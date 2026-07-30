# musharna.github.io

Source for **[musharna.github.io](https://musharna.github.io)** — the personal site of Jaret
Arnold, a PhD student in Genetics, Bioinformatics and Computational Biology (GBCB) at Virginia
Tech, in [Clay Wright's lab](https://sites.google.com/vt.edu/wrightlab) and co-advised by
[David Haak](https://spes.vt.edu/faculty-staff/faculty/haak-david.html).

The work is bioinformatics for synthetic biology and plant science — particularly what computer
vision, machine learning and data science can do for agriculture.

## What is on the site

| Page                                                               | Contents                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`/`](https://musharna.github.io/)                                 | About, contact, links                                                                                                                                                                                                                                                                                                    |
| [`/projects/`](https://musharna.github.io/projects/)               | Project index, grouped by category                                                                                                                                                                                                                                                                                       |
| [Orchid Vision](https://musharna.github.io/projects/OrchidVision/) | Umbrella page for the orchid computer-vision work: [OrchidGAN](https://musharna.github.io/projects/OrchidGAN/) (generative), [orchid-clip-v8](https://musharna.github.io/projects/OrchidCLIP/) (recognition), [Cattleya Hybrid Visualizer](https://musharna.github.io/projects/OrchidVisualizer/) (guided hybridization) |
| [MCP Servers](https://musharna.github.io/projects/MCPServers/)     | Model Context Protocol servers: plant-genomics-mcp, data-aggregator-mcp, plantcv-mcp, ldraw-mcp, and the jobd broker                                                                                                                                                                                                     |
| [`/publications/`](https://musharna.github.io/publications/)       | Zenodo-archived software, by concept DOI                                                                                                                                                                                                                                                                                 |

Several project pages carry live interactive demos (latent-space sampling, style mixing,
interpolation) driven by static assets under `assets/img/orchidgan/`.

## Running it locally

Ruby 3.3.5, matching CI:

```bash
bundle install
bundle exec jekyll serve   # http://localhost:4000
```

`bundle exec jekyll build` writes to `_site/`. Image processing needs `imagemagick`; the
notebook filter needs `nbconvert`. Docker is an alternative — `docker compose up` uses the
`Dockerfile` / `docker-compose.yml` in this repo.

## CI

Every workflow here runs against **this** site; none are inherited-but-inert.

| Workflow                | Trigger                      | Does                                                                                                                                                                                                                         |
| ----------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `deploy.yml`            | push to `main`, and every PR | Builds with Jekyll, purges unused CSS, publishes `_site` to `gh-pages`. The PR run builds but does not deploy, so a build break is caught before merge.                                                                      |
| `axe.yml`               | manual dispatch              | Accessibility audit via `@axe-core/cli`. Targets come from the built `sitemap.xml`, so **every published page is covered automatically** and a new page needs no workflow change. Optional `url` input checks a single page. |
| `broken-links-site.yml` | after a successful deploy    | lychee over the **built** site, internal and external links. Runs against `_site` rather than source `.md`, so Liquid is already resolved.                                                                                   |
| `codeql.yml`            | push, PR, schedule           | Static analysis.                                                                                                                                                                                                             |
| `prettier.yml`          | push, PR                     | Formatting check for authored files.                                                                                                                                                                                         |
| `update-citations.yml`  | schedule, dispatch           | Refreshes publication citations.                                                                                                                                                                                             |
| `update-tocs.yml`       | push, dispatch               | Regenerates tables of contents.                                                                                                                                                                                              |

Accessibility is currently clean: **8 of 8 published pages report zero axe violations**, and
the pygments syntax theme was re-toned to meet WCAG 2 AA contrast (4.5:1) in both light and
dark mode.

## Layout

```
_pages/        top-level pages (about, projects, publications, 404)
_projects/     one file per project; `category` drives the grouping on /projects/
_includes/     partials, including the interactive OrchidGAN demo widgets
_layouts/      page templates
_sass/         styles; theme colours live in _sass/_themes.scss
_bibliography/ papers.bib -> /publications/
assets/        images, JS, CSS
```

To add a project: drop a file in `_projects/` with `title`, `description`, `img`, `importance`
and `category` front matter. A new `category` value must also be listed in
`_pages/projects.md`'s `display_categories` to appear as its own section.

Work in progress lives in `_projects/` but is listed under `exclude:` in `_config.yml` until it
is ready to publish. `_config.yml`'s exclude block carries inline notes explaining each entry —
worth reading before changing it, because excluding a page does **not** unpublish assets under
`assets/`, which Jekyll copies verbatim.

## Credits

Built on the [**al-folio**](https://github.com/alshedivat/al-folio) Jekyll theme by Maruan
Al-Shedivat and contributors, used under the MIT licence; `LICENSE` retains that notice.
`INSTALL.md`, `CUSTOMIZE.md` and `FAQ.md` are upstream's documentation, kept as
version-matched reference for maintaining this fork. They are excluded from the build.

Site content and the project write-ups are Jaret Arnold's own.
