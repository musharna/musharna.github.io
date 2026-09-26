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
          description: "Research, and the software I built for it.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "Curriculum Vitae",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "projects-leaf-measurement-in-lobelia",
          title: 'Leaf measurement in Lobelia',
          description: "Leaf area and perimeter measured from photographs of dismembered Lobelia sect. Lobelia vouchers.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/LobeliaLeafMeasurement/";
            },},{id: "projects-lobelia-silhouettes",
          title: 'Lobelia Silhouettes',
          description: "Digitally restored herbarium specimens of Lobelia, reduced to true-scale silhouettes.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/LobeliaSilhouettes/";
            },},{id: "projects-mcp-servers",
          title: 'MCP Servers',
          description: "MCP servers for plant genomics research with LLMs: locus lookup, dataset search, phenotyping, phylogenetics, breeding simulation, and a job broker.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/MCPServers/";
            },},{id: "projects-orchids",
          title: 'Orchids',
          description: "Computer vision on orchids. An identification model, a GAN, and a hybrid visualizer.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/OrchidCLIP/";
            },},{id: "projects-orchid-gan",
          title: 'Orchid GAN',
          description: "Moved to the Orchids page.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/OrchidGAN/";
            },},{id: "projects-orchid-vision",
          title: 'Orchid Vision',
          description: "Moved to the Orchids page.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/OrchidVision/";
            },},{id: "projects-cattleya-hybrid-visualizer",
          title: 'Cattleya Hybrid Visualizer',
          description: "Moved to the Orchids page.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/OrchidVisualizer/";
            },},{id: "projects-taxon3d",
          title: 'Taxon3D',
          description: "A blind-comparison benchmark for AI-generated 3D models of living organisms, judged against reference photographs.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/Taxon3D/";
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
        id: 'social-huggingface',
        title: 'Huggingface',
        section: 'Socials',
        handler: () => {
          window.open("https://huggingface.co/musharna", "_blank");
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
