import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { speak } from "./useSpeech";
import { useMascot } from "../context/MascotContext";
import { navigationGuide } from "../data/navigationGuide";
import { useNavigate } from "react-router-dom";
import { botHints } from "../data/botHints";

const MascotBot = ({ target, speech, voiceEnabled }) => {
    const controls = useAnimation();
    const navigate = useNavigate();
    const [hint, setHint] = useState(null);
    const [isMobile, setIsMobile] = useState(() =>
        window.matchMedia("(max-width: 767px)").matches
    );
    const hintTimerRef = useRef(null);
    const idleTimerRef = useRef(null);
    const recoveryTimerRef = useRef(null);
    const shownHintsRef = useRef(new Set());
    const [direction, setDirection] = useState('right');
    const [vertical, setVertical] = useState('bottom');

    const getIdlePosition = () => {
        const padding = isMobile ? 16 : 24;
        return {
            x: window.innerWidth - padding,
            y: padding,
        };
    };

    const botRef = useRef(null);
    const constraintsRef = useRef(null);
    const [mood, setMood] = useState("idle");
    const {
        guideOpen,
        setGuideOpen,
        activePlanet,
        currentPage,
        lastInteractionTime,
        toggleGuide,
        requestSpeech,
        clearActivePlanetPos,
        clearSpeech
    } = useMascot();

    /* ---------------- POSITIONING HANDLER ---------------- */
    const positionBot = () => {
        if (!botRef.current) return;
        const botRect = botRef.current.getBoundingClientRect();
        const padding = isMobile ? 16 : 24;
        const minX = padding;
        const minY = padding;
        const maxX = window.innerWidth - botRect.width - padding;
        const maxY = window.innerHeight - botRect.height - padding;

        if (target) {
            // Follow target with offset and clamping
            const desiredX = target.x - botRect.width / 2 + 60;
            const desiredY = target.y - botRect.height / 2 - 60;
            const clampedX = Math.min(Math.max(desiredX, minX), maxX);
            const clampedY = Math.min(Math.max(desiredY, minY), maxY);
            controls.start({
                left: clampedX,
                top: clampedY,
                transition: { type: "spring", stiffness: 140, damping: 20 },
            });
        } else {
            // Go to idle (top-right)
            const idle = getIdlePosition();
            controls.start({
                left: idle.x - botRect.width,
                top: idle.y,
                transition: { type: "spring", stiffness: 120, damping: 18 },
            });
        }
    };

    const calculatePositioning = () => {
        const rect = botRef.current?.getBoundingClientRect();
        if (!rect) return;
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const hintWidth = 240; // Approximate average width
        const hintHeight = 60; // Approximate height
        const spaceRight = winW - rect.right;
        const spaceBottom = winH - rect.bottom;

        setDirection(spaceRight < hintWidth ? 'left' : 'right');
        setVertical(spaceBottom < hintHeight ? 'top' : 'bottom');
    };

    useEffect(() => {
        positionBot();
    }, [target, isMobile]);

    useEffect(() => {
        if (mood === 'idle' && !target) {
            positionBot();
        }
    }, [mood]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.matchMedia("(max-width: 767px)").matches);
            positionBot();
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [target]);

    /* ---------------- SPEECH HANDLER ---------------- */
    useEffect(() => {
        if (!speech?.text || !voiceEnabled) return;

        // 🔴 CRITICAL: stop previous speech
        window.speechSynthesis.cancel();

        setMood("thinking");

        const t = setTimeout(() => {
            speak(
                speech.text,
                () => setMood("speaking"),
                () => {
                    setMood("idle");
                    clearSpeech();
                    // Clear target after speech ends and return to idle position
                    setTimeout(() => {
                        clearActivePlanetPos();
                    }, 1500);
                },
                voiceEnabled
            );
        }, 300);

        return () => clearTimeout(t);
    }, [speech, voiceEnabled, clearActivePlanetPos, clearSpeech]);

    /* ---------------- VOICE TOGGLE ---------------- */
    useEffect(() => {
        if (!voiceEnabled) {
            window.speechSynthesis.cancel();
            clearSpeech();
            clearActivePlanetPos();
            setMood("idle");
        }
    }, [voiceEnabled, clearActivePlanetPos, clearSpeech]);

    const normalizeHint = (text) => {
        if (!text) return text;
        if (!isMobile) return text;
        const words = text.split(" ");
        return words.slice(0, 8).join(" ");
    };

    const showHint = (text, type, pageKey) => {
        if (!text || guideOpen) return;
        const key = `${pageKey || "global"}:${type}`;
        if (shownHintsRef.current.has(key)) return;
        const nextHint = normalizeHint(text);
        setHint(nextHint);
        shownHintsRef.current.add(key);
        if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
        hintTimerRef.current = setTimeout(() => setHint(null), 4000);
    };

    useEffect(() => {
        if (!currentPage) return;
        if (guideOpen) return;
        const entryHints = {
            home: "Explore the planets to begin.",
            skills: "Browse skills and learning paths.",
            projects: "Open a project to learn more.",
            journey: "Scroll to see journey phases.",
            experience: "Select a role to hear details.",
            contact: "Pick a contact method here.",
        };
        const pageHint =
            entryHints[currentPage] || botHints[currentPage]?.[0];
        const entryDelay = 700;
        const entryKey = `${currentPage}:entry`;
        if (shownHintsRef.current.has(entryKey)) return;
        const timer = setTimeout(() => {
            showHint(pageHint, "entry", currentPage);
        }, entryDelay);
        return () => clearTimeout(timer);
    }, [currentPage, guideOpen, isMobile]);

    useEffect(() => {
        if (!currentPage) return;
        if (guideOpen) return;
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        if (recoveryTimerRef.current) clearTimeout(recoveryTimerRef.current);

        const idleDelay = isMobile ? 9000 : 11000;
        const recoveryDelay = isMobile ? 16000 : 18000;

        idleTimerRef.current = setTimeout(() => {
            const idleHint =
                botHints[currentPage]?.[1] || "Tap a planet to continue.";
            showHint(idleHint, "idle", currentPage);
        }, idleDelay);

        recoveryTimerRef.current = setTimeout(() => {
            const recoveryHint =
                botHints[currentPage]?.[2] || "Double-tap a planet to navigate.";
            showHint(recoveryHint, "recovery", currentPage);
        }, recoveryDelay);

        return () => {
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            if (recoveryTimerRef.current) clearTimeout(recoveryTimerRef.current);
        };
    }, [currentPage, lastInteractionTime, guideOpen, isMobile]);

    useEffect(() => {
        if (guideOpen) {
            setHint(null);
        }
    }, [guideOpen]);

    useEffect(() => {
        if (lastInteractionTime) {
            setHint(null);
        }
    }, [lastInteractionTime]);

    /* ---------------- CLEANUP ---------------- */
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);
    return (
        <div ref={constraintsRef} className="fixed inset-0 z-50 pointer-events-none">
            <motion.div
                ref={botRef}
                animate={controls}
                initial={{ left: window.innerWidth - 80, top: 16 }}
                className="absolute z-50 pointer-events-auto"
                onClick={toggleGuide}
                onAnimationComplete={calculatePositioning}
            >
                {/* BODY - Glassmorphic orb with gradient */}
                <motion.div
                    className="relative w-12 h-12 md:w-16 md:h-16 rounded-full
        bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
        shadow-2xl flex items-center justify-center cursor-pointer
        border border-white/30 backdrop-blur-sm"
                    animate={{
                        scale: mood === "speaking" ? [1, 1.08, 1] : 1,
                    }}
                    transition={{
                        duration: 0.6,
                        repeat: mood === "speaking" ? Infinity : 0,
                        ease: "easeInOut",
                    }}
                >
                    {/* Enhanced ambient glow */}
                    <motion.div
                        className="absolute -inset-6 rounded-full bg-purple-400/20 blur-2xl"
                        animate={{
                            opacity: mood === "speaking" ? [0.4, 0.8, 0.4] : 0.4,
                            scale: mood === "speaking" ? [1, 1.3, 1] : 1,
                        }}
                        transition={{
                            duration: 1,
                            repeat: mood === "speaking" ? Infinity : 0,
                        }}
                    />

                    {/* Dual rotating rings */}
                    <motion.div
                        className="absolute inset-0 rounded-full border border-indigo-300/40"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.6, 0, 0.6],
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />

                    <motion.div
                        className="absolute inset-0 rounded-full border border-pink-300/40"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.6, 0, 0.6],
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1.25,
                        }}
                    />

                    {/* FACE - Clean white surface with subtle gradient */}
                    <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full 
                        bg-gradient-to-br from-white to-gray-50 
                        shadow-lg border border-gray-100/50">

                        {/* EYES - Modern rounded design */}
                        <div className="absolute top-[32%] left-1/2 -translate-x-1/2 flex gap-2">
                            <motion.div
                                className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full 
                                    bg-gradient-to-br from-slate-700 to-slate-900
                                    shadow-sm"
                                animate={
                                    mood === "speaking"
                                        ? { scaleY: 0.5, scaleX: 1.1 }
                                        : mood === "thinking"
                                            ? {
                                                y: [-1.5, 1.5, -1.5],
                                                rotate: [-5, 5, -5]
                                            }
                                            : { scaleY: [1, 0.1, 1] }
                                }
                                transition={
                                    mood === "idle"
                                        ? { duration: 4, repeat: Infinity, repeatDelay: 3.5 }
                                        : { duration: 0.7, repeat: Infinity, ease: "easeInOut" }
                                }
                            />
                            <motion.div
                                className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full 
                                    bg-gradient-to-br from-slate-700 to-slate-900
                                    shadow-sm"
                                animate={
                                    mood === "speaking"
                                        ? { scaleY: 0.5, scaleX: 1.1 }
                                        : mood === "thinking"
                                            ? {
                                                y: [1.5, -1.5, 1.5],
                                                rotate: [5, -5, 5]
                                            }
                                            : { scaleY: [1, 0.1, 1] }
                                }
                                transition={
                                    mood === "idle"
                                        ? { duration: 4, repeat: Infinity, repeatDelay: 3.5 }
                                        : { duration: 0.7, repeat: Infinity, ease: "easeInOut" }
                                }
                            />
                        </div>

                        {/* Eye shine highlights */}
                        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 flex gap-2">
                            <div className="w-0.5 h-0.5 md:w-1 md:h-1 rounded-full bg-white/80 -ml-[3px]" />
                            <div className="w-0.5 h-0.5 md:w-1 md:h-1 rounded-full bg-white/80 ml-[3px]" />
                        </div>

                        {/* MOUTH - Dynamic speaking animation */}
                        <motion.div
                            className="absolute top-[68%] left-1/3 -translate-x-1/3"
                            animate={
                                mood === "speaking"
                                    ? {
                                        scaleY: [1, 2.8, 1, 2.5, 1],
                                        scaleX: [1, 1.2, 0.9, 1.15, 1],
                                    }
                                    : mood === "thinking"
                                        ? {
                                            scaleX: 0.6,
                                            scaleY: 0.7,
                                            x: [0, -1, 1, 0]
                                        }
                                        : { scaleX: 1.3, scaleY: 1 }
                            }
                            transition={{
                                duration: mood === "speaking" ? 0.35 : mood === "thinking" ? 0.8 : 0,
                                repeat: mood !== "idle" ? Infinity : 0,
                                ease: "easeInOut",
                            }}
                        >
                            <div className="w-2 md:w-3 h-[2px] 
                                bg-gradient-to-r from-slate-600 via-slate-700 to-slate-600 
                                rounded-full shadow-sm" />
                        </motion.div>

                        {/* Subtle cheek blush when speaking */}
                        {mood === "speaking" && (
                            <>
                                <motion.div
                                    className="absolute top-[52%] left-[12%] w-2 h-1.5 
                                        bg-rose-400/30 rounded-full blur-[2px]"
                                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 0.9, repeat: Infinity }}
                                />
                                <motion.div
                                    className="absolute top-[52%] right-[12%] w-2 h-1.5 
                                        bg-rose-400/30 rounded-full blur-[2px]"
                                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 0.9, repeat: Infinity }}
                                />
                            </>
                        )}

                        {/* Thinking indicator - small dots */}
                        {mood === "thinking" && (
                            <motion.div
                                className="absolute top-[20%] right-[8%] flex gap-[2px]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-[3px] h-[3px] rounded-full bg-indigo-400"
                                        animate={{
                                            y: [0, -3, 0],
                                            opacity: [0.4, 1, 0.4],
                                        }}
                                        transition={{
                                            duration: 0.6,
                                            repeat: Infinity,
                                            delay: i * 0.15,
                                        }}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </div>

                    {/* Active state indicator */}
                    {mood === "speaking" && (
                        <motion.div
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2
                                w-6 h-1 rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
                            animate={{
                                scaleX: [0.5, 1, 0.5],
                                opacity: [0.3, 0.8, 0.3],
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                            }}
                        />
                    )}
                </motion.div>

                {/* Hint tooltip */}
                {hint && (
                    <motion.div
                        initial={{ opacity: 0, y: vertical === 'bottom' ? 6 : -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`
      absolute ${vertical === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'}
      ${direction === 'left' ? 'right-0' : 'left-0'}
      bg-slate-900/95 backdrop-blur-md
      border border-indigo-500/30
      rounded-lg px-3 py-2
      text-xs text-indigo-100/90
      pointer-events-none
      min-w-[180px]
      max-w-[300px]
      whitespace-normal
      leading-relaxed
      shadow-xl
    `}
                    >
                        {hint}
                    </motion.div>
                )}

                {/* Guide menu */}
                {guideOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className={`absolute ${vertical === 'bottom' ? 'top-full mt-3' : 'bottom-full mb-3'} 
               ${direction === 'left' ? 'right-0' : 'left-0'}
               w-60
               bg-slate-900/95 backdrop-blur-md
               border border-indigo-400/30 rounded-xl p-3 space-y-2 shadow-2xl`}
                    >
                        {navigationGuide[activePlanet]?.length > 0 ? (
                            navigationGuide[activePlanet]
                                .slice(0, isMobile ? 2 : 3)
                                .map((item) => (
                                    <button
                                        key={item.route}
                                        onClick={() => {
                                            requestSpeech(item.script, "navigation");
                                            navigate(item.route);
                                            setGuideOpen(false);
                                        }}
                                        className="w-full text-left text-sm text-indigo-100
                 hover:bg-indigo-500/20 rounded-lg px-3 py-2
                 border border-transparent hover:border-indigo-400/30 
                 transition-all duration-200"
                                    >
                                        {item.label}
                                    </button>
                                ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-xs text-indigo-300/60 px-2 py-2 italic"
                            >
                                Click on a planet to see options
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default MascotBot;