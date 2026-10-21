// Authentic Skills, Tools & Certifications Data Architecture

export const BADGE_CATEGORIES = [
  {
    id: '3d-motion',
    label: '01 / 3D & Motion',
    shortLabel: '3D & Motion',
    description: 'Three.js shaders, Blender 3D, GSAP scrubbed timelines and Framer Motion spring physics.'
  },
  {
    id: 'design',
    label: '02 / Product & UI',
    shortLabel: 'Product UI',
    description: 'Figma component systems, semantic token bridges and high-fidelity interaction architectures.'
  },
  {
    id: 'code',
    label: '03 / Code & Engine',
    shortLabel: 'Engineering',
    description: 'Production React 19 apps, strict TypeScript contracts, Tailwind utility tokens and Vite tooling.'
  }
];

export const BADGES_DATA = {
  '3d-motion': [
    {
      id: 'threejs',
      name: 'Three.js',
      level: '3D Engine',
      tagline: 'WebGL, GLTF Pipelines & Custom Shader Math',
      accent: '#000000',
      metalColor: '#e0c068', // Gold rim
      icon: 'threejs'
    },
    {
      id: 'blender',
      name: 'Blender 3D',
      level: 'Modeling',
      tagline: 'Hard-Surface Modeling, UV Unwrapping & PBR Baking',
      accent: '#E87D0D',
      metalColor: '#e0c068',
      icon: 'blender'
    },
    {
      id: 'gsap',
      name: 'GSAP Motion',
      level: 'Web Motion',
      tagline: 'ScrollTrigger, Scrubbed Timelines & Pin Spans',
      accent: '#0ae448',
      metalColor: '#c0c0c0', // Silver/Chrome rim
      icon: 'gsap'
    },
    {
      id: 'framer-motion',
      name: 'Framer Motion',
      level: 'Physics Engine',
      tagline: 'Spring Dynamics, Layout Morphing & 3D Gestures',
      accent: '#0055FF',
      metalColor: '#e0c068',
      icon: 'framer'
    },
    {
      id: 'spline',
      name: 'Spline 3D',
      level: 'Interactive 3D',
      tagline: 'Real-time WebGL Scenes & Interactive Cameras',
      accent: '#FF3366',
      metalColor: '#c0c0c0',
      icon: 'spline'
    },
    {
      id: 'webgl',
      name: 'WebGL & GLSL',
      level: 'Graphics Engine',
      tagline: 'Fragment Shaders, Matrices & Projection Transforms',
      accent: '#990000',
      metalColor: '#e0c068',
      icon: 'webgl'
    }
  ],
  design: [
    {
      id: 'figma',
      name: 'Figma',
      level: 'Mastery',
      tagline: 'Variables, Auto-Layout & Multi-Brand Libraries',
      accent: '#A259FF',
      metalColor: '#e0c068',
      icon: 'figma'
    },
    {
      id: 'design-tokens',
      name: 'Design Tokens',
      level: 'Architecture',
      tagline: 'Semantic Color, Spacing & Style Dictionaries',
      accent: '#ff5e1a',
      metalColor: '#e0c068',
      icon: 'tokens'
    },
    {
      id: 'prototyping',
      name: 'Prototyping',
      level: 'High-Fidelity',
      tagline: 'Interactive State Machines & Micro-flows',
      accent: '#0acf83',
      metalColor: '#c0c0c0',
      icon: 'prototype'
    },
    {
      id: 'accessibility',
      name: 'WCAG AA',
      level: 'Compliance',
      tagline: 'Contrast Audits, Focus Traps & Screen Readers',
      accent: '#18a0fb',
      metalColor: '#c0c0c0',
      icon: 'wcag'
    },
    {
      id: 'design-systems',
      name: 'Design Systems',
      level: 'Production Kit',
      tagline: 'Component Governance & Cross-Platform Specs',
      accent: '#ff7262',
      metalColor: '#e0c068',
      icon: 'systems'
    },
    {
      id: 'ia',
      name: 'Information Arch',
      level: 'UX Strategy',
      tagline: 'User Journeys, Card Sorting & Wayfinding Models',
      accent: '#8b5cf6',
      metalColor: '#c0c0c0',
      icon: 'ia'
    }
  ],
  code: [
    {
      id: 'react',
      name: 'React 19',
      level: 'Core Stack',
      tagline: 'Concurrent Rendering, Custom Hooks & Server Actions',
      accent: '#61dafb',
      metalColor: '#e0c068',
      icon: 'react'
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      level: 'Strict Types',
      tagline: 'Generics, Discriminated Unions & Polymorphic UI',
      accent: '#3178c6',
      metalColor: '#e0c068',
      icon: 'typescript'
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      level: 'Utility Engine',
      tagline: 'Arbitrary Variants, Theme Bridges & JIT Pipelines',
      accent: '#38bdf8',
      metalColor: '#c0c0c0',
      icon: 'tailwind'
    },
    {
      id: 'nextjs',
      name: 'Next.js',
      level: 'Full-Stack UI',
      tagline: 'App Router, Dynamic Routing & SEO Optimization',
      accent: '#000000',
      metalColor: '#e0c068',
      icon: 'nextjs'
    },
    {
      id: 'vite',
      name: 'Vite Engine',
      level: 'Build Tooling',
      tagline: 'Rollup Bundles, HMR Speed & Environment Config',
      accent: '#646CFF',
      metalColor: '#c0c0c0',
      icon: 'vite'
    },
    {
      id: 'git',
      name: 'Git & GitHub',
      level: 'Version Control',
      tagline: 'Trunk Branching, Rebase Workflows & CI Actions',
      accent: '#F05032',
      metalColor: '#e0c068',
      icon: 'git'
    }
  ]
};

