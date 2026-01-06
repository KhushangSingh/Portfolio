import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Layers, X, ExternalLink, ArrowDownLeft, Copyright, Mail, Linkedin, Globe, FileText, ArrowUpRight } from 'lucide-react';
import { designData, devData } from '../../constants/data';

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 50, damping: 20 } 
  },
  exit: { scale: 0.95, opacity: 0, transition: { duration: 0.2 } }
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 300, damping: 30 } 
    },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15 } }
};

// --- CERTIFICATE MODAL ---
const CertModal = ({ cert, onClose }) => {
    if (!cert) return null;

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/90 backdrop-blur-xl cursor-pointer"
            />
            <motion.div 
                variants={modalVariants}
                initial="hidden" animate="visible" exit="exit"
                className="bg-[#0A0A0A] w-full max-w-3xl rounded-2xl relative z-10 shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[90vh]"
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 z-30 p-2 bg-black/50 hover:bg-white/10 text-white rounded-full transition-colors border border-white/10"
                >
                    <X size={20} />
                </button>

                {cert.image && (
                    <div className="p-1 bg-white/5">
                        <img src={cert.image} alt={cert.title} className="w-full h-auto object-contain rounded-t-xl max-h-[50vh] bg-white" />
                    </div>
                )}

                <div className="p-8 overflow-y-auto">
                    {cert.issuer && <span className="text-[#ff4d00] text-xs font-bold uppercase tracking-widest mb-2 block">{cert.issuer}</span>}
                    {cert.title && <h3 className="text-3xl font-bold text-white mb-4">{cert.title}</h3>}
                    {cert.desc && <p className="text-gray-400 mb-6 leading-relaxed">{cert.desc}</p>}
                    
                    {cert.skills && cert.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {cert.skills.map(skill => (
                                <span key={skill} className="px-3 py-1 border border-white/10 rounded-full text-xs text-gray-300">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-between items-center border-t border-white/10 pt-6">
                        {cert.date && <span className="text-gray-500 text-sm">Issued: {cert.date}</span>}
                        {cert.credentialLink && (
                            <a href={cert.credentialLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white hover:text-[#ff4d00] transition-colors font-bold text-sm uppercase tracking-wider">
                                Verify Credential <ExternalLink size={16} />
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// --- PROJECT DETAIL MODAL ---
const ProjectModal = ({ project, onClose }) => {
    if (!project) return null;
  
    useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = 'unset'; };
    }, []);
  
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-xl cursor-pointer"
        />
  
        <motion.div 
          variants={modalVariants}
          initial="hidden" animate="visible" exit="exit"
          className="bg-[#0A0A0A] w-full h-full relative z-10 flex flex-col overflow-hidden"
        >
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 z-30 p-2 bg-black/50 hover:bg-white/10 text-white rounded-full transition-colors border border-white/10"
          >
            <X size={20} />
          </button>
  
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              
              {/* Header Image - Limited Height + Gradient */}
              <div className="relative h-[60vh] w-full shrink-0">
                {project.image && (
                    <>
                        <img src={project.image} alt={project.title || "Project"} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                    </>
                )}
             </div>

             {/* Full Width Gallery Section with Gap */}
             <div className="pt-12 pb-20 bg-[#0A0A0A]">
                 {project.gallery && project.gallery.length > 0 ? (
                     <div className="w-full space-y-4">
                         {project.gallery.map((img, index) => (
                             <div key={index} className="w-full">
                                 <img 
                                     src={img} 
                                     alt={`${project.title} gallery ${index + 1}`} 
                                     className="w-full h-auto object-cover block" 
                                 />
                             </div>
                         ))}
                     </div>
                 ) : (
                     <div className="text-center py-10 text-gray-500">No additional images available.</div>
                 )}
             </div>

          </div>
        </motion.div>
      </div>
    );
  };

// --- HERO SECTION ---
const HeroSection = () => {
    const { hero } = designData;
    if (!hero) return null;

    return (
        <div className="relative pt-48 pb-32 px-6 md:px-12 z-10 min-h-[85vh] flex flex-col justify-center items-center text-center perspective-1000">
            
            {/* Animated Blobs */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-[#ff4d00] rounded-full blur-[100px] opacity-20 animate-pulse"></div>
            
            {/* Main Blob Animation */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    x: [0, 50, -50, 0],
                    y: [0, -30, 30, 0],
                    rotate: [0, 90, 180, 0]
                }}
                transition={{ 
                    duration: 15, 
                    ease: "linear", 
                    repeat: Infinity,
                    repeatType: "mirror"
                }}
                className="absolute top-[35%] right-[-5%] w-[500px] h-[300px] bg-[#ff4d00] rounded-full blur-[120px] opacity-30 pointer-events-none"
            />

            <motion.div className="relative z-20 max-w-5xl mx-auto">
                <motion.h1 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[13vw] leading-[0.8] font-bold tracking-tighter mix-blend-screen"
                >
                  <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                    {hero.titlePrefix}
                  </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-b from-gray-500 to-gray-800 flex items-center justify-center gap-4 md:gap-8">
                      that <span className="text-[#ff4d00] font-black tracking-tighter uppercase">{hero.titleSuffix}</span>
                  </span>
                </motion.h1>
            </motion.div>

            {(hero.processText || hero.outcomeText) && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="flex flex-col md:flex-row items-center gap-8 md:gap-16 mt-24 relative z-10 text-left"
                >
                    {hero.processText && (
                        <div className="max-w-xs">
                            <p className="text-xs text-[#ff4d00] uppercase tracking-[0.2em] font-bold mb-2">The Process</p>
                            <p className="text-xl text-gray-300 leading-tight">
                                {hero.processText}
                            </p>
                        </div>
                    )}
                    
                    {hero.outcomeText && (
                        <>
                            <div className="h-px w-12 bg-white/20 hidden md:block"></div>
                            <div className="max-w-xs">
                                <p className="text-xs text-[#ff4d00] uppercase tracking-[0.2em] font-bold mb-2">The Outcome</p>
                                <p className="text-xl text-gray-300 leading-tight">
                                    {hero.outcomeText}
                                </p>
                            </div>
                        </>
                    )}
                </motion.div>
            )}
        </div>
    );
};

// --- INFO SECTION (Services, Certs, About) ---
const InfoSection = ({ onCertClick }) => {
    return (
        <div id="about" className="bg-[#0A0A0A] relative z-20 py-32 px-6 md:px-12 border-t border-white/5">
            <div className="max-w-[1400px] mx-auto space-y-32">
                
                {/* 1. SERVICES */}
                {designData?.services && designData.services.length > 0 && (
                    <div>
                        <div className="flex items-end justify-between border-b border-white/10 pb-8 mb-12">
                            <h3 className="text-5xl font-bold text-white uppercase tracking-tight">What I'm Good At</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {designData.services.map((s, i) => (
                                <div key={s.id || i} className="group p-8 border border-white/5 rounded-xl hover:border-[#ff4d00]/50 hover:bg-[#ff4d00]/5 transition-all duration-300">
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#ff4d00] group-hover:text-white transition-colors">
                                        <Sparkles size={20} />
                                    </div>
                                    <h4 className="text-2xl font-bold text-white mb-4">{s.title}</h4>
                                    <p className="text-gray-400 font-light leading-relaxed">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. CERTIFICATIONS */}
                {designData?.certifications && designData.certifications.length > 0 && (
                    <div>
                        <div className="flex items-end justify-between border-b border-white/10 pb-8 mb-12">
                            <h3 className="text-5xl font-bold text-white uppercase tracking-tight">Certifications</h3>
                        </div>
                        <div className="space-y-4">
                            {designData.certifications.map((cert) => (
                                <div 
                                    key={cert.id} 
                                    onClick={() => onCertClick(cert)}
                                    className="group flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-white/20 hover:border-[#ff4d00] transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-6">
                                        <span className="text-[#ff4d00] text-sm font-bold uppercase tracking-widest">{cert.date.split(' ').slice(-1)}</span>
                                        <div>
                                            <h4 className="text-xl font-bold text-white group-hover:text-[#ff4d00] transition-colors">{cert.title}</h4>
                                            {cert.issuer && <p className="text-gray-500 text-sm mt-1">{cert.issuer}</p>}
                                        </div>
                                    </div>
                                    <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                                        <ArrowDownLeft size={24} className="rotate-[-90deg] text-[#ff4d00]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. ABOUT / PHILOSOPHY */}
                {designData?.about && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start pt-16">
                        <div>
                            {designData.about.title && (
                                <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-[0.9] mb-8">
                                    {designData.about.title.split(" ")[0]} <br />
                                    <span className="text-[#ff4d00] font-serif italic">{designData.about.title.split(" ")[1]}</span>
                                </h2>
                            )}
                        </div>
                        
                        <div className="space-y-8 mt-4">
                            <p className="text-xl text-gray-400 font-light leading-relaxed">
                                {designData.about.description}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-8">
                                {devData.about?.education && (
                                    <div>
                                        <h4 className="text-white font-bold mb-2">Education</h4>
                                        <p className="text-gray-400 text-sm">
                                            {devData.about.education.degree}<br/>
                                            {devData.about.education.college}<br/>
                                            {devData.about.education.year}
                                        </p>
                                    </div>
                                )}
                                
                                {designData.about.resumeUrl && (
                                    <div className="flex flex-col justify-start items-start">
                                        <h4 className="text-white font-bold mb-2">Resume</h4>
                                        <a 
                                            href={designData.about.resumeUrl} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="group inline-flex items-center gap-3 text-gray-400 hover:text-[#ff4d00] transition-colors"
                                        >
                                            <span className="text-sm font-bold uppercase tracking-widest border-b border-gray-600 group-hover:border-[#ff4d00] pb-0.5 transition-colors">Download CV</span>
                                            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

const Footer = () => {

    const linkedInUrl = "https://www.linkedin.com/in/khushangsingh2004";

    return (
        <footer className="bg-black relative z-20 pt-12 pb-10 px-6 md:px-12 border-t border-white/10 overflow-hidden">
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-12 relative">
                    <h2 className="text-[8vw] font-black leading-[0.9] tracking-tighter text-white uppercase mix-blend-difference z-10 relative pb-6 pr-4">
                        Let's <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d00] to-orange-600">Create.</span>
                    </h2>
                    
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block">
                        <a 
                            href={linkedInUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="group w-32 h-32 rounded-full bg-[#ff4d00] flex items-center justify-center text-black transition-all duration-500 hover:scale-125"
                        >
                            <ArrowUpRight size={48} className="group-hover:rotate-45 transition-transform duration-500 scale-90 group-hover:scale-110" />
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-white/10 pt-12">
                    <div className="md:col-span-2">
                        {designData?.footer?.email && (
                            <>
                                <h4 className="text-white font-bold text-lg mb-6">Contact</h4>
                                <a href={`mailto:${devData.footer.email}`} className="text-2xl md:text-4xl text-gray-400 hover:text-white transition-colors block mb-4 font-light">
                                    {designData.footer.email}
                                </a>
                                <p className="text-gray-500 max-w-sm">Open for freelance projects and internships. Based in India, working globally.</p>
                            </>
                        )}
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Socials</h4>
                        <ul className="space-y-4">
                            {designData.footer?.socials?.map((link) => (
                                <li key={link.label}>
                                    <a href={link.url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#ff4d00] flex items-center gap-2 transition-colors uppercase tracking-widest text-sm">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Links</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                            <li><a href="#projects" className="text-gray-400 hover:text-white transition-colors">Projects</a></li>
                            <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 flex flex-col items-center justify-center text-gray-600 text-xs uppercase tracking-widest text-center">
                    <div className="flex items-center gap-2 ">
                        <Copyright size={14} /> 2026 Khushang Singh - Designed & Developed
                    </div>
                </div>
            </div>
        </footer>
    );
}

const Designer = () => {
  const [activeSection, setActiveSection] = useState(designData.sections?.[0] || null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  
  // --- ADD THIS USEEFFECT BLOCK ---
  useEffect(() => {
    // Updates browser address bar to match Designer Dark Background (#050505)
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", "#050505");
    }
  }, []);

  // Safe Filter Logic
  const filteredProjects = activeSection?.projects?.filter(project => 
    activeFilter === "All" ? true : project.subCat === activeFilter
  ) || [];

  return (
    <div className="bg-[#050505] text-white min-h-screen w-full font-sans relative selection:bg-[#ff4d00] selection:text-white cursor-crosshair overflow-x-hidden [&_*:focus-visible]:outline-none [&_*:focus-visible]:ring-2 [&_*:focus-visible]:ring-[#ff4d00] [&_*:focus-visible]:ring-offset-2 [&_*:focus-visible]:ring-offset-[#050505]">
      
      {/* GLOBAL SCROLLBAR STYLE */}
      <style>{`
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: #ff4d00; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #cc3d00; }
      `}</style>

      {/* 1. CINEMATIC GRAIN OVERLAY */}
      <div className="fixed inset-0 opacity-[0.07] pointer-events-none z-0 mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <HeroSection />

      {/* WRAPPER FOR STICKY BEHAVIOR */}
      <div className="relative z-10 pb-20" id="projects">
          
           {/* 4. STICKY FLOATING TAB NAVIGATION */}
           {designData?.sections?.length > 0 && (
              <div className="sticky top-4 z-50 flex justify-center px-4 mb-4 pointer-events-none">
                <div className="bg-[#0f0f0f]/60 backdrop-blur-xl border border-white/10 rounded-full p-2 flex gap-2 pointer-events-auto shadow-2xl ring-1 ring-white/5 transition-all duration-300">
                    {designData.sections.map((section) => {
                        const isActive = activeSection?.id === section.id;
                        return (
                            <button
                                key={section.id}
                                onClick={() => {
                                    setActiveSection(section);
                                    setActiveFilter("All");
                                }}
                                className={`relative px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${isActive ? 'text-black' : 'text-gray-300 hover:text-white'}`}
                            >
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white/90 backdrop-blur-md rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                    />
                                )}
                                <span className="relative z-10">{section.label}</span>
                            </button>
                        )
                    })}
                </div>
              </div>
          )}

          {/* 5. STICKY FILTER BAR */}
          {activeSection?.filters?.length > 0 && (
              <div className="sticky top-20 z-40 flex justify-center w-full mb-16 pointer-events-none">
                 <div className="bg-[#050505]/40 backdrop-blur-xl px-8 py-2 rounded-full pointer-events-auto border border-white/5 shadow-lg">
                    <div className="flex justify-center flex-wrap gap-6">
                        {activeSection.filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`text-[10px] tracking-[0.2em] uppercase font-bold transition-all duration-300 relative py-1 group ${
                                    activeFilter === filter ? 'text-[#ff4d00]' : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                {filter}
                                {activeFilter === filter && (
                                    <motion.div layoutId="filterDot" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#ff4d00] rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                 </div>
              </div>
          )}

          {/* 6. DYNAMIC CONTENT AREA */}
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div 
                layout
                variants={containerVariants}
                initial="visible"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
            >
                <AnimatePresence mode='popLayout'>
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            layout
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            key={project.id}
                            className={`group relative cursor-pointer ${index % 2 === 1 ? 'lg:translate-y-16' : ''}`}
                            onClick={() => setSelectedProject(project)}
                        >
                            {/* 1. THE IMAGE CARD - REPLACED GLOW WITH BORDER */}
                            <div 
                                className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-[#111] border border-white/10 transition-all duration-500"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                                {project.image && (
                                    <img 
                                        src={project.image} 
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[0.22,1,0.36,1] scale-100 group-hover:scale-105"
                                    />
                                )}
                                <div className="absolute top-4 left-4 z-20">
                                    <div className="bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 flex items-center gap-2">
                                        <Layers size={10} className="text-[#ff4d00]" />
                                        <span className="text-[9px] font-sans uppercase tracking-widest font-bold text-gray-300">{project.subCat}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 2. TYPOGRAPHY & BUTTON BELOW */}
                            <div className="mt-6 flex justify-between items-end pl-2">
                                <div className="flex flex-col gap-1">
                                    {project.title && (
                                        <h3 className="text-3xl font-bold text-white transition-colors duration-300">
                                            {project.title}
                                        </h3>
                                    )}
                                    {project.desc && (
                                        <p className="text-white text-md transition-colors duration-300 max-w-xl opacity-70">
                                            {project.desc}
                                        </p>
                                    )}
                                </div>
                                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-transparent group-hover:bg-[#ff4d00] group-hover:border-[#ff4d00] transition-all duration-300">
                                    <ArrowRight size={20} className="text-[#ff4d00] group-hover:text-white transform rotate-0 group-hover:-rotate-45 transition-all duration-300" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
                <div className="w-full py-40 flex flex-col items-center justify-center text-gray-800">
                    <Sparkles size={64} className="mb-6 opacity-20 animate-pulse" />
                    <p className="uppercase tracking-[0.5em] text-xs font-bold opacity-40">Work in progress</p>
                </div>
            )}
          </div>
      </div>

      {/* NEW INFO SECTIONS (Non-Sticky Area) */}
      <InfoSection onCertClick={setSelectedCert} />

      {/* FOOTER */}
      <Footer />

      {/* GLOBAL MODALS */}
      <AnimatePresence>
        {selectedProject && (
            <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
        {selectedCert && (
            <CertModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
        )}
      </AnimatePresence>

    </div>
  );
};

export default Designer;