import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import JourneyPhase from '../components/journey/JourneyPhase';
import JourneyCurve from '../components/journey/JourneyCurve';
import { journeyPhases } from '../data/journeyData';
import { FiStar } from 'react-icons/fi';

const Journey = () => {
    const [activePhase, setActivePhase] = useState(null);
    const [expandedPhase, setExpandedPhase] = useState(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollPosition / maxScroll) * 100;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handlePhaseClick = (phaseId) => {
        setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
    };

    const handlePhaseActivate = (phaseId) => {
        setActivePhase(phaseId);
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 cosmic-gradient">
                {/* Particle Effects */}
                <div className="absolute inset-0">
                    {[...Array(50)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-accent rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                opacity: [0.2, 1, 0.2],
                                scale: [1, 1.5, 1],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        />
                    ))}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-space-dark/50 to-space-dark" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <motion.div
                    className="text-center py-12 md:py-16 lg:py-20 px-4"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 mb-4 md:mb-6"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                        <FiStar className="text-accent text-3xl md:text-4xl" />
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-3 md:mb-4 text-hero-gradient">
                        My Journey
                    </h1>
                    <p className="text-lg md:text-xl text-accent/80 max-w-2xl mx-auto font-body">
                        Navigate through the phases of your cosmic adventure
                    </p>
                </motion.div>

                {/* Journey Path Container */}
                <div className="relative max-w-7xl mx-auto px-4 pb-20">
                    {/* SVG Curve Path */}
                    <div className="hidden lg:block absolute left-0 right-0 top-0 h-full pointer-events-none">
                        <JourneyCurve phases={journeyPhases} scrollProgress={scrollProgress} />
                    </div>

                    {/* Phase Cards */}
                    <div className="space-y-20 md:space-y-32 lg:space-y-40">
                        {journeyPhases.map((phase, index) => (
                            <motion.div
                                key={phase.id}
                                className={`relative ${index % 2 === 0 ? 'lg:ml-0 lg:mr-auto' : 'lg:ml-auto lg:mr-0'
                                    } lg:w-1/2`}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: false, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <JourneyPhase
                                    phase={phase}
                                    isActive={activePhase === phase.id}
                                    isExpanded={expandedPhase === phase.id}
                                    onClick={() => handlePhaseClick(phase.id)}
                                    onActivate={() => handlePhaseActivate(phase.id)}
                                    alignment={index % 2 === 0 ? 'left' : 'right'}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Progress Indicator */}
                <motion.div
                    className="
    fixed z-50
    bottom-3 right-3
    md:bottom-6 md:right-6
    glass-card
    p-2 md:p-4
    flex items-center gap-2 md:gap-4
  "
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, ease: 'easeOut' }}
                >
                    {/* Percentage */}
                    <motion.div className="text-center leading-none">
                        <motion.div className="text-sm md:text-2xl font-bold text-accent">
                            {Math.round(scrollProgress)}%
                        </motion.div>
                        <motion.div className="hidden md:block text-xs text-accent/70">
                            Journey Progress
                        </motion.div>
                    </motion.div>

                    {/* Progress Ring – hidden on mobile */}
                    <motion.div className="hidden md:block w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 relative">
                        <svg className="transform -rotate-90" viewBox="0 0 64 64">
                            <circle
                                cx="32"
                                cy="32"
                                r="28"
                                fill="none"
                                stroke="rgba(224,225,221,0.1)"
                                strokeWidth="4"
                            />
                            <motion.circle
                                cx="32"
                                cy="32"
                                r="28"
                                fill="none"
                                stroke="#415A77"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 28}`}
                                strokeDashoffset={`${2 * Math.PI * 28 * (1 - scrollProgress / 100)}`}
                                style={{ filter: 'drop-shadow(0 0 6px #415A77)' }}
                            />
                        </svg>
                    </motion.div>
                </motion.div>

            </div>
        </div>
    );
};

export default Journey;
