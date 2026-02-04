import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Planet from "../planet/Planet";
import { planets, profileData } from "../../data/mockData";
import { useMascot } from "../../context/MascotContext";

const SolarSystem = ({ onPlanetFocus }) => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);

    const { setActivePlanet, setActivePlanetPos, requestSpeech, registerInteraction } = useMascot();

    const [isDragging, setIsDragging] = useState(false);
    const [activePlanetId, setActivePlanetId] = useState(null);
    const [bounds, setBounds] = useState({ left: 0, right: 0 });

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
                    >
                        <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-orange-500 to-red-600 planet-glow"
                            />
                        </div>

                        <div className="text-center bg-primary-light/80 backdrop-blur-sm rounded-lg p-6 border border-secondary max-w-xs">
                            <h3 className="text-2xl font-heading font-bold text-accent">
                                {profileData.name}
                            </h3>
                            <p className="text-secondary-light text-sm">
                                {profileData.title}
                            </p>
                        </div>
                    </motion.div>

                    {/* Planets */}
                    {planets.map((planet, index) => (
                        <Planet
                            key={planet.id}
                            planet={planet}
                            index={index}
                            isDragging={isDragging}
                            isActive={activePlanetId === planet.id}
                            onClick={handlePlanetClick} // Pass event for click position
                        />
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default SolarSystem;
