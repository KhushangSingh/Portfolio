// ---------------------------------------------------------------------------------------------
//                                           DEVELOPER DATA
// ---------------------------------------------------------------------------------------------

export const devData = {
  hero: {
    description: "I am a pre-final year B.Tech CSE student passionate about solving real-world problems. Bridging the gap between creative design and robust engineering, I am currently seeking internship opportunities to apply my skills.",
  },
  
  marquee: [
    "JAVA", 
    "DATA STRUCTURES", 
    "WEB DEVELOPMENT", 
    "PROBLEM SOLVING",
    "AWS", 
    "REACT.JS",
    "NODE.JS",
    "GIT & GITHUB",
    "REST API",
    "AGILE"
  ],
  
  skills: [
    { name: "Java", category: "Core" },
    { name: "React", category: "Frontend" },
    { name: "Node.js", category: "Backend" },
    { name: "AWS", category: "Cloud" },
    { name: "MongoDB", category: "Database" },
    { name: "DSA", category: "Logic" },
  ],

  about: {
    bio: "My journey started with a sketchbook, not a keyboard. As a District Gold Medalist in Karate and an art enthusiast, I learned discipline and creativity early on. Now, I channel that focus into Data Structures and Full Stack Development. I love dissecting complex problems and building user-centric interfaces.",
    resumeUrl: "/images/devResume.pdf",
    education: {
      degree: "B.Tech in Computer Science & Engineering",
      college: "Vellore Institute of Technology (VIT)", 
      year: "2023 — 2027 (Currently Pursuing)",
      grade: "" 
    },
    hobbies: ["Sketching", "Sports", "Traveling", "Anime"]
  },

  certifications: [
    {
      id: 1,
      title: "Full-Stack Web Development",
      issuer: "Udemy",
      date: "Sept 5th, 2025",
      image: "/images/Full-Stack Web Development.jpg",
      desc: "A comprehensive 61.5-hour bootcamp led by Dr. Angela Yu, covering the MERN stack architecture and RESTful API design.",
      skills: ["React.js", "Node.js", "Express.js", "PostgreSQL", "REST APIs", "Authentication", "MongoDB"],
      credentialLink: "https://www.udemy.com/certificate/UC-1dfb01bc-0c97-4def-9861-ad939a306fb3/"
    },
    {
      id: 2,
      title: "AWS Technical Essentials",
      issuer: "Amazon Web Services (AWS)",
      date: "Sept 17th, 2025",
      image: "/images/AWS Technical Essentials.png",
      desc: "A fundamental course introducing essential AWS services including compute (EC2, Lambda), storage (S3), databases (RDS, DynamoDB), networking, and security (IAM) for building scalable cloud solutions.",
      skills: ["Amazon EC2","Amazon S3", "AWS Lambda", "CloudWatch", "Amazon RDS", "DynamoDB", "IAM" ],
      credentialLink: ""
    },
    {
      id: 3,
      title: "Google IT Support Professional Certificate",
      issuer: "Coursera",
      date: "Dec 30th, 2025",
      image: "/images/Google IT Support Professional Certificate.png",
      desc: "A comprehensive 6-course program developed by Google to master IT fundamentals: troubleshooting, customer service, networking, operating systems, system administration, and security.",
      skills: ["Technical Support", "Linux", "Computer Networking", "Git", "System Administration", "IT Security"],
      credentialLink: "https://coursera.org/verify/professional-cert/7ZLNDC0TXM8P"
    },
    {
      id: 4,
      title: "AWS Cloud Support Associate",
      issuer: "Coursera",
      date: "Dec 30th, 2025",
      image: "/images/AWS Cloud Support Associate Professional Certificate.png",
      desc: "A comprehensive program designed for cloud support roles, covering advanced troubleshooting, incident management, and AWS services like IAM, CloudWatch, and CloudFormation.",
      skills: ["AWS IAM", "CloudWatch", "Network Troubleshooting", "Linux", "CloudFormation", "Root Cause Analysis", "Customer Service"],
      credentialLink: "https://coursera.org/verify/professional-cert/UHMXCTX9ODYC"
    },
    {
      id: 5,
      title: "Google Project Management Professional Certificate",
      issuer: "Coursera",
      date: "Dec 31st, 2025",
      image: "/images/Google Project Management Professional Certificate.png",
      desc: "An immersive 7-course program covering the full project management lifecycle, including Agile and Waterfall methodologies, risk management, stakeholder analysis, and strategic communication.",
      skills: ["Project Management", "Agile & Scrum", "Risk Management", "Stakeholder Management", "Change Management", "Project Planning"],
      credentialLink: "https://coursera.org/verify/professional-cert/ACRROX4GT3O0"
    },
    {
      id: 6,
      title: "Introduction to Large Language Models",
      issuer: "Coursera",
      date: "Nov 12th, 2025",
      image: "/images/Introduction to Large Language Models.png",
      desc: "A foundational course by Google Cloud exploring the definition of LLMs, their use cases, prompt tuning techniques, and Google's Gen AI development tools.",
      skills: ["Generative AI", "Prompt Engineering", "Large Language Models (LLM)", "Google Gemini", "LLM Applications"],
      credentialLink: "https://coursera.org/verify/L1G6R2XQS6ZJ"
    },
  ],

  projects: [
    {
      id: 1,
      title: "OtakuCircle",
      role: "Sole Developer • Dec 2025",
      desc: "A social anime discovery platform utilizing Hybrid Microservices to bridge the gap between tracking and community.",
      longDesc: "OtakuCircle is a Hybrid Microservice application designed to transform anime tracking into a shared social experience. Unlike standard cataloging tools, it incorporates a 'Social Activity' system and an AI-powered recommendation engine (built with Python). Users can browse, review, track their journey alongside friends, viewing watch histories and visualizing consumption habits through statistical dashboards.",
      features: ["AI-Powered Recommendations", "AI-Powered Search", "Social Activity System", "Statistical Dashboard", "Friend Watch History"],
      tags: ["MERN Stack", "Python", "AI", "Hybrid Microservices"],
      image: "/images/OtakuCircleProject/OC-LandingPage.png",
      gallery: [
        "/images/OtakuCircleProject/OC-LandingPage.png", 
        "/images/OtakuCircleProject/OC-TrendingNow.png", 
        "/images/OtakuCircleProject/OC-SmartSearch.png", 
        "/images/OtakuCircleProject/OC-ForYou.png", 
        "/images/OtakuCircleProject/OC-FriendsPage.png", 
        "/images/OtakuCircleProject/OC-UserProfile.png"],
      github: "",
      live: ""
    },
    {
      id: 2,
      title: "SquadSync",
      role: "Sole Developer • Nov 2025",
      desc: "Student collaboration platform for finding skilled teammates.",
      longDesc: "SquadSync bridges the gap between isolation and collaboration by enabling students to form teams based on merit and specific project requirements rather than just immediate friends. Implemented a 'Request & Approval' workflow that allows team creators to review applicant details and verify skills before acceptance, ensuring high-quality team formation for hackathons, sports, projects, etc.",
      features: ["Request & Approval Workflow", "Skill-based Matching", "Applicant Verification", "Team Management"],
      tags: ["MERN Stack", "Collaboration", "UI/UX Design"],
      image: "/images/SquadSyncProject/SS-CoverPage.png",
      gallery: ["/images/SquadSyncProject/SS-FindSquadsPage.png", 
        "/images/SquadSyncProject/SS-MySquadsPage.png",
        "/images/SquadSyncProject/SS-JoinedSquadsPage.png", 
        "/images/SquadSyncProject/SS-SquadCreate.png", 
        "/images/SquadSyncProject/SS-UserProfile.png"],
      github: "",
      live: ""
    },
    {
      id: 3,
      title: "WrapURL",
      role: "Sole Developer • Sept 2024",
      desc: "Custom URL management platform transforming standard links into concise, customizable URLs for enhanced branding and ease of use.",
      longDesc: "WrapURL streamlines digital resource sharing by transforming lengthy links into concise, memorable URLs. Engineered a 'Custom Alias' feature for personal branding and designed an intuitive dashboard for link generation and history tracking. The backend architecture prioritizes performance with rapid redirection and unique alias validation.",
      features: ["Custom Aliases", "Link History Dashboard", "Rapid Redirection"],
      tags: ["MERN Stack", "UI/UX Design", "Redis"],
      image: "/images/WrapUrlProject/WU-CoverPage1.png",
      gallery: ["/images/WrapUrlProject/WU-CoverPage1.png"],
      github: "",
      live: ""
    },
    {
      id: 4,
      title: "Face Recognition Based Attendance System",
      role: "UI/UX & Front-End • 2024",
      desc: "Automated attendance system using Face Recognition.",
      longDesc: "Developed for the Project Exhibition-I, this system utilizes the K-Nearest Neighbours (KNN) algorithm to automate attendance tracking. It captures real-time imagery to detect faces and match them against stored datasets, significantly enhancing efficiency by eliminating manual processes and reducing human error.",
      features: ["KNN Facial Identification", "Real-time Capture", "Automated Attendance"],
      tags: ["Python", "OpenCV", "Machine Learning"],
      image: "/images/FBAS-1.png",
      gallery: ["/images/FBAS-1.png"],
      github: "",
      live: ""
    },
    {
      id: 5,
      title: "Ledgerly",
      role: "Sole Developer • In Development",
      desc: "An upcoming centralized hub designed to curate and manage essential digital resources.",
      longDesc: "Currently in active development, Ledgerly aims to solve the problem of scattered digital tools. The vision is to build a comprehensive 'LinkHub' where developers and designers can discover links and names of domain-specific resources—from Generative AI to UI kits—while maintaining their own secure, personalized repositories for easy access.",
      features: [],
      tags: [],
      image: "/images/UnderDevelopment.png",
      gallery: ["/images/UnderDevelopment.png"],
      github: "",
      live: ""
    }
  ],

  extracurricular: [
    {
      id: 1,
      company: "GeeksforGeeks Student Chapter",
      role: "Chairperson",
      period: "Oct 2024 - Present",
      desc: "Leading key initiatives, planning webinars and hackathons, and managing core teams."
    },
    {
      id: 2,
      company: "Electric Vehicle Club",
      role: "Design Lead",
      period: "Oct 2024 - Mar 2025",
      desc: "Established visual strategy, developed the official club website UI, and managed promotional materials."
    },
    {
        id: 3,
        company: "The Fusion Club",
        role: "Graphic Designer",
        period: "May 2024 - Present",
        desc: "Responsible for visual strategy, website design assistance, and creation of event-related promotional materials."
    }
  ],
  footer: {
    email: "khushang8508@gmail.com",
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/khushangsingh2004" },
      { label: "GitHub", url: "https://github.com/KhushangSingh" },
      { label: "Behance", url: "https://www.behance.net/Khushangsingh" }
    ]
  }
};