export const CERTIFICATES_DATA = [
  {
    id: 1,
    title: 'Google UX Design Professional Certificate',
    issuer: 'Google / Coursera',
    issuerShort: 'Google',
    date: 'June 2024',
    badgeText: 'Professional Specialization',
    rotation: 3.2,
    noteColor: '#FDE047', // Warm Canary Yellow (matches top yellow note in photo)
    noteAccent: '#CA8A04',
    line1: 'Google UX certified btw.',
    line2: 'Good in systems too.',
    tag: 'CLASS OF 2024',
    subTag: 'GOOGLE · COURSERA',
    image: '/images/Google UX Design Professional Certificate.png',
    credentialId: 'CZ3FPEDRYFT2',
    credentialUrl: 'https://coursera.org/verify/professional-cert/CZ3FPEDRYFT2',
    summary: 'Comprehensive 7-course professional program covering the complete end-to-end design lifecycle: foundational user research, wireframing, high-fidelity prototypes in Figma and design systems.',
    skills: ['Figma', 'UX Research', 'Usability Testing', 'Design Systems', 'Responsive Design', 'Accessibility']
  },
  {
    id: 2,
    title: 'Accenture Product Design Job Simulation',
    issuer: 'Accenture / Forage',
    issuerShort: 'Accenture',
    date: 'February 2025',
    badgeText: 'Industry Simulation',
    rotation: -2.2,
    noteColor: '#FFC8C2', // Warm Peach / Coral Pink (matches middle salmon note in photo)
    noteAccent: '#E11D48',
    line1: '2 years in the industry.',
    line2: 'Every one of them shipped.',
    tag: 'PRODUCT DESIGN',
    subTag: 'ENTERPRISE · ACCENTURE',
    image: '/images/Accenture - Product Design Job Simulation.png',
    credentialId: '8GQZENY763oZnLQQY',
    credentialUrl: 'https://www.theforage.com/verify/8GQZENY763oZnLQQY',
    summary: 'Practical enterprise design simulation focusing on transforming digital touchpoints. Delivered feature extensions, revised complex navigation trees and defended design decisions with stakeholder rationales.',
    skills: ['Product Thinking', 'Feature Scoping', 'Figma', 'UI/UX Design', 'Design Rationale']
  },
  {
    id: 3,
    title: 'Responsive Web Design Certification',
    issuer: 'freeCodeCamp',
    issuerShort: 'freeCodeCamp',
    date: 'April 2024',
    badgeText: 'Developer Certification',
    rotation: 2.4,
    noteColor: '#BAE6FD', // Sky Powder Blue (matches bottom blue note in photo)
    noteAccent: '#0284C7',
    line1: "I've worked with",
    line2: '',
    tag: '300+ HOURS · FULL STACK',
    subTag: 'DEVELOPER CREDENTIAL',
    image: '/images/Responsive Web Design.jpeg',
    credentialId: 'KhushangSingh/responsive-web-design',
    credentialUrl: 'https://freecodecamp.org/certification/KhushangSingh/responsive-web-design',
    summary: '300-hour technical developer certification representing mastery of responsive layouts, semantic HTML5, modern CSS3 (Flexbox & CSS Grid), fluid typography and accessibility.',
    skills: ['Semantic HTML5', 'CSS Grid', 'Flexbox', 'Media Queries', 'Responsive Typography', 'WCAG AA']
  }
];
