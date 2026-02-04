import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { skillsData } from "../data/skillsContent";
import CoreSkillsWave from "../components/skills/OrbitCoreSkills";
import SupportingSkillsWave from "../components/skills/SupportingSkillsWave";
import BackButton from "../components/BackButton";

// Enhanced Starfield with depth
const EnhancedStarField = () => {
    const stars = React.useMemo(
        () =>
            Array.from({ length: 150 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 2 + 0.3,
                opacity: Math.random() * 0.7 + 0.3,
                duration: Math.random() * 4 + 3,
            })),
        []
    );

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute bg-white rounded-full"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        opacity: star.opacity,
                    }}
                    animate={{
                        opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
};

// Current Mission Panel (Updated for learningTrajectory)
const CurrentMissionPanel = ({ learning }) => {
    // Calculate mock progress based on state
    const progress = learning.state === "in-progress" ? 35 : 100;

    return (
        <motion.div
            className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 mb-12"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-cyan-400 text-xl font-bold">Current Mission</h3>
                <div className="w-12 h-12 rounded-full border-4 border-cyan-500/30 relative">
                    <motion.div
                        className="absolute inset-0 rounded-full border-4 border-cyan-500"
                        style={{
                            borderRightColor: 'transparent',
                            borderBottomColor: 'transparent',
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-cyan-400 text-xs font-bold">
                        {progress}%
                    </div>
                </div>
            </div>

            <div className="mb-3">
                <h4 className="text-white text-lg font-semibold mb-2">
                    Exploring {learning.name}
                </h4>
                <p className="text-cyan-300 text-sm mb-1">{learning.focus}</p>
                <p className="text-cyan-400/70 text-xs mb-3">Learning via {learning.source}</p>

                {/* Progress bar */}
                <div className="relative w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
                    />
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/4"
                        animate={{ x: ['0%', '400%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            </div>

            {/* Mini chart visualization */}
            <div className="h-16 flex items-end gap-1 opacity-50">
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.random() * 100}%` }}
                        transition={{
                            duration: 0.5,
                            delay: i * 0.05,
                            repeat: Infinity,
                            repeatType: "reverse",
                            repeatDelay: 1,
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
};

// Course Card Component (Updated for educationSources)
const CourseCard = ({ course, index }) => {
    return (
        <motion.div
            className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-5 hover:border-cyan-400/60 transition-all group"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{
                y: -5,
                boxShadow: "0 10px 30px rgba(34, 211, 238, 0.2)",
            }}
        >
            <div className="relative">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-3xl" />
                <h4 className="text-white font-semibold text-lg mb-2">{course.name}</h4>
                <p className="text-cyan-400 text-sm">{course.provider}</p>

                {/* Completion checkmark */}
                <div className="mt-3 flex items-center gap-2 text-green-400 text-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Completed</span>
                </div>
            </div>
        </motion.div>
    );
};

// Skill Detail Panel Component
const SkillDetailPanel = ({ skill, onClose }) => {
    if (!skill) return null;

    return (
        <motion.div
            className="max-w-3xl mx-auto mt-8 p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-blue-300 mb-1">
                        {skill.name}
                    </h3>
                    <p className="text-slate-400 italic">{skill.role}</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${skill.confidence === 'high'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}>
                        {skill.confidence === 'high' ? 'High Confidence' : 'Medium Confidence'}
                    </span>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <p className="text-slate-300 mb-4">{skill.summary}</p>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <h4 className="text-sm font-semibold text-slate-400 mb-2">Usage Areas</h4>
                    <ul className="space-y-1">
                        {skill.usage.map((use, i) => (
                            <li key={i} className="text-slate-300 text-sm flex items-center">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                                {use}
                            </li>
                        ))}
                    </ul>
                </div>

                {skill.ecosystem.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-slate-400 mb-2">Ecosystem</h4>
                        <ul className="space-y-1">
                            {skill.ecosystem.map((eco, i) => (
                                <li key={i} className="text-slate-300 text-sm flex items-center">
                                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
                                    {eco}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// Supporting Skill Display Component
const SupportingSkillDisplay = ({ skillName }) => {
    if (!skillName) return null;

    return (
        <motion.div
            className="max-w-xl mx-auto mt-8 p-4 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
        >
            <h3 className="text-xl font-bold text-purple-300 mb-1">
                {skillName}
            </h3>
            <p className="text-slate-400 text-sm">
                Supporting technology in my development toolkit
            </p>
        </motion.div>
    );
};

// Main Component
const SpacefolioSkills = () => {
    const [selectedCoreSkill, setSelectedCoreSkill] = useState(null);
    const [selectedSupportSkill, setSelectedSupportSkill] = useState(null);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
            <EnhancedStarField />

            <div className="relative z-10 px-4 py-16 max-w-7xl mx-auto">
                <BackButton className="mb-8" />
                {/* Header */}
                <div style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: '15px 20px 40px',
                    textAlign: 'center',
                }}>
                    <motion.h1
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="text-hero-gradient"
                        style={{
                            fontSize: 'clamp(40px, 8vw, 96px)',
                            fontWeight: 900,
                            margin: 0,
                            letterSpacing: '-0.03em',
                            lineHeight: 1,
                        }}
                    >
                        SKILLS GALAXY
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        style={{
                            fontSize: 'clamp(14px, 2vw, 20px)',
                            color: '#778DA9',
                            marginTop: '20px',
                            fontWeight: 300,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Explore the Universe of My Technical Expertise
                    </motion.p>
                </div>

                {/* Current Mission */}
                {skillsData.learningTrajectory.map((learning, idx) => (
                    <CurrentMissionPanel key={idx} learning={learning} />
                ))}

                {/* Core Skills Section */}
                <motion.div
                    className="mb-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-4xl font-bold mb-8 text-center text-cyan-400">
                        Core Capabilities
                    </h2>
                    <p className="text-center text-slate-400 mb-8 max-w-2xl mx-auto">
                        The foundation of my technical expertise
                    </p>

                    <CoreSkillsWave
                        skills={skillsData.coreCapabilities}
                        onSelect={setSelectedCoreSkill}
                    />

                    {/* Core Skill Detail Panel */}
                    {selectedCoreSkill && (
                        <SkillDetailPanel
                            skill={selectedCoreSkill}
                            onClose={() => setSelectedCoreSkill(null)}
                        />
                    )}
                </motion.div>

                {/* Supporting Stack Section */}
                <motion.div
                    className="mb-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <h2 className="text-4xl font-bold mb-8 text-center text-purple-400">
                        Supporting Stack
                    </h2>
                    <p className="text-center text-slate-400 mb-8 max-w-2xl mx-auto">
                        Tools and technologies that complement my workflow
                    </p>

                    <SupportingSkillsWave
                        skills={skillsData.supportingStack}
                        onSelect={setSelectedSupportSkill}
                    />

                    {/* Supporting Skill Display */}
                    {selectedSupportSkill && (
                        <SupportingSkillDisplay skillName={selectedSupportSkill} />
                    )}
                </motion.div>

                {/* Completed Courses */}
                <motion.div
                    className="mb-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    <h2 className="text-4xl font-bold mb-8 text-center text-cyan-400">
                        Education Journey
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {skillsData.educationSources.map((course, idx) => (
                            <CourseCard key={idx} course={course} index={idx} />
                        ))}
                    </div>
                </motion.div>

                {/* Certificates CTA */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                >
                    <motion.a
                        href={skillsData.certificates.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block relative group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                        <div className="relative bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-4 px-10 rounded-xl border-2 border-cyan-400 shadow-2xl">
                            <span className="text-xl flex items-center gap-3">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                {skillsData.certificates.label}
                            </span>
                        </div>
                    </motion.a>
                </motion.div>
            </div>
        </div>
    );
};

export default SpacefolioSkills;
