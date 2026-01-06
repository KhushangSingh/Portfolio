import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Code2, Terminal, MapPin, Layers, Database, Globe, Cpu, X, Award, Calendar, BookOpen, ExternalLink, Github, User, GraduationCap, Sparkles, FileText, Copyright } from 'lucide-react';
import { devData } from '../../constants/data';

// --- ANIMATION VARIANTS ---
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } }
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

// --- HELPER: GET ISSUER LOGO ---
const getIssuerLogo = (issuer) => {
  if (!issuer) return null; // Safety check
  const name = issuer.toLowerCase();
  if (name.includes('aws') || name.includes('amazon')) return "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg";
  if (name.includes('udemy')) return "https://upload.wikimedia.org/wikipedia/commons/e/e3/Udemy_logo.svg";
  if (name.includes('geeksforgeeks')) return "https://upload.wikimedia.org/wikipedia/commons/4/43/GeeksforGeeks.svg";
  if (name.includes('coursera')) return "https://upload.wikimedia.org/wikipedia/commons/9/97/Coursera-Logo_600x600.svg";
  if (name.includes('freecodecamp')) return "https://design-style-guide.freecodecamp.org/downloads/fcc_secondary_small.svg";
  if (name.includes('forage')) return "https://avatars.githubusercontent.com/u/37552950?s=200&v=4";
  return null;
};

