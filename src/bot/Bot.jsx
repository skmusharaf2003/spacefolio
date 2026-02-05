import React, { useEffect, useMemo, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMessageCircle, FiX } from 'react-icons/fi'
import { useLocation, useNavigate } from 'react-router-dom'
import { skillsData } from '../data/skillsContent'
import { projects } from '../data/projectsContent'
import { journeyPhases } from '../data/journeyData'
import { experienceData } from '../data/experienceData'
import { contactData } from '../data/contactData'

const Bot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [actions, setActions] = useState([])
    const [mood, setMood] = useState('idle')
    const location = useLocation()
    const navigate = useNavigate()

    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Scroll to bottom whenever messages change
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Mood cycling effect - changes icon periodically
    useEffect(() => {
        const interval = setInterval(() => {
            if (mood === 'idle' && !isOpen) {
                setMood('thinking');
                setTimeout(() => setMood('idle'), 2000);
            }
        }, 8000);
        return () => clearInterval(interval);
    }, [mood, isOpen]);

    const mainProject = useMemo(
        () => projects.find((project) => project.type === 'main'),
        []
    )
    const majorProjects = useMemo(
        () => projects.filter((project) => project.type === 'major'),
        []
    )
    const minorProjects = useMemo(
        () => projects.filter((project) => project.type === 'minor'),
        []
    )

    const pushBotMessage = (text, nextActions = []) => {
        setMood('speaking')
        setMessages((prev) => [
            ...prev,
            { id: Date.now() + Math.random(), text, sender: 'bot' }
        ])
        setActions(nextActions)
        setTimeout(() => setMood('idle'), 1500)
    }

    const pushUserMessage = (text) => {
        setMessages((prev) => [
            ...prev,
            { id: Date.now() + Math.random(), text, sender: 'user' }
        ])
    }

    const action = (label, onSelect) => ({
        id: `${label}-${Math.random()}`,
        label,
        onSelect
    })

    const showMainMenu = () => {
        pushBotMessage(
            "What would you like to explore first?",
            [
                action("Skills", () => showSkillsOverview()),
                action("Projects", () => showProjectsOverview()),
                action("Journey", () => showJourneyOverview()),
                action("Experience", () => showExperienceOverview()),
                action("Contact", () => showContactOverview()),
                action("View All Sections", () => showAllSections(0)),
            ]
        )
    }

    const showAllSections = (pageIndex) => {
        const allSections = [
            "Skills",
            "Projects",
            "Journey",
            "Experience",
            "Contact",
        ]
        const start = pageIndex * 2
        const slice = allSections.slice(start, start + 2)
        pushBotMessage(
            "Here are two sections you can open.",
            [
                ...slice.map((section) =>
                    action(section, () => {
                        if (section === "Skills") showSkillsOverview()
                        if (section === "Projects") showProjectsOverview()
                        if (section === "Journey") showJourneyOverview()
                        if (section === "Experience") showExperienceOverview()
                        if (section === "Contact") showContactOverview()
                    })
                ),
                ...(start + 2 < allSections.length
                    ? [action("View More Sections", () => showAllSections(pageIndex + 1))]
                    : []),
                action("Main Menu", () => showMainMenu())
            ]
        )
    }

    const showSkillsOverview = () => {
        pushBotMessage(
            "I focus on frontend work like React and JavaScript, with backend experience using Node and Express.",
            [
                action("Core Skills", () => showCoreSkillsPreview()),
                action("Supporting Skills", () => showSupportingSkills(0)),
                action("Currently Learning", () => showLearningPreview()),
                action("Go to Skills Page", () => navigate("/skills")),
                action("Main Menu", () => showMainMenu()),
            ]
        )
    }

    const showCoreSkillsPreview = () => {
        const coreSkills = skillsData.coreCapabilities.slice(0, 2)
        pushBotMessage(
            "Here are two of my strongest skills.",
            [
                ...coreSkills.map((skill) =>
                    action(skill.name, () => showSingleSkill(skill))
                ),
                action("View All Core Skills", () => showCoreSkillsList(0)),
                action("Back", () => showSkillsOverview()),
            ]
        )
    }

    const showCoreSkillsList = (pageIndex) => {
        const start = pageIndex * 2
        const slice = skillsData.coreCapabilities.slice(start, start + 2)
        pushBotMessage(
            "Pick a core skill to explore.",
            [
                ...slice.map((skill) =>
                    action(skill.name, () => showSingleSkill(skill))
                ),
                ...(start + 2 < skillsData.coreCapabilities.length
                    ? [action("View More Core Skills", () => showCoreSkillsList(pageIndex + 1))]
                    : []),
                action("Back", () => showSkillsOverview()),
            ]
        )
    }

    const showSingleSkill = (skill) => {
        pushBotMessage(
            `I use ${skill.name} for ${skill.summary.toLowerCase()}.`,
            [
                action("Where I used this", () => showSkillUsage(skill)),
                action("Confidence level", () => showSkillConfidence(skill)),
                action("Back to Core Skills", () => showCoreSkillsList(0)),
                action("Go to Skills Page", () => navigate("/skills")),
                action("Main Menu", () => showMainMenu()),
            ]
        )
    }

    const showSkillUsage = (skill) => {
        const relatedProjects = projects
            .filter((project) => project.tech.includes(skill.name))
            .slice(0, 2)
        const message =
            relatedProjects.length > 0
                ? `You can see ${skill.name} in projects like ${relatedProjects
                    .map((project) => project.title)
                    .join(" and ")}.`
                : "That's better explored directly on the page."
        pushBotMessage(
            message,
            [
                action("Go to Projects Page", () => navigate("/projects")),
                action("Back", () => showSingleSkill(skill)),
                action("Main Menu", () => showMainMenu()),
            ]
        )
    }

    const showSkillConfidence = (skill) => {
        pushBotMessage(
            `${skill.name} confidence: ${skill.confidence}.`,
            [
                action("Back", () => showSingleSkill(skill)),
                action("Go to Skills Page", () => navigate("/skills")),
                action("Main Menu", () => showMainMenu()),
            ]
        )
    }

    const showSupportingSkills = (pageIndex) => {
        const start = pageIndex * 2
        const slice = skillsData.supportingStack.slice(start, start + 2)
        pushBotMessage(
            "Here are two supporting skills.",
            [
                ...slice.map((skill) => action(skill, () => showSupportingDetail(skill))),
                ...(start + 2 < skillsData.supportingStack.length
                    ? [action("View More Supporting Skills", () => showSupportingSkills(pageIndex + 1))]
                    : []),
                action("Back", () => showSkillsOverview()),
            ]
        )
    }

    const showSupportingDetail = (skill) => {
        pushBotMessage(
            `${skill} supports my development workflow.`,
            [
                action("Back", () => showSupportingSkills(0)),
                action("Go to Skills Page", () => navigate("/skills")),
                action("Main Menu", () => showMainMenu()),
            ]
        )
    }

    const showLearningPreview = () => {
        const learning = skillsData.learningTrajectory.slice(0, 1)
        const detail = learning[0]
        pushBotMessage(
            `${detail.name} (${detail.state}) — ${detail.focus}.`,
            [
                ...(skillsData.learningTrajectory.length > 1
                    ? [action("View More Learning", () => showLearningList(0))]
                    : []),
                action("Go to Skills Page", () => navigate("/skills")),
                action("Back", () => showSkillsOverview()),
                action("Main Menu", () => showMainMenu()),
            ]
        )
    }

    const showLearningList = (pageIndex) => {
        const start = pageIndex * 2
        const slice = skillsData.learningTrajectory.slice(start, start + 2)
        pushBotMessage(
            "Here are two items I'm learning.",
            [
                ...slice.map((item) =>
                    action(item.name, () => showLearningDetail(item))
                ),
                ...(start + 2 < skillsData.learningTrajectory.length
                    ? [action("View More Learning", () => showLearningList(pageIndex + 1))]
                    : []),
                action("Back", () => showSkillsOverview()),
            ]
        )
    }

    const showLearningDetail = (item) => {
        pushBotMessage(
            `${item.name} focuses on ${item.focus.toLowerCase()}.`,
            [
                action("Back", () => showSkillsOverview()),
                action("Go to Skills Page", () => navigate("/skills")),
                action("Main Menu", () => showMainMenu()),
            ]
        )
    }

    const showProjectsOverview = () => {
        pushBotMessage(
            "I've worked on a mix of full-stack, frontend, and system-driven projects.",
            [
                action("Main Project", () => showMainProject()),
                action("Major Projects", () => showMajorProjects(0)),
                action("Minor Projects", () => showMinorProjects(0)),
                action("Go to Projects Page", () => navigate("/projects")),
                action("Main Menu", () => showMainMenu()),
            ]
        )
    }

    const showMainProject = () => {
        if (!mainProject) {
            pushBotMessage(
                "That's better explored directly on the page.",
                [
                    action("Go to Projects Page", () => navigate("/projects")),
                    action("Main Menu", () => showMainMenu()),
                ]
            )
            return
        }
        pushBotMessage(
            `${mainProject.title}: ${mainProject.description}`,
            [
                action("Tech Stack", () => showProjectTech(mainProject)),
                action("Key Features", () => showProjectFeatures(mainProject)),
                action("What I learned", () => showProjectLearned(mainProject)),
                action("View Project Page", () => navigate("/projects")),
                action("Back to Projects", () => showProjectsOverview()),
                action("Main Menu", () => showMainMenu()),
            ]
        )
    }

    const showMajorProjects = (pageIndex) => {
        const start = pageIndex * 2
        const slice = majorProjects.slice(start, start + 2)
        pushBotMessage(
            "Here are two major projects worth highlighting.",
            [
                ...slice.map((project) =>
                    action(project.title, () => showSingleProject(project))
                ),
                ...(start + 2 < majorProjects.length
                    ? [action("View More Projects", () => showMajorProjects(pageIndex + 1))]
                    : []),
                action("Back", () => showProjectsOverview()),
            ]
        )
    }

    const showMinorProjects = (pageIndex) => {
        const start = pageIndex * 2
        const slice = minorProjects.slice(start, start + 2)
        pushBotMessage(
            "Here are two minor projects to explore.",
            [
                ...slice.map((project) =>
                    action(project.title, () => showSingleProject(project))
                ),
                ...(start + 2 < minorProjects.length
                    ? [action("View More Projects", () => showMinorProjects(pageIndex + 1))]
                    : []),
                action("Back", () => showProjectsOverview()),
            ]
        )
    }

    const showSingleProject = (project) => {
        pushBotMessage(
            `${project.title}: ${project.description}`,
            [
                action("Tech Stack", () => showProjectTech(project)),
                action("Key Features", () => showProjectFeatures(project)),
                action("What I learned", () => showProjectLearned(project)),
                action("View Project Page", () => navigate("/projects")),
                action("Back to Projects", () => showProjectsOverview()),
                action("Main Menu", () => showMainMenu()),
            ]
        )
    }

    const showProjectTech = (project) => {
        const techList = project.tech.slice(0, 2)
        pushBotMessage(
            `Tech highlights: ${techList.join(" and ")}.`,
            [
                ...(project.tech.length > 2
                    ? [action("View Full Stack", () => showProjectFullTech(project))]
                    : []),
                action("Back", () => showSingleProject(project)),
            ]
        )
    }

    const showProjectFullTech = (project) => {
        const techList = project.tech.slice(2, 4)
        const message = techList.length
            ? `More stack items: ${techList.join(" and ")}.`
            : "That's better explored directly on the page."
        pushBotMessage(
            message,
            [
                action("Back", () => showSingleProject(project)),
                action("View Project Page", () => navigate("/projects")),
            ]
        )
    }

    const showProjectFeatures = (project) => {
        const features = project.features.slice(0, 2)
        pushBotMessage(
            `Key features: ${features.join(" and ")}.`,
            [
                ...(project.features.length > 2
                    ? [action("View More Features", () => showProjectMoreFeatures(project, 1))]
                    : []),
                action("Back", () => showSingleProject(project)),
            ]
        )
    }

    const showProjectMoreFeatures = (project, pageIndex) => {
        const start = pageIndex * 2
        const slice = project.features.slice(start, start + 2)
        pushBotMessage(
            `More features: ${slice.join(" and ")}.`,
            [
                ...(start + 2 < project.features.length
                    ? [action("View More Features", () => showProjectMoreFeatures(project, pageIndex + 1))]
                    : []),
                action("Back", () => showSingleProject(project)),
            ]
        )
    }

    const showProjectLearned = (project) => {
        pushBotMessage(
            "That's better explored directly on the page.",
            [
                action("View Project Page", () => navigate("/projects")),
                action("Back", () => showSingleProject(project)),
                action("Main Menu", () => showMainMenu()),
            ]
        )
    }

    const showJourneyOverview = () => {
        pushBotMessage(
            "My journey shows how I moved from fundamentals to real-world systems.",
            [
                action("Early Learning", () => showJourneyPhase("origin")),
                action("Transition Phase", () => showJourneyPhase("foundation")),
                action("Current Focus", () => showJourneyPhase("execution")),
                action("Go to Journey Page", () => navigate("/journey")),
                action("Main Menu", () => showMainMenu()),
            ]
        )
    }

    const showJourneyPhase = (phaseId) => {
        const phase = journeyPhases.find((item) => item.id === phaseId)
        if (!phase) {
            pushBotMessage(
                "That's better explored directly on the page.",
                [
                    action("Go to Journey Page", () => navigate("/journey")),
                    action("Main Menu", () => showMainMenu()),
                ]
            )
            return
        }
        const highlights = phase.details?.highlights?.slice(0, 2)
        const extra = highlights?.length
            ? ` Highlights: ${highlights.join(" and ")}.`
            : ""
        pushBotMessage(
            `${phase.preview.headline}. ${phase.preview.summary}.${extra}`,
            [
                action("View Full Journey", () => navigate("/journey")),
                action("Back", () => showJourneyOverview()),
                action("Main Menu", () => showMainMenu()),
            ]
        )
    }

    const showExperienceOverview = () => {
        pushBotMessage(
            "I've worked across full-time roles, freelance AI training, and teaching roles.",
            [
                action("Full-Time Experience", () => showExperienceCategory("full-time", 0)),
                action("AI / Freelance Work", () => showExperienceCategory("freelance", 0)),
                action("Teaching Experience", () => showExperienceCategory("teaching", 0)),
                action("Go to Experience Page", () => navigate("/experience")),
                action("Main Menu", () => showMainMenu()),
            ]
        )
    }

    const categorizeExperience = (category) => {
        if (category === "full-time") {
            return experienceData.filter((role) => role.type === "Full-time")
        }
        if (category === "freelance") {
            return experienceData.filter((role) => role.type === "Freelance")
        }
        if (category === "teaching") {
            return experienceData.filter((role) =>
                role.role.toLowerCase().includes("teaching")
            )
        }
        return []
    }

    const showExperienceCategory = (category, index) => {
        const roles = categorizeExperience(category)
        const role = roles[index]
        if (!role) {
            pushBotMessage(
                "That's better explored directly on the page.",
                [
                    action("Go to Experience Page", () => navigate("/experience")),
                    action("Back", () => showExperienceOverview()),
                ]
            )
            return
        }
        pushBotMessage(
            "Here's one role that shaped my experience.",
            [
                action(`${role.role} – ${role.company}`, () => showExperienceDetail(category, index)),
                ...(index + 1 < roles.length
                    ? [action("View More Roles", () => showExperienceCategory(category, index + 1))]
                    : []),
                action("Back", () => showExperienceOverview()),
            ]
        )
    }

    const showExperienceDetail = (category, index) => {
        const roles = categorizeExperience(category)
        const role = roles[index]
        if (!role) {
            showExperienceOverview()
            return
        }
        pushBotMessage(
            `${role.role} at ${role.company}. ${role.description}`,
            [
                action("Go to Experience Page", () => navigate("/experience")),
                action("Back", () => showExperienceCategory(category, index)),
                action("Main Menu", () => showMainMenu()),
            ]
        )
    }

    const showContactOverview = () => {
        pushBotMessage(
            "You can reach me through these channels.",
            [
                action("Email", () => showContactDetail("email")),
                action("LinkedIn", () => showContactDetail("linkedin")),
                action("GitHub", () => showContactDetail("github")),
                action("Open Contact Page", () => navigate("/contact")),
                action("Main Menu", () => showMainMenu()),
            ]
        )
    }

    const showContactDetail = (id) => {
        const channel = contactData.primaryActions.find((item) => item.id === id)
        if (!channel) {
            pushBotMessage(
                "That's better explored directly on the page.",
                [
                    action("Open Contact Page", () => navigate("/contact")),
                    action("Main Menu", () => showMainMenu()),
                ]
            )
            return
        }
        pushBotMessage(
            `${channel.label}: ${channel.value}`,
            [
                action("Open Contact Page", () => navigate("/contact")),
                action("Back", () => showContactOverview()),
                action("Main Menu", () => showMainMenu()),
            ]
        )
    }

    const showNotHomeFallback = () => {
        pushBotMessage(
            "That's better explored directly on the page.",
            [
                action("Go to Relevant Page", () => navigate(location.pathname)),
                action("Main Menu", () => showMainMenu()),
            ]
        )
    }

    useEffect(() => {
        if (!isOpen || messages.length > 0) return
        if (location.pathname === "/") {
            showMainMenu()
            return
        }
        showNotHomeFallback()
    }, [isOpen, location.pathname, messages.length])

    const handleActionClick = (nextAction) => {
        pushUserMessage(nextAction.label)
        nextAction.onSelect()
    }

    // Function to get the appropriate icon based on mood
    const getMoodIcon = () => {
        if (isOpen) {
            return <FiX size={24} />
        }

        // Different icons based on mood when closed
        switch (mood) {
            case 'speaking':
                return (
                    <motion.div
                        key="speaking"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <FiMessageCircle size={24} />
                    </motion.div>
                )
            case 'thinking':
                return (
                    <motion.div
                        key="thinking"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-1"
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-1.5 h-1.5 bg-white rounded-full"
                                animate={{
                                    y: [0, -4, 0],
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
                )
            default:
                return (
                    <motion.div
                        key="idle"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <FiMessageCircle size={24} />
                    </motion.div>
                )
        }
    }

    return (
        <>
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-br from-gray-700 via-gray-500 to-gray-700 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-indigo-500/30 transition-all duration-300
"
            >
                <AnimatePresence mode="wait">
                    {getMoodIcon()}
                </AnimatePresence>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-28 right-8 z-50 w-80 md:w-96 h-[550px] bg-primary-light/95 backdrop-blur-md rounded-2xl shadow-2xl border border-secondary overflow-hidden flex flex-col"
                    >
                        {/* Header - Fixed */}
                        <div className="bg-gradient-to-r from-secondary to-secondary-light p-4 flex-shrink-0">
                            <h3 className="text-lg font-heading font-bold text-accent flex items-center gap-2">
                                <span className="inline-block w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                                Space Guide Bot
                            </h3>
                            <p className="text-accent/80 text-xs mt-1">Here to help you navigate</p>
                        </div>

                        {/* Messages Area - Scrollable with fixed height */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-lg ${message.sender === 'user'
                                            ? 'bg-secondary text-accent'
                                            : 'bg-primary text-accent border border-secondary'
                                            }`}
                                    >
                                        <p className="text-sm">{message.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Actions Area - Fixed at bottom with max height and scroll */}
                        <div className="flex-shrink-0 p-4 border-t border-secondary bg-primary/50 max-h-[200px] overflow-y-auto">
                            <p className="text-secondary-light text-xs mb-3">Choose an action:</p>
                            <div className="grid grid-cols-1 gap-2">
                                {actions.map((item) => (
                                    <motion.button
                                        key={item.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleActionClick(item)}
                                        className="text-xs bg-secondary/50 hover:bg-secondary/70 text-accent px-3 py-2 rounded-lg transition-all duration-200 border border-secondary-light text-left"
                                    >
                                        {item.label}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Bot