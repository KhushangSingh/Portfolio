import { OTAKU_CIRCLE_CASE_STUDY, OTAKU_CIRCLE_LIVE } from './otakuCircle';

export const designData = {
  hero: {
    titlePrefix: "Product Designer",
    titleSuffix: "UX Engineer",
    bio: "I am a Product Designer who bridges the gap between user empathy and technical execution, specializing in problem-driven UX solutions and end-to-end application development.",
    steps: [
      {
        id: "01",
        number: "01",
        title: "UX Research",
        tagline: "User Empathy & Discovery",
        desc: "Uncovering user pain points, mapping user flows and conducting usability audits to inform evidence-backed UX decisions."
      },
      {
        id: "02",
        number: "02",
        title: "Product Design",
        tagline: "Architecture & Visual Systems",
        desc: "Crafting end-to-end SaaS workflows, high-fidelity UI and unified design token architectures in Figma."
      },
      {
        id: "03",
        number: "03",
        title: "Design Engineering",
        tagline: "Interactive Components & Code",
        desc: "Translating design systems into modular, production-ready React components with Tailwind CSS & Framer Motion."
      },
      {
        id: "04",
        number: "04",
        title: "Scalable Systems",
        tagline: "Production & Scale",
        desc: "Ensuring WCAG accessibility, fluid responsive breakpoints and seamless engineering hand-off."
      }
    ]
  },

  favoriteMusic: {
    title: "DTMF (DeBÍ TiRAR MáS FOToS)",
    artist: "Bad Bunny",
    audioUrl: "/audio/bad_bunny_dtmf.mp3",
    cdnUrl: "https://archive.org/download/bad-bunny-dtmf-lyrics/Bad%20bunny%20Dtmf%20%28lyrics%29.mp3"
  },

  about: {
    title: "About Me",
    description: "Hey, glad you're here. If you're building a product that needs to feel **thoughtful**, **fast** and engineered with **real craft** rather than generic templates, this is where we connect.\n\nI don't just hand off static **Figma frames** and hope for the best. I build **scalable design systems**, obsess over **user friction** and write the **production React code** that brings complex software to life.",
    resumeUrl: "/images/designResume.pdf",
    portraitUrl: "/images/orange_geometric_portrait.svg",
    portraitPngUrl: "/images/orange_geometric_portrait.png",
    portraitDarkUrl: "/images/neon_thermal_portrait.webp",
    education: {
      degree: "B.Tech in Computer Science & Engineering",
      college: "Vellore Institute of Technology (VIT)", 
      year: "2023 - 2027 (Currently Pursuing)"
    }
  },

  services: [
    { 
      id: 1,
      title: "Product Design", 
      desc: "Designing scalable end-to-end solutions, complex SaaS workflows and user-centric web applications." 
    },
    { 
      id: 2,
      title: "Design Engineering", 
      desc: "Building production-ready design systems, accessible component libraries and frontend architecture in React." 
    },
    { 
      id: 3,
      title: "UX Research & Systems", 
      desc: "Conducting heuristic evaluations, user flows and usability audits to validate real user needs." 
    }
  ],

  sections: [
    {
      id: "product-design",
      label: "Product Design",
      filters: ["All", "Web Applications", "Mobile Apps", "SaaS"],
      projects: [
        {
          id: 1,
          title: "OtakuCircle",
          subCat: "Web Applications",
          role: "Product Designer & Full Stack Dev",
          image: "/images/otakucircle_cover.jpg",
          desc: "A social platform for anime enthusiasts to browse, review and track their journey with friends.",
          longDesc: "OtakuCircle bridges the gap between cataloging and social interaction. Designed an immersive obsidian dark UI with frosted glassmorphism, 2:3 aspect ratio poster dynamics and AI vibe-based recommendation architecture.",
          tools: "Figma, React, Tailwind CSS",
          timeline: "4 Weeks",
          live: OTAKU_CIRCLE_LIVE,
          caseStudy: OTAKU_CIRCLE_CASE_STUDY,
          github: "",
          tags: ["Web Applications", "SaaS", "Product Design"],
          gallery: ["/images/otakucircle_cover.jpg"]
        },
        {
          id: 2,
          title: "SquadSync",
          subCat: "Web Applications",
          role: "Product Designer & Full Stack Dev",
          image: "/images/squadsync_cover.jpg",
          desc: "Collaboration platform connecting students based on competency with a 'Request & Approval' workflow.",
          longDesc: "Engineered user onboarding and merit-based team formation flows. Replaced chaotic social groups with structured skill-matching logic and applicant review dashboards.",
          tools: "Figma, React, Tailwind CSS",
          timeline: "2 Weeks",
          tags: ["Web Applications", "SaaS", "Product Design"],
          gallery: ["/images/squadsync_cover.jpg"]
        },
        {
          id: 3,
          title: "Ledgerly",
          subCat: "Web Applications",
          role: "Product Designer & Full Stack Dev",
          desc: "A centralized digital library designed for curating and managing high-utility professional resources.",
          longDesc: "Ledgerly is a comprehensive 'LinkHub' built to eliminate the chaos of scattered bookmarks. It provides a structured environment where developers and designers can discover domain-specific tools (ranging from Generative AI to UI kits) and maintain secure, personalized repositories for instant access. The platform focuses on high-speed retrieval and a clean, clutter-free user experience.",
          tools: "Figma, React, Framer Motion, Tailwind CSS",
          timeline: "2 Weeks",
          github: "https://github.com/KhushangSingh/Ledgerly",
          live: "https://ledgerly-ks.vercel.app/",
          image: "/images/ledgerly_cover.jpg",
          tags: ["Web Applications", "SaaS", "Product Design"],
          gallery: [
            "images/LedgerlyProject/Ledgerly-LandingPage.png",
            "images/LedgerlyProject/Ledgerly-LinkHub-GridView.png",
            "images/LedgerlyProject/Ledgerly-Categories-GirdView.png",
            "images/LedgerlyProject/Ledgerly-Community.png",
            "images/LedgerlyProject/Ledgerly-Tools.png",
            "images/LedgerlyProject/Ledgerly-Vault.png",
          ]
        },
        {
          id: 4,
          title: "ClanForge",
          subCat: "SaaS",
          role: "Product Designer & Frontend Engineer",
          desc: "End-to-end guild management and team analytics SaaS featuring role-based matchmaking and real-time activity metrics.",
          longDesc: "Designed complex administrative dashboards, team roster scheduling and permission matrices for high-velocity gaming communities and competitive esports squads.",
          tools: "Figma, React, Next.js, Tailwind CSS",
          timeline: "3 Weeks",
          image: "/images/UnderDevelopment.png",
          tags: ["SaaS", "Web Applications", "Product Design"],
          gallery: ["/images/UnderDevelopment.png"]
        }
      ]
    },
    {
      id: "design-engineering",
      label: "Design Engineering",
      filters: ["All", "Design Systems", "Component Libraries", "Frontend Development"],
      projects: [
        {
          id: 101,
          title: "Glasio UI",
          subCat: "Design Systems",
          role: "Design Systems Engineer",
          image: "/images/UnderDevelopment.png",
          desc: "A dark-mode glassmorphic design system and React component library built with accessibility-first tokens and fluid micro-interactions.",
          longDesc: "Glasio UI bridges Figma design tokens with production code. Features a 60-30-10 dark canvas hierarchy, 8pt spatial grid, WCAG 2.1 AA compliant contrast ratios, accessible form controls and hardware-accelerated Framer Motion interactions.",
          tools: "Figma, React, Tailwind CSS, Storybook, Framer Motion",
          timeline: "4 Weeks",
          tags: ["Design Systems", "Component Libraries", "Design Engineering"],
          gallery: ["/images/UnderDevelopment.png"]
        },
        {
          id: 102,
          title: "OtakuCircle Design System (OS-DS)",
          subCat: "Component Libraries",
          role: "Design Engineer",
          image: "/images/UnderDevelopment.png",
          desc: "Production-grade design system specification and component suite powering the OtakuCircle social platform.",
          longDesc: "Centralized token architecture connecting Tailwind CSS with custom React molecules: optimistic WatchStatusDropdown, snap carousel AnimeSection and real-time NotificationProvider toasts.",
          tools: "Figma, React, Tailwind CSS, Lucide Icons",
          timeline: "Production Standard",
          tags: ["Component Libraries", "Design Systems", "Design Engineering"],
          gallery: [
            "/images/UnderDevelopment.png"
          ]
        },
        {
          id: 103,
          title: "Ledgerly UI Architecture",
          subCat: "Frontend Development",
          role: "Frontend & UX Engineer",
          image: "images/LedgerlyProject/Ledgerly-LandingPage.png",
          desc: "High-performance frontend architecture featuring optimistic state caching, responsive glass grid views and quick-save APIs.",
          longDesc: "Built with React and Tailwind CSS, focusing on micro-interactions, low-latency search filtering and seamless desktop-to-mobile drawer transitions.",
          tools: "React, Framer Motion, Tailwind CSS, Express",
          timeline: "2 Weeks",
          github: "https://github.com/KhushangSingh/Ledgerly",
          live: "https://ledgerly-ks.vercel.app/",
          tags: ["Frontend Development", "Design Engineering"],
          gallery: [
            "images/LedgerlyProject/Ledgerly-LandingPage.png",
            "images/LedgerlyProject/Ledgerly-LinkHub-GridView.png"
          ]
        }
      ]
    },
    {
      id: "research",
      label: "UX Research",
      filters: ["All", "Heuristic Evaluation", "User Flows", "Usability Testing"],
      projects: [
        {
          id: 201,
          title: "McDelivery Redesign",
          subCat: "Heuristic Evaluation",
          role: "UX Researcher",
          image: "/images/McDonaldsUXResearchCover.jpg",
          desc: "Heuristic evaluation identifying 7 critical usability issues and redesigning core navigation for reduced order friction.",
          longDesc: "Applied Nielsen's 10 Usability Heuristics to analyze the McDelivery ordering journey. Discovered major pain points in cart modification, address verification and delivery tracking, leading to high drop-off rates. Redesigned core user flows to reduce task completion time.",
          tools: "FigJam, Maze, Heuristic Evaluation",
          timeline: "2 Weeks",
          tags: ["Heuristic Evaluation", "UX Research"],
          gallery: [
            "/images/McDelivery UI UX Analysis - Khushang Singh.pdf"
          ]
        },
        {
          id: 202,
          title: "OtakuCircle Social & Discovery Flow",
          subCat: "User Flows",
          role: "UX Researcher & Designer",
          image: "/images/UnderDevelopment.png",
          desc: "Optimized 1-click cataloging and peer recommendation user flows to eliminate interaction lag and cognitive overload.",
          longDesc: "Mapped end-to-end task flows for anime discovery, status toggling and peer recommendations. Conducted user walkthroughs to refine microcopy and validate optimistic feedback states.",
          tools: "Figma, FigJam, User Testing",
          timeline: "2 Weeks",
          tags: ["User Flows", "Usability Testing", "UX Research"],
          gallery: [
            "/images/UnderDevelopment.png"
          ]
        }
      ]
    },
    {
      id: "playground",
      label: "Playground",
      filters: ["All", "Branding", "Identity", "Visual Design", "Concepts"],
      projects: [
        {
          id: 301,
          title: "EV Club Website",
          subCat: "Identity",
          role: "Visual Designer",
          image: "/images/EVClubWebCover.png",
          desc: "Established the visual strategy and developed a cohesive club identity for The Electric Vehicle Club.",
          longDesc: "Created brand guidelines, color palettes, vector assets and promotional materials that communicate sustainability and futuristic engineering.",
          tools: "Illustrator, Photoshop, Figma",
          timeline: "1 Month",
          tags: ["Identity", "Branding", "Visual Design"],
          gallery: [
            "/images/EVClubWebCover.png"
          ]
        },
        {
          id: 302,
          title: "Anime Key Visual Concepts",
          subCat: "Visual Design",
          role: "Visual & Concept Designer",
          image: "/images/UnderDevelopment.png",
          desc: "Explorations in cinematic typography, lighting and key visual poster design inspired by modern anime aesthetics.",
          longDesc: "Personal design playground exploring composition, texture overlays and dual-tone lighting techniques.",
          tools: "Photoshop, Figma",
          timeline: "Ongoing",
          tags: ["Visual Design", "Concepts"],
          gallery: ["/images/UnderDevelopment.png"]
        }
      ]
    }
  ],

  certifications: [
    {
      id: 1,
      title: "Google UX Design Professional Certification",
      issuer: "Coursera",
      date: "June 22nd, 2024",
      image: "/images/Google UX Design Professional Certificate.png",
      desc: "A comprehensive professional certificate program by Google covering the full UX design process: empathizing with users, defining pain points, ideating solutions, creating wireframes and prototypes and iterating on designs. Includes building a professional portfolio.",
      skills: [
        "User Experience (UX) Design",
        "Figma",
        "Wireframing",
        "Prototyping",
        "UX Research",
        "Usability Testing",
        "User-Centered Design",
        "Responsive Web Design",
        "Accessibility",
        "Design Systems"],
      credentialLink: "https://coursera.org/verify/professional-cert/CZ3FPEDRYFT2"
    },
    {
      id: 2,
      title: "Accenture Product Design Job Simulation",
      issuer: "Forage",
      date: "Feb 3rd, 2025",
      image: "/images/Accenture - Product Design Job Simulation.png",
      desc: "Completed a simulation focused on how the Product Design team can transform a user's experience. Added a new feature, iterated on an existing product screen and communicated design decisions.",
      skills: ["Product Design", 
        "Figma", "UI/UX Design", 
        "Product Strategy", 
        "Design Rationale", 
        "Product Thinking", 
        "Critical Thinking"],
      credentialLink: "https://www.theforage.com/verify/8GQZENY763oZnLQQY"
    },
    {
      id: 3,
      title: "Responsive Web Design",
      issuer: "freeCodeCamp",
      date: "April 13th, 2024",
      image: "images/Responsive Web Design.jpeg",
      desc: "Successfully completed the Developer Certification representing approximately 300 hours of coursework. Mastered responsive web design principles using HTML5 and CSS3 to build mobile-friendly interfaces.",
      skills: ["HTML5", "CSS3", "Responsive Design", "Flexbox", "CSS Grid", "Accessibility", "Media Queries"],
      credentialLink: "https://freecodecamp.org/certification/KhushangSingh/responsive-web-design"
    }
  ],

  footer: {
    email: "khushang8508@gmail.com",
    mainActionLink: "https://www.linkedin.com/in/khushangsingh2004",
    socials: [
        { label: "Behance", url: "https://www.behance.net/Khushangsingh" },
        { label: "Dribbble", url: "https://dribbble.com/khushangSingh" },
        { label: "Medium", url: "https://medium.com/@khushangsingh" },
        { label: "LinkedIn", url: "https://www.linkedin.com/in/khushangsingh2004" }
    ],
    navLinks: [
        { label: "Home", url: "#hero-page" },
        { label: "Projects", url: "projects" },
        { label: "About", url: "#about" }
    ]
  }
};

// Backwards-compatibility export to prevent import resolution errors
export const devData = {};