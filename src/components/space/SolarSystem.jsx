import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import Planet from "../planet/Planet";
import { planets, profileData } from "../../data/mockData";
import { useMascot } from "../../context/MascotContext";
import profileImage from "../../assets/a606302e-a695-4472-860a-6fdf53e0f254.png";

const SolarSystem = ({ onPlanetFocus }) => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);

    const { setActivePlanet, setActivePlanetPos, requestSpeech, registerInteraction } = useMascot();

    const [isDragging, setIsDragging] = useState(false);
    const [activePlanetId, setActivePlanetId] = useState(null);
    const [bounds, setBounds] = useState({ left: 0, right: 0 });
    const [showResumePrompt, setShowResumePrompt] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const dragX = useMotionValue(0);

    // Sun scale effect
    const sunScale = useTransform(dragX, [-400, 0], [0.85, 1]);

    // Get accurate planet position relative to container
    const getPlanetCenterPos = (planetId) => {
        const planetEl = document.querySelector(`[data-planet-id="${planetId}"]`);
        if (!planetEl || !containerRef.current) return null;

        const planetRect = planetEl.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        // Center of planet relative to container
        const centerX = planetRect.left + planetRect.width / 2 - containerRect.left;
        const centerY = planetRect.top + planetRect.height / 2 - containerRect.top;

        return { x: centerX, y: centerY };
    };

    // Focus logic – called on click AND after drag ends
    const focusPlanet = (planet, position = null, shouldSpeak = true) => {
        setActivePlanetId(planet.id);
        setActivePlanet(planet.id);
        registerInteraction("planet");

        const pos = position || getPlanetCenterPos(planet.id);

        if (pos) {
            setActivePlanetPos(pos);
            onPlanetFocus?.(planet, pos);
        }

        // 🔊 SPEAK HERE
        if (planet.script) {
            requestSpeech(planet.script, "planet");
        }
    };


    // Handle planet click
    const handlePlanetClick = ({ id, position, silent = false }) => {
        if (isDragging) return;

        const planet = planets.find((p) => p.id === id);
        if (!planet) return;

        focusPlanet(planet, position, !silent);
    };

    // Auto-refocus active planet after drag ends
    const refocusActivePlanet = () => {
        if (!activePlanetId) return;
        const planet = planets.find((p) => p.id === activePlanetId);
        if (planet) {
            focusPlanet(planet, null, false);
        }
    };

    // Set initial focus to home/sun on mount
    useEffect(() => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();

        setActivePlanet("home");
        setActivePlanetPos({
            x: rect.width / 2,
            y: rect.top + 100, // a bit below sun
        });
    }, []);

    // Optional: Update bounds for drag constraints
    useEffect(() => {
        if (!trackRef.current || !containerRef.current) return;

        const trackWidth = trackRef.current.scrollWidth;
        const containerWidth = containerRef.current.offsetWidth;

        setBounds({
            left: -(trackWidth - containerWidth + 100), // extra padding
            right: 100, // allow some overscroll
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isHovering) {
                setShowResumePrompt((prev) => !prev);
            } else {

            }
        }, 6000);

        return () => clearInterval(interval);
    }, [isHovering]);

    const handleSunClick = () => {
        window.open(profileData.resumeUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="relative w-full">
            {/* Solar System Container */}
            <div
                ref={containerRef}
                className="relative h-[600px] md:h-[700px] overflow-hidden top-2"
            >
                <motion.div
                    ref={trackRef}
                    drag="x"
                    dragConstraints={bounds}
                    dragElastic={0.08}
                    dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
                    style={{ x: dragX }}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={() => {
                        setIsDragging(false);
                        refocusActivePlanet(); // Re-center mascot after drag
                    }}
                    className="absolute left-0 top-0 h-full flex items-center gap-32 md:gap-48 px-8 md:px-16 cursor-grab active:cursor-grabbing"
                >
                    {/* Sun / Profile */}
                    <motion.div
                        style={{ scale: sunScale }}
                        className="relative flex-shrink-0 flex flex-col items-center"
                        onHoverStart={() => setIsHovering(true)}
                        onHoverEnd={() => setIsHovering(false)}
                    >
                        <button
                            type="button"
                            onClick={handleSunClick}
                            className="relative w-48 h-48 md:w-64 md:h-64 mb-6 focus:outline-none group"
                            aria-label="View profile and resume"
                        >
                            {/* Outer glow layers */}
                            <motion.div
                                className="absolute -inset-8 md:-inset-12 rounded-full bg-yellow-400/20 blur-3xl"
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.3, 0.5, 0.3],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />

                            <motion.div
                                className="absolute -inset-6 md:-inset-8 rounded-full bg-orange-400/15 blur-2xl"
                                animate={{
                                    scale: [1, 1.15, 1],
                                    opacity: [0.4, 0.6, 0.4],
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.5,
                                }}
                            />

                            {/* Rotating corona */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background: 'conic-gradient(from 0deg, rgba(251, 191, 36, 0.4), rgba(249, 115, 22, 0.6), rgba(239, 68, 68, 0.4), rgba(251, 191, 36, 0.4))',
                                    filter: 'blur(8px)',
                                }}
                            />

                            {/* Main sun body */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-orange-500 shadow-2xl">
                                {/* Texture overlay */}
                                <div className="absolute inset-0 rounded-full opacity-30 mix-blend-overlay">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200/50 to-transparent" />
                                </div>

                                {/* Animated surface details */}
                                <motion.div
                                    className="absolute inset-0 rounded-full overflow-hidden"
                                    animate={{
                                        background: [
                                            'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                                            'radial-gradient(circle at 70% 60%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                                            'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                                        ],
                                    }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                            </div>

                            {/* Inner profile circle - appears on hover or prompt */}
                            <AnimatePresence mode="wait">
                                {(isHovering || showResumePrompt) && (
                                    <motion.div
                                        initial={{ rotateY: 0, opacity: 0 }}
                                        animate={{ rotateY: 0, opacity: 1 }}
                                        exit={{ rotateY: 90, opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="absolute inset-0 rounded-full overflow-hidden"
                                    >
                                        <AnimatePresence mode="wait">
                                            {showResumePrompt && !isHovering ? (
                                                // Show text prompt
                                                <motion.div
                                                    key="text"
                                                    initial={{ rotateY: -90, opacity: 0 }}
                                                    animate={{ rotateY: 0, opacity: 1 }}
                                                    exit={{ rotateY: 90, opacity: 0 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-900/60 to-slate-800/60 backdrop-blur-sm border-2 border-yellow-400/30 flex items-center justify-center p-6"
                                                    style={{ transformStyle: 'preserve-3d' }}
                                                >
                                                    <div className="text-center">
                                                        <motion.div
                                                            animate={{ scale: [1, 1.1, 1] }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                            className="mb-2"
                                                        >
                                                            <svg className="w-10 h-10 md:w-12 md:h-12 mx-auto text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </motion.div>
                                                        <p className="text-sm md:text-base font-semibold text-yellow-100 leading-tight">
                                                            Click to view
                                                            <br />
                                                            my resume
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                // Show profile image
                                                <motion.div
                                                    key="image"
                                                    initial={{ rotateY: -90, opacity: 0 }}
                                                    animate={{ rotateY: 0, opacity: 1 }}
                                                    exit={{ rotateY: 90, opacity: 0 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="absolute inset-0 rounded-full"
                                                    style={{ transformStyle: 'preserve-3d' }}
                                                >
                                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border-2 border-yellow-400/30">
                                                        <img
                                                            src={profileImage}
                                                            alt={`${profileData.name} profile`}
                                                            className="w-full h-full rounded-full object-cover opacity-70"
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Hover ring effect */}
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-yellow-300/0 group-hover:border-yellow-300/60 transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                            />

                        </button>

                        {/* Profile info card */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="relative"
                        >
                            <div className="text-center bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-md rounded-xl p-4 md:p-5 border border-yellow-400/20 max-w-xs shadow-xl">
                                <h3 className="text-xl md:text-2xl font-heading font-bold text-yellow-100 mb-1">
                                    {profileData.name}
                                </h3>
                                <p className="text-yellow-200/70 text-xs md:text-sm font-medium">
                                    {profileData.title}
                                </p>
                            </div>

                            {/* Subtle glow under card */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-yellow-400/20 blur-xl rounded-full" />
                        </motion.div>
                    </motion.div>

                    {/* Planets */}
                    {planets.map((planet, index) => (
                        <Planet
                            key={planet.id}
                            planet={planet}
                            index={index}
                            isDragging={isDragging}
                            isActive={activePlanetId === planet.id}
                            onClick={handlePlanetClick}
                        />
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default SolarSystem;