// --- MODAL COMPONENT ---
const DetailModal = ({ item, type, onClose }) => {
  if (!item) return null;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
      />

      {/* Modal Card */}
      <motion.div 
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-white w-[90vw] md:w-[85vw] max-w-6xl h-[85vh] rounded-xl relative z-10 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 z-30 p-2.5 bg-black/20 hover:bg-black/40 text-white backdrop-blur-md rounded-full transition-all duration-300 ring-1 ring-white/20 shadow-lg"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Scroll Container */}
        <div className="flex-1 overflow-y-auto 
                        [&::-webkit-scrollbar]:w-2 
                        [&::-webkit-scrollbar-track]:bg-transparent 
                        [&::-webkit-scrollbar-thumb]:bg-gray-300 
                        [&::-webkit-scrollbar-thumb]:rounded-full 
                        [&::-webkit-scrollbar-thumb]:hover:bg-gray-500">
            
            {/* --- PROJECT LAYOUT --- */}
            {type === 'project' && (
              <div className="flex flex-col">
                 <div className="w-full bg-gray-100 h-[40vh] md:h-[50vh] relative shrink-0">
                    {item.image && (
                        <>
                            <img src={item.image} alt={item.title || "Project"} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </>
                    )}
                    
                    <div className="absolute bottom-8 left-8 md:left-12 text-white max-w-3xl">
                        {item.title && (
                            <h2 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-md">{item.title}</h2>
                        )}
                    </div>
                 </div>

                 <div className="p-8 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Combined Container for Role and Overview to control spacing tightly */}
                            <div>
                                {item.role && (
                                    <span className="inline-block px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-bold uppercase tracking-widest shadow-sm mb-5">
                                        {item.role}
                                    </span>
                                )}

                                {(item.longDesc || item.desc) && (
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Overview</h3>
                                        <p className="text-lg text-gray-700 leading-relaxed">
                                            {item.longDesc || item.desc}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {item.features && item.features.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Key Features</h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {item.features.map((feat, i) => (
                                            <li key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
                                                <span className="text-gray-700 font-medium">{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="space-y-8">
                            {(item.live || item.github) && (
                                <div className="flex flex-col gap-4">
                                    {item.live && (
                                        <a href={item.live} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-4 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-transform active:scale-95 shadow-lg">
                                            Live Site <ExternalLink size={18} />
                                        </a>
                                    )}
                                    {item.github && (
                                        <a href={item.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-4 border-2 border-gray-200 rounded-lg font-bold hover:border-black hover:bg-gray-50 transition-all active:scale-95 text-gray-700">
                                            View Code <Github size={18} />
                                        </a>
                                    )}
                                </div>
                            )}

                            {item.tags && item.tags.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Tech Stack</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {item.tags.map((tag) => (
                                            <span key={tag} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-bold border border-gray-200">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- PROJECT GALLERY SECTION --- */}
                    {item.gallery && item.gallery.length > 0 && (
                        <div className="mt-16 pt-12 border-t border-gray-200">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8">Project Gallery</h3>
                            <div className="flex flex-col gap-2">
                                {item.gallery.map((galleryItem, index) => (
                                    <div key={index} className="w-full overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        {galleryItem.toLowerCase().endsWith('.pdf') ? (
                                            <iframe 
                                                src={galleryItem} 
                                                className="w-full h-[80vh] border-none bg-gray-50"
                                                title={`Project Document ${index + 1}`}
                                            />
                                        ) : (
                                            <img 
                                                src={galleryItem} 
                                                alt={`${item.title} showcase ${index + 1}`} 
                                                className="w-full h-auto object-cover"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                 </div>
              </div>
            )}

            {/* --- CERTIFICATE LAYOUT --- */}
            {type === 'cert' && (
              <div className="flex flex-col">
                 <div className="w-full bg-gray-100 p-6 md:p-10 border-b border-gray-200 shrink-0">
                    {item.image && (
                        <div className="max-w-4xl mx-auto shadow-xl rounded-lg overflow-hidden border border-gray-200 bg-white">
                            <div className="aspect-[16/10] md:aspect-[2/1] relative">
                                <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-contain p-4" />
                            </div>
                        </div>
                    )}
                 </div>

                 <div className="p-8 md:p-12 max-w-4xl mx-auto w-full">
                    <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-8 pb-8 border-b border-gray-100">
                        <div>
                            {(item.issuer || item.title) && (
                                <>
                                    <div className="flex items-center gap-3 mb-2 text-blue-600">
                                        {getIssuerLogo(item.issuer) ? (
                                            <img src={getIssuerLogo(item.issuer)} alt={item.issuer} className="w-8 h-8 object-contain" />
                                        ) : (
                                            <Award size={28} />
                                        )}
                                        {item.issuer && <span className="font-bold uppercase tracking-wider text-sm text-gray-500">{item.issuer}</span>}
                                    </div>
                                    {item.title && <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{item.title}</h2>}
                                </>
                            )}
                        </div>
                        {item.date && (
                            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg border border-gray-200 self-start">
                                <Calendar size={18} className="text-gray-500" />
                                <span className="font-mono text-sm font-medium text-gray-700">Issued: {item.date}</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-2">
                            {item.desc && (
                                <>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Description</h3>
                                    <p className="text-lg text-gray-700 leading-relaxed mb-8">
                                        {item.desc}
                                    </p>
                                </>
                            )}
                            
                            {item.modules && item.modules.length > 0 && (
                                <>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Curriculum</h3>
                                    <ul className="space-y-3">
                                        {item.modules.map((mod, i) => (
                                            <li key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <BookOpen size={18} className="text-blue-600 mt-0.5 shrink-0" />
                                                <span className="text-gray-700 font-medium">{mod}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>

                        <div>
                            {item.skills && item.skills.length > 0 && (
                                <>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Skills Verified</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {item.skills.map(s => (
                                            <span key={s} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm font-bold border border-blue-100">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                            
                            {item.credentialLink && (
                                <a 
                                    href={item.credentialLink} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="mt-8 flex items-center justify-center gap-2 w-full py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-md"
                                >
                                    Verify Credential <ExternalLink size={16} />
                                </a>
                            )}
                        </div>
                    </div>
                 </div>
              </div>
            )}

        </div>
      </motion.div>
    </div>
  );
};


const Developer = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [modalType, setModalType] = useState(null);

  // --- ADD THIS USEEFFECT BLOCK ---
  useEffect(() => {
    // Updates browser address bar to match Developer Light Background (#F3F3F1)
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", "#F3F3F1");
    }
  }, []);

  const openProject = (project) => {
    setActiveItem(project);
    setModalType('project');
  };

  const openCert = (cert) => {
    setActiveItem(cert);
    setModalType('cert');
  };

  const closeModal = () => {
    setActiveItem(null);
    setModalType(null);
  };

  const getIcon = (name) => {
    switch(name) {
        case "Java": return <Code2 size={24} />;
        case "React": return <Globe size={24} />;
        case "Node.js": return <Terminal size={24} />;
        case "AWS": return <Layers size={24} />;
        case "MongoDB": return <Database size={24} />;
        case "DSA": return <Cpu size={24} />;
        default: return <Code2 size={24} />;
    }
  };

  return (
    <div className="bg-[#F3F3F1] text-[#1A1A1A] w-full font-sans selection:bg-[#1A1A1A] selection:text-white flex flex-col h-screen overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&_*:focus-visible]:outline-none [&_*:focus-visible]:ring-2 [&_*:focus-visible]:ring-blue-600 [&_*:focus-visible]:ring-offset-2 [&_*:focus-visible]:ring-offset-[#F3F3F1]">
      
      {/* 1. HERO SECTION */}
      {devData?.hero && (
          <div className="h-screen flex flex-col justify-between pt-24 pb-0 relative shrink-0">
            <div className="px-6 md:px-12 max-w-[1600px] mx-auto w-full flex-grow flex flex-col justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-center">
                
                {/* Left: Big Intro */}
                <div className="flex flex-col justify-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-[12vw] lg:text-[9vw] leading-[0.85] font-bold tracking-tighter uppercase mb-8"
                    >
                    Software<br/>
                    <span className="text-gray-400">Engineer.</span>
                    </motion.h1>
                    
                    {devData.hero.description && (
                        <p className="text-xl md:text-2xl max-w-3xl leading-relaxed font-medium text-gray-700 mb-8">
                        {devData.hero.description}
                        </p>
                    )}

                    <div className="flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Open to Internship</span>
                    </div>
                </div>

                {/* Right: STUDENT TERMINAL */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="hidden lg:block relative w-full max-w-md mx-auto"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl blur opacity-30" />
                    <div className="relative bg-[#1E1E1E] rounded-xl shadow-2xl border border-gray-800 overflow-hidden font-mono text-sm leading-relaxed">
                        <div className="bg-[#2D2D2D] px-4 py-3 flex items-center justify-between border-b border-gray-700">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                            </div>
                            <div className="text-gray-400 text-xs flex items-center gap-1">
                                <Terminal size={12} />
                                <span>khushang@student ~ profile</span>
                            </div>
                            <div className="w-10"></div>
                        </div>
                        <div className="p-6 text-gray-300">
                            <div className="flex">
                                <span className="text-blue-400 mr-2">const</span>
                                <span className="text-yellow-200 mr-2">student</span>
                                <span className="text-white mr-2">=</span>
                                <span className="text-purple-400">{`{`}</span>
                            </div>
                            <div className="pl-6 py-1"><span className="text-blue-300">name</span>: <span className="text-green-400 ml-2">'Khushang Singh'</span>,</div>
                            <div className="pl-6 py-1"><span className="text-blue-300">education</span>: <span className="text-green-400 ml-2">'B.Tech CSE (3rd Year)'</span>,</div>
                            <div className="pl-6 py-1"><span className="text-blue-300">focus</span>: <span className="text-purple-400 ml-2">[</span><span className="text-orange-400">'DSA'</span>, <span className="text-orange-400 ml-1">'Java'</span>, <span className="text-orange-400 ml-1">'Web Dev'</span><span className="text-purple-400">]</span>,</div>
                            <div className="pl-6 py-1"><span className="text-blue-300">seeking</span>: <span className="text-green-400 ml-2">'Summer Internship 2025'</span></div>
                            <div className="flex"><span className="text-purple-400">{`}`}</span>;</div>
                            <div className="mt-4 flex items-center gap-2 text-gray-500"><span className="text-green-500">➜</span><span className="text-blue-500">~</span><span>git commit -m "Learning everyday"</span><span className="w-2.5 h-5 bg-gray-500 animate-pulse block"></span></div>
                        </div>
                    </div>
                </motion.div>

                </div>
            </div>

            {/* 2. MARQUEE */}
            {devData?.marquee?.length > 0 && (
                <div className="w-full bg-[#1A1A1A] text-[#F3F3F1] py-4 overflow-hidden border-t border-gray-800">
                    <div className="animate-marquee whitespace-nowrap flex gap-16 opacity-90">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex items-center gap-16">
                                {devData.marquee.map((text) => (
                                    <span key={text} className="text-lg font-bold uppercase tracking-widest flex items-center gap-4">
                                        {text}
                                        <span className="text-gray-600 text-[10px] ml-16">●</span>
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>
      )}

      {/* 3. PROJECTS SECTION */}
      {devData?.projects?.length > 0 && (
          <div className="px-6 md:px-12 max-w-[1600px] mx-auto w-full mb-32 pt-20">
            <div className="flex items-end justify-between mb-10 border-b border-gray-300 pb-6">
                <h2 className="text-4xl font-bold tracking-tighter uppercase">Projects</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {devData.projects.map((project) => (
                    <motion.div 
                        layoutId={`project-${project.id}`}
                        onClick={() => openProject(project)}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        key={project.id}
                        className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer"
                    >
                        {project.image ? (
                            <div className="h-[200px] overflow-hidden relative bg-gray-100">
                                <img 
                                    src={project.image} 
                                    alt={project.title || "Project"} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </div>
                        ) : (
                            <div className="h-[200px] bg-gray-200 flex items-center justify-center">
                                <Code2 size={40} className="text-gray-400" />
                            </div>
                        )}
                        
                        <div className="p-5 flex flex-col flex-grow">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                                    {project.title}
                                </h3>
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                    <ArrowUpRight size={14} />
                                </div>
                            </div>
                            {project.desc && (
                                <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-2">
                                    {project.desc}
                                </p>
                            )}
                            {project.tags && project.tags.length > 0 && (
                                <div className="mt-auto pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
          </div>
      )}

      {/* 4. EXTRACURRICULAR SECTION (Uses devData.experience) */}
      {devData?.experience?.length > 0 && (
          <div className="px-6 md:px-12 max-w-[1600px] mx-auto w-full mb-32">
            <div className="flex items-end justify-between mb-10 border-b border-gray-300 pb-6">
                <h2 className="text-4xl font-bold tracking-tighter uppercase">Extracurricular</h2>
            </div>
            <div className="border-l border-gray-300 ml-1 space-y-12">
                {devData.experience.map((exp) => (
                    <div key={exp.id} className="pl-8 relative group">
                        <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-gray-400 rounded-full ring-4 ring-[#F3F3F1] group-hover:bg-black transition-colors"></span>
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                            {exp.company && <h4 className="text-2xl font-bold">{exp.company}</h4>}
                            {exp.period && <span className="text-xs font-bold uppercase tracking-widest text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100">{exp.period}</span>}
                        </div>
                        {exp.role && <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">{exp.role}</p>}
                        {exp.desc && <p className="text-gray-600 text-base max-w-2xl leading-relaxed">{exp.desc}</p>}
                    </div>
                ))}
            </div>
          </div>
      )}

      {/* 5. SKILLS SECTION */}
      {devData?.skills?.length > 0 && (
          <div className="px-6 md:px-12 max-w-[1600px] mx-auto w-full mb-32">
            <div className="flex items-end justify-between mb-10 border-b border-gray-300 pb-6">
                <h2 className="text-4xl font-bold tracking-tighter uppercase">Technical Arsenal</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {devData.skills.map((skill) => (
                    <div key={skill.name} className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-4 hover:border-blue-600 transition-colors duration-300 group cursor-default">
                        <div className="text-gray-400 group-hover:text-blue-600 transition-colors duration-300">
                            {getIcon(skill.name)}
                        </div>
                        <span className="font-bold text-sm tracking-wide">{skill.name}</span>
                    </div>
                ))}
            </div>
          </div>
      )}

      {/* 6. CERTIFICATIONS SECTION */}
      {devData?.certifications?.length > 0 && (
          <div className="px-6 md:px-12 max-w-[1600px] mx-auto w-full mb-32">
            <div className="flex items-end justify-between mb-10 border-b border-gray-300 pb-6">
                <h2 className="text-4xl font-bold tracking-tighter uppercase">Certifications & Licenses</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {devData.certifications.map((cert) => (
                    <motion.div 
                        onClick={() => openCert(cert)}
                        key={cert.id} 
                        whileHover={{ scale: 1.01 }}
                        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer flex gap-6 items-center"
                    >
                        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shrink-0 p-3">
                            {getIssuerLogo(cert.issuer) ? (
                                <img src={getIssuerLogo(cert.issuer)} alt={cert.issuer} className="w-full h-full object-contain" />
                            ) : (
                                <Award className="text-gray-500" size={32} />
                            )}
                        </div>
                        <div className="flex-1">
                            {cert.title && <h4 className="text-lg font-bold leading-tight mb-1 group-hover:text-blue-600 transition-colors">{cert.title}</h4>}
                            {cert.issuer && <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{cert.issuer}</p>}
                            {cert.date && (
                                <span className="inline-block px-2 py-1 bg-gray-50 rounded text-[10px] font-mono text-gray-500 border border-gray-100">
                                    Issued: {cert.date}
                                </span>
                            )}
                        </div>
                        <div className="hidden md:block text-gray-300">
                            <ArrowUpRight size={20} />
                        </div>
                    </motion.div>
                ))}
            </div>
          </div>
      )}

      {/* 7. ABOUT ME SECTION */}
      {devData?.about && (
          <div className="px-6 md:px-12 max-w-[1600px] mx-auto w-full mb-32">
            <div className="flex items-end justify-between mb-10 border-b border-gray-300 pb-6">
                <h2 className="text-4xl font-bold tracking-tighter uppercase">About Me</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <User className="text-blue-600" size={28} />
                        <h3 className="text-xl font-bold uppercase tracking-wide">Biography</h3>
                    </div>
                    {devData.about.bio && (
                        <p className="text-gray-700 leading-relaxed text-lg mb-6">
                            {devData.about.bio}
                        </p>
                    )}

                    {/* --- RESUME BUTTON --- */}
                    {devData.about.resumeUrl && (
                        <div className="mb-8">
                            <a 
                                href={devData.about.resumeUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-all shadow-md active:scale-95"
                            >
                                <FileText size={18} />
                                View Resume
                            </a>
                        </div>
                    )}
                    
                    {devData.about.hobbies && devData.about.hobbies.length > 0 && (
                        <>
                            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Interests</h4>
                            <div className="flex flex-wrap gap-3">
                                {devData.about.hobbies.map(hobby => (
                                    <span key={hobby} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium text-gray-600">
                                        {hobby}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {devData.about.education && (
                    <div className="bg-[#1A1A1A] text-white p-8 rounded-xl shadow-lg flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <GraduationCap className="text-blue-400" size={28} />
                                <h3 className="text-xl font-bold uppercase tracking-wide">Education</h3>
                            </div>
                            {devData.about.education.degree && <h4 className="text-2xl font-bold leading-tight mb-2">{devData.about.education.degree}</h4>}
                            {devData.about.education.college && <p className="text-gray-400 text-lg mb-4">{devData.about.education.college}</p>}
                            {devData.about.education.year && (
                                <div className="inline-block px-3 py-1 bg-white/10 rounded-md text-sm font-mono text-blue-200">
                                    {devData.about.education.year}
                                </div>
                            )}
                        </div>
                        
                        {devData.about.education.grade && (
                            <div className="mt-8 pt-8 border-t border-white/10">
                                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Performance</p>
                                <p className="text-2xl font-bold text-white">{devData.about.education.grade}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
          </div>
      )}

      {/* 8. FOOTER */}
      {devData?.footer && (
          <footer className="mt-auto w-full bg-[#1A1A1A] text-[#F3F3F1] px-6 md:px-12 pt-32 pb-10">
            <div className="max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-16 mb-20">
                    <div>
                        <h2 className="text-[11vw] md:text-[8vw] font-bold leading-[0.8] tracking-tighter mb-4">
                            GET IN<br/><span className="text-gray-600">CONTACT</span>
                        </h2>
                        <p className="text-gray-400 text-xl font-medium max-w-md">
                            Open to summer internships and freelance projects. Let's create something meaningful.
                        </p>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-2 mb-2">
                        {devData.footer.email && (
                            <a href={`mailto:${devData.footer.email}`} className="text-xl md:text-3xl font-bold hover:text-white text-gray-300 transition-colors">
                                {devData.footer.email}
                            </a>
                        )}
                        {devData.footer.links && devData.footer.links.length > 0 && (
                            <div className="flex gap-8 mt-4">
                                {devData.footer.links.map(link => (
                                    <a key={link.label} href={link.url} target='_blank' rel='noreferrer' className="text-sm font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors">
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-center items-center border-t border-gray-800 pt-8 text-[10px] font-bold text-gray-600 uppercase tracking-widest gap-2">
                    <div className="flex items-center gap-1">
                        <Copyright size={14} /> 2026 Khushang Singh - Designed & Developed
                    </div>
                </div>
            </div>
          </footer>
      )}

      {/* GLOBAL MODAL */}
      <AnimatePresence>
        {activeItem && (
            <DetailModal item={activeItem} type={modalType} onClose={closeModal} />
        )}
      </AnimatePresence>

    </div>
  );
};

export default Developer;