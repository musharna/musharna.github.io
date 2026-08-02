// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "publications",
          description: "Software I maintain, cited by concept DOI. Peer-reviewed publications will appear here as they are published.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "Computer vision on the long tail of plant diversity, and the research tooling built along the way.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "projects-automating-leaf-measurement",
          title: 'Automating leaf measurement',
          description: "Extracting leaf traits from digitized herbarium specimens of Lobelia sect. Lobelia at aggregator scale.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/LobeliaLeafMeasurement/";
            },},{id: "projects-lobelia-silhouettes",
          title: 'Lobelia Silhouettes',
          description: "Digitally restored herbarium specimens of Lobelia, reduced to true-scale silhouettes.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/LobeliaSilhouettes/";
            },},{id: "projects-mcp-servers",
          title: 'MCP Servers',
          description: "Model Context Protocol servers that let an AI agent run the instrument, not just read about it — plant genomics, phenotyping, research-data acquisition, and the broker that schedules the GPU work.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/MCPServers/";
            },},{id: "projects-orchidclip",
          title: 'OrchidCLIP',
          description: "A long-tail-aware CLIP model for fine-grained orchid identification across 5,124 species.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/OrchidCLIP/";
            },},{id: "projects-orchid-gan",
          title: 'Orchid GAN',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/OrchidGAN/";
            },},{id: "projects-orchid-vision",
          title: 'Orchid Vision',
          description: "A computer-vision program built on orchids - generation, recognition, and guided hybridization - because the long tail is where fine-grained models actually break.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/OrchidVision/";
            },},{id: "projects-cattleya-hybrid-visualizer",
          title: 'Cattleya Hybrid Visualizer',
          description: "What would this orchid cross look like? SDXL steered by a botanical phenotype engine, for hybrids that take 4-7 years to actually flower.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/OrchidVisualizer/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%61%6D%69%63%68%61%65%6C%31%39@%76%74.%65%64%75", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/musharna", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0009-0003-4055-5238", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
