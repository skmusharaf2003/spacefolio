import React, { createContext, useContext, useRef, useState, useEffect } from "react";

const MascotContext = createContext({
    registerInteraction: () => { },
});



const isMobileViewport = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches;
};

const spokenPagesStorageKey = "spokenPages";
const lastVisitedPageKey = "lastVisitedPage";

export const MascotProvider = ({ children }) => {
    const utteranceRef = useRef(null);

    // voice system
    const [voiceEnabled, setVoiceEnabled] = useState(() => {
        const saved = localStorage.getItem("voiceEnabled");
        if (saved !== null) return JSON.parse(saved);
        return !isMobileViewport();
    });

    useEffect(() => {
        localStorage.setItem("voiceEnabled", JSON.stringify(voiceEnabled));
    }, [voiceEnabled]);


    const [isSpeaking, setIsSpeaking] = useState(false);

    // speech EVENT (this is the key fix)
    const [speech, setSpeech] = useState(null);

    // planet tracking (UI / movement only)
    const [activePlanet, setActivePlanet] = useState(null);
    const [activePlanetPos, setActivePlanetPos] = useState(null);
    const [guideOpen, setGuideOpen] = useState(false);
    const spokenPagesRef = useRef(
        new Set(
            (() => {
                if (typeof window === "undefined") return [];
                try {
                    const stored = localStorage.getItem(spokenPagesStorageKey);
                    return stored ? JSON.parse(stored) : [];
                } catch (error) {
                    return [];
                }
            })()
        )
    );
    const [currentPage, setCurrentPage] = useState(() => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(lastVisitedPageKey);
    });
    const [lastInteractionType, setLastInteractionType] = useState(null);
    const [lastInteractionTime, setLastInteractionTime] = useState(0);
    const lastSpokenTextRef = useRef(null);
    const lastSpokenAtRef = useRef(0);

    function registerInteraction(type) {
        const time = Date.now();
        setLastInteractionType(type);
        setLastInteractionTime(time);
    }


    const toggleGuide = () => {
        setGuideOpen((v) => !v);
    };

    // 🔊 SPEAK FUNCTION (unchanged logic, just centralized)
    const speak = (text, onStart, onEnd, enabled = voiceEnabled) => {
        if (!enabled || !window.speechSynthesis || !text) {
            onEnd?.();
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        utterance.rate = 0.85;
        utterance.pitch = 1.0;
        utterance.volume = 0.75;

        const voices = window.speechSynthesis.getVoices();
        const preferred =
            voices.find((v) =>
                /female|zira|samantha|google uk english female/i.test(v.name)
            ) ||
            voices.find((v) => /google|english/i.test(v.name)) ||
            voices[0];

        if (preferred) utterance.voice = preferred;

        utterance.onstart = () => {
            setIsSpeaking(true);
            onStart?.();
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            onEnd?.();
        };

        utterance.onerror = () => {
            setIsSpeaking(false);
            onEnd?.();
        };

        window.speechSynthesis.speak(utterance);
    };

    // 🛑 STOP
    const stop = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    // Clear planet position (returns bot to idle)
    const clearActivePlanetPos = () => {
        setActivePlanetPos(null);
    };

    // 🎧 TOGGLE VOICE
    const toggleVoice = () => {
        setVoiceEnabled((v) => !v);
        stop();
    };

    /**
     * 🔥 SINGLE ENTRY POINT FOR ALL SPEECH
     * pages, planets, projects, skills, experience, etc.
     */
    const requestSpeech = (text, source = "manual") => {
        if (!text) return;
        if (isSpeaking) return;
        const now = Date.now();
        if (lastSpokenTextRef.current === text) return;
        if (now - lastSpokenAtRef.current < 800) return;
        const allowDuringInteraction = new Set([
            "action",
            "planet",
            "projects",
            "experience",
            "skills",
            "journey",
            "contact",
            "navigation",
        ]).has(source);
        const isInteracting = Date.now() - lastInteractionTime < 1200;
        if (!allowDuringInteraction && isInteracting) return;

        // new object every time → guarantees re-trigger
        setSpeech({
            id: now,
            text,
            source,
        });
        lastSpokenTextRef.current = text;
        lastSpokenAtRef.current = now;
    };

    const clearSpeech = () => {
        setSpeech(null);
    };

    const requestPageSpeech = (page, text) => {
        if (!page || spokenPagesRef.current.has(page)) return;
        spokenPagesRef.current.add(page);
        if (typeof window !== "undefined") {
            sessionStorage.setItem(
                "spokenPages",
                JSON.stringify(Array.from(spokenPagesRef.current))
            );
        }
        requestSpeech(text, "page");
    };


    const requestGuide = (text) => {
        requestSpeech(text, "guide");
    };

    return (
        <MascotContext.Provider
            value={{
                // voice
                voiceEnabled,
                isSpeaking,
                toggleVoice,
                guideOpen,
                setGuideOpen,
                toggleGuide,
                requestPageSpeech,
                registerInteraction,
                // speech control
                speech,
                requestSpeech,
                speak,
                requestGuide,
                stop,
                clearSpeech,

                // planet UI
                activePlanet,
                activePlanetPos,
                setActivePlanet,
                setActivePlanetPos,
                clearActivePlanetPos,
                currentPage,
                setCurrentPage,
                lastInteractionType,
                lastInteractionTime,
            }}
        >
            {children}
        </MascotContext.Provider>
    );
};

export const useMascot = () => useContext(MascotContext);
