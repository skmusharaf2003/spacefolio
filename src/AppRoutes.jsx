import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useMascot } from "./context/MascotContext";

import Home from "./pages/Home";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Journey from "./pages/Journey";
import Experience from "./pages/ExperienceSection";
import Contact from "./pages/Contact";


const routeNarration = {
    "/": {
        planet: "home",
        text: "Welcome. You can explore my skills, projects, journey, and experience.",
    },
    "/skills": {
        planet: "skills",
        text: "This section highlights my core skills and learning path.",
    },
    "/projects": {
        planet: "projects",
        text: "Here are the projects I’ve built. Select one to hear more.",
    },
    "/journey": {
        planet: "journey",
        text: "This section represents my professional journey.",
    },
    "/experience": {
        planet: "experience",
        text: "Here’s my real-world experience and roles. Thank you.",
    },
    "/contact": {
        planet: "contact",
        text: "Here are the best ways to contact me.",
    },
};

const AppRoutes = () => {
    const location = useLocation();
    const {
        setActivePlanet,
        setCurrentPage,
        registerInteraction,
    } = useMascot();

    useEffect(() => {
        const config = routeNarration[location.pathname];
        if (!config) return;

        setActivePlanet(config.planet);
        setCurrentPage(config.planet);
        registerInteraction("route");
        localStorage.setItem("lastVisitedPage", config.planet);
        // Speech is now user-initiated via explicit interactions.
    }, [location.pathname]);



    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/contact" element={<Contact />} />
        </Routes>
    );
};

export default AppRoutes;
