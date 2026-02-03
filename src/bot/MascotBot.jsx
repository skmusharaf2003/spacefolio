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

    const botRef = useRef(null);
    const wrapperRef = useRef(null);
    const constraintsRef = useRef(null);
    const [mood, setMood] = useState("idle");
    const {
        guideOpen,
        setGuideOpen,
        activePlanet,
        currentPage,
        lastInteractionTime,
        toggleGuide,
        registerInteraction,
        requestSpeech
    } = useMascot();

    useEffect(() => {
        const handleResize = () => {
            if (!target) return;
            controls.stop();
            setIsMobile(window.matchMedia("(max-width: 767px)").matches);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [target]);


    /* ---------------- FOLLOW TARGET ---------------- */
    useEffect(() => {
        if (!target || !botRef.current) return;

        const botRect = botRef.current.getBoundingClientRect();

        const padding = 8;

        const minX = padding;
        const minY = padding;

        const maxX = window.innerWidth - botRect.width - padding;
        const maxY = window.innerHeight - botRect.height - padding;

        const desiredX = target.x - botRect.width / 2 + 60;
        const desiredY = target.y - botRect.height / 2 - 60;

        const clampedX = Math.min(Math.max(desiredX, minX), maxX);
        const clampedY = Math.min(Math.max(desiredY, minY), maxY);

        controls.start({
            left: clampedX,
            top: clampedY,
            transition: { type: "spring", stiffness: 140, damping: 20 },
        });
    }, [target]);

    useEffect(() => {
        if (target || !constraintsRef.current) return;
        controls.start({
            right: 20,
            top: 20,
            left: "auto",
            transition: { type: "spring", stiffness: 140, damping: 20 },
        });
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
                () => setMood("idle"),
                voiceEnabled
            );
        }, 300);

        return () => clearTimeout(t);
    }, [speech, voiceEnabled]);

    /* ---------------- VOICE TOGGLE ---------------- */
    useEffect(() => {
        if (!voiceEnabled) {
            window.speechSynthesis.cancel();
            setMood("idle");
        }
    }, [voiceEnabled]);

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

    useEffect(() => {
        if (!guideOpen) return;

        const handleOutsideClick = (event) => {
            if (!wrapperRef.current) return;
            if (!wrapperRef.current.contains(event.target)) {
                setGuideOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("touchstart", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("touchstart", handleOutsideClick);
        };
    }, [guideOpen, setGuideOpen]);




    /* ---------------- CLEANUP ---------------- */
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);
    return (
        <div ref={constraintsRef} className="fixed inset-0 z-50 pointer-events-none">
            <motion.div
                ref={wrapperRef}
                animate={controls}
                initial={{ right: 20, top: 20 }}
                className="absolute z-50 pointer-events-auto"
                onClick={() => {
                    registerInteraction("guide");
                    toggleGuide();
                }}
            >
            {/* BODY */}
            <motion.div
                ref={botRef}
                className="relative w-10 h-10 md:w-14 md:h-14 rounded-full
        bg-gradient-to-br from-secondary to-secondary-light
        shadow-lg flex items-center justify-center cursor-pointer"
            >
                {/* FACE */}
                <div className="relative w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent/95">

                    {/* EYES */}
                    <div className="absolute top-[38%] left-1/2 -translate-x-1/2 flex gap-1">
                        <motion.span
                            className="w-1.5 h-1.5 bg-primary rounded-full"
                            animate={
                                mood === "speaking"
                                    ? { scaleY: 0.6 }
                                    : mood === "thinking"
                                        ? { y: [-1, 1, -1] }
                                        : { scaleY: [1, 0.1, 1] }
                            }
                            transition={
                                mood === "idle"
                                    ? { duration: 4, repeat: Infinity, repeatDelay: 3 }
                                    : { duration: 0.6, repeat: Infinity }
                            }
                        />
                        <motion.span
                            className="w-1.5 h-1.5 bg-primary rounded-full"
                            animate={
                                mood === "speaking"
                                    ? { scaleY: 0.6 }
                                    : mood === "thinking"
                                        ? { y: [1, -1, 1] }
                                        : { scaleY: [1, 0.1, 1] }
                            }
                            transition={
                                mood === "idle"
                                    ? { duration: 4, repeat: Infinity, repeatDelay: 3 }
                                    : { duration: 0.6, repeat: Infinity }
                            }
                        />
                    </div>

                    {/* MOUTH */}
                    <motion.div
                        className="absolute top-[68%] left-1/3 -translate-x-1/3
            w-2.5 h-[2px] bg-primary/70 rounded-full origin-center"
                        animate={
                            mood === "speaking"
                                ? {
                                    scaleY: [1, 2.2, 0.9, 2, 1],
                                    scaleX: [1, 1.12, 0.96, 1.08, 1],
                                }
                                : mood === "thinking"
                                    ? { scaleX: 0.8 }
                                    : { scaleX: 1, scaleY: 1 }
                        }
                        transition={{
                            duration: 0.5,
                            repeat: mood === "speaking" ? Infinity : 0,
                            ease: "easeInOut",
                        }}
                    />
                </div>

                {/* GLOW */}
                <div className="absolute -inset-3 rounded-full bg-secondary/25 blur-lg" />
            </motion.div>
            {hint && (
                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="
      absolute top-full mt-2
      bg-space-dark/85 backdrop-blur-md
      border border-accent/25
      rounded-lg px-3 py-2
      text-xs text-accent/80
      pointer-events-none

      min-w-[190px]
      max-w-[280px]
      whitespace-normal
      leading-relaxed
      shadow-md
    "
                >
                    {hint}
                </motion.div>
            )}

            {guideOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-full mt-3 w-60
               bg-space-dark/90 backdrop-blur-md
               border border-accent/30 rounded-xl p-3 space-y-2 shadow-lg"
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
                                className="w-full text-left text-sm text-accent
                 hover:bg-accent/10 rounded-lg px-3 py-2
                 border border-transparent hover:border-accent/20 transition"
                            >
                                {item.label}
                            </button>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-xs text-accent/60 px-2 py-2 italic"
                        >
                            Double-click on a planet to navigate
                        </motion.div>

                    )}


                </motion.div>
            )}

        </motion.div>
        </div>
    );
};

export default MascotBot;
