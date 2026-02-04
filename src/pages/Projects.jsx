import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../data/projectsContent';
import { useMascot } from "../context/MascotContext";

const Projects = () => {
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedForBot, setSelectedForBot] = useState(null);

    const mainProject = projects.find(p => p.type === 'main');
    const majorProjects = projects.filter(p => p.type === 'major');
    const minorProjects = projects.filter(p => p.type === 'minor');

    const {
        setActivePlanet,
        setActivePlanetPos,
        registerInteraction,
        requestSpeech
    } = useMascot();

    const handleSelectProject = (project, e) => {
        if (!e?.currentTarget) return;

        const rect = e.currentTarget.getBoundingClientRect();

        setSelectedForBot(project);

        setActivePlanet("projects");
        registerInteraction("project");

        setActivePlanetPos({
            x: rect.left + rect.width / 2,
            y: rect.top,
        });

        requestSpeech(
            project.botText || project.tagline || "This project demonstrates applied development skills.",
            "projects"
        );

    };



    return (
        <div className="min-h-screen relative overflow-hidden bg-space-dark">
            {/* Minimal Space Background Layer */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">

                {/* Subtle Black Hole – smaller and softer */}
                <div className="absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-[500px] md:w-[700px] h-[500px] md:h-[700px] opacity-70">
                    <div className="absolute inset-0 rounded-full bg-black opacity-85" />
                    <motion.div
                        className="absolute inset-0 rounded-full opacity-20 blur-3xl"
                        style={{
                            background: 'conic-gradient(from 0deg at 50% 50%, transparent, #ff6b6b88, #ff8e5388, transparent)',
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                    />
                </div>

                {/* Only 2 subtle planets/moons */}
                {[...Array(2)].map((_, i) => (
                    <motion.div
                        key={`planet-${i}`}
                        className="absolute rounded-full opacity-25"
                        style={{
                            width: i === 0 ? '80px' : '50px',
                            height: i === 0 ? '80px' : '50px',
                            top: i === 0 ? '18%' : '65%',
                            left: i === 0 ? '12%' : '78%',
                            background: i === 0
                                ? 'radial-gradient(circle at 35% 35%, #c7d2fe, #6366f1, #1e1b4b)'
                                : 'radial-gradient(circle at 40% 40%, #fecaca, #dc2626, #43121d)',
                            boxShadow: '0 0 30px rgba(255,255,255,0.08), inset 0 0 20px rgba(0,0,0,0.6)',
                        }}
                        animate={{
                            y: [0, -15, 0],
                            rotate: [0, i === 0 ? 180 : -180],
                        }}
                        transition={{
                            duration: 35 + i * 10,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        {/* Minimal crater */}
                        <div className="absolute top-[25%] left-[30%] w-2 h-2 bg-black/30 rounded-full" />
                    </motion.div>
                ))}

                {/* Very subtle nebula glows – low opacity */}
                <div className="absolute inset-0 opacity-12">
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-3xl animate-pulse-slow" />
                    <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-cyan-900/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
                </div>

                {/* Minimal starfield – only ~40 stars */}
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full opacity-40"
                        style={{
                            width: `${0.8 + Math.random() * 1.8}px`,
                            height: `${0.8 + Math.random() * 1.8}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={{ opacity: [0.3, 0.9, 0.3] }}
                        transition={{
                            duration: 4 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 6,
                        }}
                    />
                ))}

            </div>

            {/* Foreground content – unchanged from your original */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <div className="inline-block relative mb-6">
                        <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-400"></div>
                        <div className="absolute -top-4 -right-4 w-8 h-8 border-r-2 border-t-2 border-cyan-400"></div>
                        <div className="absolute -bottom-4 -left-4 w-8 h-8 border-l-2 border-b-2 border-cyan-400"></div>
                        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-400"></div>

                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold tracking-wider px-8 py-4"
                            style={{
                                background: 'linear-gradient(135deg, #00D9FF, #FFFFFF, #00D9FF)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0 0 40px rgba(0, 217, 255, 0.3)',
                            }}
                        >
                            MISSION ARCHIVE
                        </h1>
                    </div>
                    <p className="text-cyan-300/80 text-sm md:text-base tracking-widest uppercase">Select Mission for Audio Briefing</p>
                </motion.div>

                {/* Main Project - Holographic Display */}
                {mainProject && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mb-16 md:mb-20"
                    >
                        <HolographicMainProject
                            project={mainProject}
                            onView={setSelectedProject}
                            onSelect={handleSelectProject}
                            isSelected={selectedForBot?.id === mainProject.id}
                        />
                    </motion.div>
                )}

                {/* Major Projects - Hex Grid */}
                {majorProjects.length > 0 && (
                    <div className="mb-16 md:mb-20">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mb-8 flex items-center gap-4"
                        >
                            <div className="flex items-center gap-2">
                                <motion.div
                                    className="w-3 h-3 bg-cyan-400 rotate-45"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <h2 className="text-2xl md:text-3xl font-heading font-bold text-cyan-300 tracking-wider">
                                    PRIMARY MISSIONS
                                </h2>
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/50 to-transparent"></div>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            {majorProjects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                                >
                                    <HexagonalProject
                                        project={project}
                                        onView={setSelectedProject}
                                        onSelect={handleSelectProject}
                                        isSelected={selectedForBot?.id === project.id}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Minor Projects - Compact Terminals */}
                {minorProjects.length > 0 && (
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="mb-8 flex items-center gap-4"
                        >
                            <div className="flex items-center gap-2">
                                <motion.div
                                    className="w-3 h-3 bg-purple-400 rounded-full"
                                    animate={{
                                        boxShadow: ['0 0 5px rgba(167, 139, 250, 0.5)', '0 0 15px rgba(167, 139, 250, 1)', '0 0 5px rgba(167, 139, 250, 0.5)']
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <h2 className="text-2xl md:text-3xl font-heading font-bold text-purple-300 tracking-wider">
                                    SUPPORT MODULES
                                </h2>
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-purple-400/50 to-transparent"></div>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {minorProjects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                                >
                                    <TerminalProject
                                        project={project}
                                        onView={setSelectedProject}
                                        onSelect={handleSelectProject}
                                        isSelected={selectedForBot?.id === project.id}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal remains unchanged */}
            <HolographicModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
                onSelect={handleSelectProject}
                isSelected={selectedForBot?.id === selectedProject?.id}
            />
        </div>
    );
};


// Holographic Main Project Display
const HolographicMainProject = ({ project, onView, onSelect, isSelected }) => {
    return (
        <div className="relative group">
            {/* Animated Scanlines */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 217, 255, 0.03) 0px, rgba(0, 217, 255, 0.03) 1px, transparent 1px, transparent 2px)',
                }}
                animate={{ backgroundPositionY: ['0px', '100px'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />

            {/* Outer Holographic Frame */}
            <div className="relative p-1">
                {/* Corner Elements */}
                <div className="absolute -top-2 -left-2 w-12 h-12 border-l-2 border-t-2 border-cyan-400 opacity-70"></div>
                <div className="absolute -top-2 -right-2 w-12 h-12 border-r-2 border-t-2 border-cyan-400 opacity-70"></div>
                <div className="absolute -bottom-2 -left-2 w-12 h-12 border-l-2 border-b-2 border-cyan-400 opacity-70"></div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 border-r-2 border-b-2 border-cyan-400 opacity-70"></div>

                {/* Glowing Border Animation */}
                <motion.div
                    className="absolute inset-0 rounded-lg"
                    style={{
                        boxShadow: '0 0 20px rgba(0, 217, 255, 0.3), inset 0 0 20px rgba(0, 217, 255, 0.1)',
                    }}
                    animate={{
                        boxShadow: [
                            '0 0 20px rgba(0, 217, 255, 0.3), inset 0 0 20px rgba(0, 217, 255, 0.1)',
                            '0 0 40px rgba(0, 217, 255, 0.5), inset 0 0 30px rgba(0, 217, 255, 0.2)',
                            '0 0 20px rgba(0, 217, 255, 0.3), inset 0 0 20px rgba(0, 217, 255, 0.1)',
                        ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Main Content Container */}
                <div className="relative bg-gradient-to-br from-space-dark/95 via-space-blue/80 to-space-purple/80 backdrop-blur-md border border-cyan-400/30 rounded-lg overflow-hidden">
                    {/* Status Bar */}
                    <div className="flex items-center justify-between px-6 py-3 border-b border-cyan-400/20 bg-cyan-400/5">
                        <div className="flex items-center gap-3">
                            <motion.div
                                className="w-2 h-2 bg-cyan-400 rounded-full"
                                animate={{
                                    boxShadow: ['0 0 5px #00D9FF', '0 0 15px #00D9FF', '0 0 5px #00D9FF'],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <span className="text-cyan-300 text-xs font-mono uppercase tracking-widest">Flagship Mission</span>
                            <span className="text-cyan-300/50 text-xs font-mono">|</span>
                            <span className="text-cyan-300/70 text-xs font-mono">{project.date}</span>
                        </div>

                        {/* Mission ID */}
                        <span className="text-cyan-300/50 text-xs font-mono">ID: {String(project.id).padStart(3, '0')}</span>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left: Info */}
                            <div className="flex-1">
                                <h3 className="text-3xl md:text-4xl font-heading font-bold mb-3"
                                    style={{
                                        background: 'linear-gradient(135deg, #00D9FF 0%, #FFFFFF 50%, #00D9FF 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        letterSpacing: '2px',
                                    }}
                                >
                                    {project.title.toUpperCase()}
                                </h3>
                                <p className="text-cyan-300/80 text-base md:text-lg mb-4 font-light">{project.tagline}</p>

                                <p className="text-accent/70 text-sm md:text-base leading-relaxed mb-6">
                                    {project.description}
                                </p>

                                {/* Tech Grid */}
                                <div className="mb-6">
                                    <div className="text-cyan-300/60 text-xs font-mono mb-3 uppercase tracking-wider">Technology Array</div>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech.map((tech, index) => (
                                            <motion.span
                                                key={index}
                                                className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono rounded"
                                                whileHover={{
                                                    borderColor: 'rgba(0, 217, 255, 0.6)',
                                                    backgroundColor: 'rgba(0, 217, 255, 0.15)',
                                                }}
                                            >
                                                {tech}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onView(project)}
                                        className="px-6 py-3 bg-cyan-400/20 border border-cyan-400/50 text-cyan-300 font-mono text-sm rounded hover:bg-cyan-400/30 transition-colors"
                                    >
                                        [ VIEW BRIEFING ]
                                    </motion.button>

                                    <motion.a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-6 py-3 bg-primary-light/50 border border-secondary/50 text-accent font-mono text-sm rounded hover:bg-primary-light transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        REPOSITORY
                                    </motion.a>
                                </div>
                            </div>

                            {/* Right: Select Panel */}
                            <div className="lg:w-64 flex-shrink-0">
                                <div className="h-full bg-cyan-400/5 border border-cyan-400/20 rounded p-4 flex flex-col items-center justify-center">
                                    <motion.div
                                        className="w-24 h-24 mb-4 relative"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                    >
                                        <svg viewBox="0 0 100 100" className="w-full h-full">
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0, 217, 255, 0.2)" strokeWidth="1" />
                                            <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(0, 217, 255, 0.3)" strokeWidth="1" />
                                            <circle cx="50" cy="50" r="25" fill="none" stroke="rgba(0, 217, 255, 0.4)" strokeWidth="1" />
                                            <circle cx="50" cy="50" r="3" fill="#00D9FF" />
                                        </svg>
                                    </motion.div>

                                    <motion.button
                                        handleProjectSelect
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={(e) => onSelect(project, e)}
                                        className={`w-full px-6 py-4 rounded font-mono text-sm transition-all duration-300 ${isSelected
                                            ? 'bg-success text-white border-2 border-success shadow-lg shadow-success/50'
                                            : 'bg-cyan-400/20 text-cyan-300 border-2 border-cyan-400/50 hover:bg-cyan-400/30'
                                            }`}
                                    >
                                        {isSelected ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                SELECTED
                                            </span>
                                        ) : (
                                            '[ SELECT MISSION ]'
                                        )}
                                    </motion.button>

                                    {isSelected && (
                                        <motion.p
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-success text-xs font-mono mt-3 text-center"
                                        >
                                            Ready for audio briefing
                                        </motion.p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Hexagonal Project Panel
const HexagonalProject = ({ project, onView, onSelect, isSelected }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="relative h-full"
        >
            {/* Hexagonal Glow */}
            <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(0, 217, 255, 0.15) 0%, transparent 70%)',
                }}
            />

            {/* Angled Corners */}
            <div className="relative h-full bg-gradient-to-br from-space-blue/60 to-space-purple/60 backdrop-blur-sm border border-cyan-400/30"
                style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
            >
                <div className="p-5 md:p-6 h-full flex flex-col">
                    {/* Header Bar */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <motion.div
                                className="w-2 h-2 bg-cyan-400"
                                style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                            />
                            <span className="text-cyan-300/60 text-xs font-mono">PRIMARY</span>
                        </div>
                        <span className="text-cyan-300/40 text-xs font-mono">#{String(project.id).padStart(2, '0')}</span>
                    </div>

                    {/* Title */}
                    <div className="mb-3">
                        <h3 className="text-xl md:text-2xl font-heading font-bold text-cyan-300 mb-1 leading-tight">
                            {project.title}
                        </h3>
                        <p className="text-cyan-300/60 text-sm font-light">{project.tagline}</p>
                    </div>

                    {/* Date */}
                    <div className="text-xs font-mono text-cyan-300/40 mb-4">{project.date}</div>

                    {/* Description */}
                    <p className="text-accent/70 text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">
                        {project.description}
                    </p>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tech.slice(0, 4).map((tech, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono"
                                style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                            >
                                {tech}
                            </span>
                        ))}
                        {project.tech.length > 4 && (
                            <span className="px-2 py-1 text-cyan-300/40 text-xs font-mono">
                                +{project.tech.length - 4}
                            </span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto pt-4 border-t border-cyan-400/20">
                        <motion.button
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => onSelect(project, e)}
                            className={`flex-shrink-0 px-4 py-2 font-mono text-xs transition-all ${isSelected
                                ? 'bg-success text-white border border-success'
                                : 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50 hover:bg-cyan-400/30'
                                }`}
                            style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                        >
                            {isSelected ? '✓ ACTIVE' : 'SELECT'}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onView(project)}
                            className="flex-1 px-4 py-2 bg-primary-light/50 border border-secondary/50 text-accent font-mono text-xs hover:bg-primary-light transition-colors"
                            style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                        >
                            DETAILS
                        </motion.button>

                        <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-shrink-0 p-2 bg-primary-light/50 border border-secondary/50 text-accent hover:bg-primary-light transition-colors"
                            style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </motion.a>
                    </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-400/50"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyan-400/50"></div>
            </div>
        </motion.div>
    );
};

// Terminal Project Module
const TerminalProject = ({ project, onView, onSelect, isSelected }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative h-full"
        >
            {/* Terminal Container */}
            <div className="h-full bg-space-dark/90 border border-purple-400/30 rounded overflow-hidden backdrop-blur-sm">
                {/* Terminal Header */}
                <div className="bg-purple-400/10 border-b border-purple-400/30 px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-danger/80"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-400/80"></div>
                        <div className="w-2 h-2 rounded-full bg-success/80"></div>
                        <span className="text-purple-300/60 text-xs font-mono ml-2">module_{project.id}</span>
                    </div>
                    <span className="text-purple-300/40 text-xs font-mono">{project.date}</span>
                </div>

                {/* Terminal Body */}
                <div className="p-4 font-mono text-sm">
                    {/* Command Prompt */}
                    <div className="flex items-start gap-2 mb-2">
                        <span className="text-purple-400">$</span>
                        <div className="flex-1">
                            <span className="text-purple-300">cat</span>
                            <span className="text-purple-300/60"> project.info</span>
                        </div>
                    </div>

                    {/* Output */}
                    <div className="pl-4 space-y-2 mb-3">
                        <div>
                            <span className="text-purple-400/60">NAME:</span>
                            <span className="text-purple-300 ml-2">{project.title}</span>
                        </div>
                        <div>
                            <span className="text-purple-400/60">DESC:</span>
                            <span className="text-purple-300/80 ml-2 text-xs">{project.tagline}</span>
                        </div>
                    </div>

                    {/* Tech Array */}
                    <div className="flex flex-wrap gap-1 mb-3">
                        {project.tech.slice(0, 3).map((tech, index) => (
                            <span
                                key={index}
                                className="px-2 py-0.5 bg-purple-400/10 border border-purple-400/30 text-purple-300 text-xs"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    {/* Command Line Actions */}
                    <div className="space-y-1.5">
                        <motion.button
                            whileHover={{ x: 2 }}
                            onClick={(e) => onSelect(project, e)}
                            className={`w-full text-left flex items-center gap-2 px-2 py-1.5 text-xs transition-colors ${isSelected
                                ? 'bg-success/20 text-success border border-success/50'
                                : 'bg-purple-400/10 text-purple-300 border border-purple-400/30 hover:bg-purple-400/20'
                                }`}
                        >
                            <span className="text-purple-400">$</span>
                            {isSelected ? '✓ ./select.sh --active' : './select.sh'}
                        </motion.button>

                        <motion.button
                            whileHover={{ x: 2 }}
                            onClick={() => onView(project)}
                            className="w-full text-left flex items-center gap-2 px-2 py-1.5 bg-purple-400/10 border border-purple-400/30 text-purple-300 text-xs hover:bg-purple-400/20 transition-colors"
                        >
                            <span className="text-purple-400">$</span>
                            ./view_details.sh
                        </motion.button>
                    </div>
                </div>

                {/* Blinking Cursor */}
                <motion.div
                    className="absolute bottom-4 right-4 w-1.5 h-3 bg-purple-400"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                />
            </div>
        </motion.div>
    );
};

// Holographic Modal
const HolographicModal = ({ project, onClose, onSelect, isSelected }) => {
    if (!project) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Scanline Effect */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 217, 255, 0.03) 0px, rgba(0, 217, 255, 0.03) 2px, transparent 2px, transparent 4px)',
                    }}
                    animate={{ backgroundPositionY: ['0px', '100px'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Corner Brackets */}
                    <div className="absolute -top-3 -left-3 w-16 h-16 border-l-2 border-t-2 border-cyan-400 z-10"></div>
                    <div className="absolute -top-3 -right-3 w-16 h-16 border-r-2 border-t-2 border-cyan-400 z-10"></div>
                    <div className="absolute -bottom-3 -left-3 w-16 h-16 border-l-2 border-b-2 border-cyan-400 z-10"></div>
                    <div className="absolute -bottom-3 -right-3 w-16 h-16 border-r-2 border-b-2 border-cyan-400 z-10"></div>

                    {/* Main Container */}
                    <div className="bg-gradient-to-br from-space-dark/98 via-space-blue/95 to-space-purple/95 backdrop-blur-xl border-2 border-cyan-400/30 rounded">
                        {/* Header Bar */}
                        <div className="bg-cyan-400/10 border-b-2 border-cyan-400/30 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <motion.div
                                    className="w-3 h-3 bg-cyan-400"
                                    animate={{
                                        boxShadow: ['0 0 10px #00D9FF', '0 0 20px #00D9FF', '0 0 10px #00D9FF'],
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <div>
                                    <span className="text-cyan-300 text-xs font-mono uppercase tracking-widest">Mission Briefing</span>
                                    <span className="text-cyan-300/50 text-xs font-mono mx-2">|</span>
                                    <span className={`text-xs font-mono uppercase ${project.type === 'main' ? 'text-cyan-300' : project.type === 'major' ? 'text-blue-300' : 'text-purple-300'
                                        }`}>
                                        {project.type} Project
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Select Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => onSelect(project, e)}
                                    className={`px-5 py-2 font-mono text-xs transition-all ${isSelected
                                        ? 'bg-success text-white border border-success shadow-lg shadow-success/50'
                                        : 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50 hover:bg-cyan-400/30'
                                        }`}
                                    style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                                >
                                    {isSelected ? '✓ SELECTED' : '[ SELECT ]'}
                                </motion.button>

                                {/* Close Button */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="w-8 h-8 bg-danger/20 hover:bg-danger/40 border border-danger/50 text-accent flex items-center justify-center transition-colors font-bold"
                                >
                                    ✕
                                </motion.button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-100px)] custom-scrollbar">
                            {/* Title Section */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-cyan-300/60 text-xs font-mono">ID: {String(project.id).padStart(3, '0')}</span>
                                    <span className="text-cyan-300/40">|</span>
                                    <span className="text-cyan-300/60 text-xs font-mono">{project.date}</span>
                                </div>

                                <h2 className="text-3xl md:text-5xl font-heading font-bold mb-3"
                                    style={{
                                        background: 'linear-gradient(135deg, #00D9FF 0%, #FFFFFF 50%, #00D9FF 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        letterSpacing: '2px',
                                    }}
                                >
                                    {project.title.toUpperCase()}
                                </h2>
                                <p className="text-cyan-300 text-lg md:text-xl font-light">{project.tagline}</p>
                            </div>

                            {/* Description Panel */}
                            <div className="mb-6 p-6 bg-cyan-400/5 border border-cyan-400/20 rounded">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1 h-6 bg-cyan-400"></div>
                                    <h3 className="text-lg font-heading font-bold text-cyan-300 uppercase tracking-wide">Mission Overview</h3>
                                </div>
                                <p className="text-accent/80 leading-relaxed">{project.description}</p>
                            </div>

                            {/* Features Grid */}
                            <div className="mb-6 p-6 bg-purple-400/5 border border-purple-400/20 rounded">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1 h-6 bg-purple-400"></div>
                                    <h3 className="text-lg font-heading font-bold text-purple-300 uppercase tracking-wide">Key Features</h3>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {project.features.map((feature, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-start gap-2"
                                        >
                                            <motion.div
                                                className="w-1.5 h-1.5 bg-cyan-400 mt-1.5 flex-shrink-0"
                                                animate={{
                                                    boxShadow: ['0 0 3px #00D9FF', '0 0 8px #00D9FF', '0 0 3px #00D9FF'],
                                                }}
                                                transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                                            />
                                            <span className="text-accent/80 text-sm">{feature}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Tech Stack */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1 h-6 bg-pink-400"></div>
                                    <h3 className="text-lg font-heading font-bold text-pink-300 uppercase tracking-wide">Technology Array</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {project.tech.map((tech, index) => (
                                        <motion.span
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.03 }}
                                            whileHover={{ scale: 1.05 }}
                                            className="px-4 py-2 bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-mono text-sm"
                                            style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                                        >
                                            {tech}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-cyan-400/20">
                                <motion.a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.02, x: 2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 px-6 py-4 bg-cyan-400/20 border border-cyan-400/50 text-cyan-300 font-mono text-sm hover:bg-cyan-400/30 transition-colors flex items-center justify-center gap-2"
                                    style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                    [ ACCESS REPOSITORY ]
                                </motion.a>

                                {project.live && (
                                    <motion.a
                                        href={project.live}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.02, x: 2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1 px-6 py-4 bg-success/20 border border-success/50 text-success font-mono text-sm hover:bg-success/30 transition-colors flex items-center justify-center gap-2"
                                        style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
                                    >
                                        [ LAUNCH DEMO ]
                                    </motion.a>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 217, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 217, 255, 0.3);
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 217, 255, 0.5);
          border: 2px solid transparent;
          background-clip: padding-box;
        }
      `}</style>
        </AnimatePresence>
    );
};


export default Projects;