// ---------------------------------------------------------------------------------------------
//                                           DESIGNER DATA
// ---------------------------------------------------------------------------------------------

export const designData = {
  hero: {
    titlePrefix: "Visuals",
    titleSuffix: "SPEAK.",
    processText: "Transforming chaos into clarity through design.",
    outcomeText: "Not just pixels, but purposeful human experiences."
  },

  about: {
    title: "About ME",
    description: "I believe design is the silent ambassador of your brand. My approach combines the raw discipline of a martial artist with the fluid creativity of an illustrator. I don't just decorate screens; I engineer visual systems that solve complex problems and evoke genuine emotion.",
    resumeUrl: "/images/designResume.pdf"
  },

  services: [
    { 
      id: 1,
      title: "UI/UX Design", 
      desc: "Crafting intuitive mobile and web interfaces that users love." 
    },
    { 
      id: 2,
      title: "Brand Identity", 
      desc: "Building cohesive visual languages from logos to design systems." 
    },
    { 
      id: 3,
      title: "Interaction Design", 
      desc: "Adding life to products with subtle motions and micro-interactions." 
    }
  ],

  sections: [
    {
      id: "uiux",
      label: "UI/UX Design",
      filters: ["All", "Web Design", "Mobile Apps", "SaaS"],
      projects: [
        {
          id: 1,
          title: "OtakuCircle",
          subCat: "Web Design",
          role: "UI/UX Designer & Full Stack Dev",
          image: "/images/OtakuCircleProject/OC-LandingPage.png",
          desc: "A social platform for anime enthusiasts to browse, review, and track their journey with friends.",
          longDesc: "Detailed case study coming soon. This section will describe the design solution, including typography choices, color theory application, and the final high-fidelity prototypes.",
          tools: "Figma",
          timeline: "",
          live: "",
          github: "",
          gallery: [
            "/images/OtakuCircleProject/OC-LandingPage.png",
            "/images/OtakuCircleProject/OC-TrendingNow.png",
            "/images/OtakuCircleProject/OC-SmartSearch.png",
            "/images/OtakuCircleProject/OC-ForYou.png",
            "/images/OtakuCircleProject/OC-FriendsPage.png",
            "/images/OtakuCircleProject/OC-UserProfile.png"
          ]
        },
        {
          id: 2,
          title: "SquadSync",
          subCat: "Web Design",
          role: "UI/UX Designer & Full Stack Dev",
          image: "/images/SquadSyncProject/SS-CoverPage.png",
          desc: "Collaboration platform connecting students based on competency with a 'Request & Approval' workflow.",
          tools: "Figma",
          timeline: "2 Weeks",
          gallery: [
              "/images/SquadSyncProject/SS-FindSquadsPage.png",
              "/images/SquadSyncProject/SS-MySquadsPage.png",
              "/images/SquadSyncProject/SS-JoinedSquadsPage.png",
              "/images/SquadSyncProject/SS-SquadCreate.png",
              "/images/SquadSyncProject/SS-UserProfile.png"
          ]
        },
      ]
    },
    {
      id: "research",
      label: "UX Research",
      filters: ["All", "Case Studies", "User Flows"],
      projects: [
        {
          id: 3,
          title: "McDelivery Redesign",
          subCat: "Case Studies",
          role: "UX Researcher",
          image: "/images/McDonaldsUXResearchCover.jpg",
          desc: "Heuristic evaluation identifying 7 critical usability issues and redesigning core navigation for reduced friction.",
          tools: "FigJam, Maze",
          timeline: "2 Weeks",
          gallery: [
            "/images/McDelivery UI UX Analysis - Khushang Singh.pdf"
          ]
        },
      ]
    },
    {
      id: "branding",
      label: "Branding",
      filters: ["All", "Identity"],
      projects: [
        {
          id: 4,
          title: "EV Club Website",
          subCat: "Identity",
          role: "Visual Designer",
          image: "/images/EVClubWebCover.png",
          desc: "Established the visual strategy and developed a cohesive club identity for The Electric Vehicle Club.",
          tools: "Illustrator, Photoshop",
          timeline: "1 Month",
          gallery: [
            "/images/EVClubWebCover.png",
          ]
        },
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
      desc: "A comprehensive professional certificate program by Google covering the full UX design process: empathizing with users, defining pain points, ideating solutions, creating wireframes and prototypes, and iterating on designs. Includes building a professional portfolio.",
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
      desc: "Completed a simulation focused on how the Product Design team can transform a user's experience. Added a new feature, iterated on an existing product screen, and communicated design decisions.",
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