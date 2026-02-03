import React, { useState } from 'react';
import { useMascot } from "../../context/MascotContext";
const CoreSkillsWave = ({ skills, onSelect }) => {
    const [hoveredId, setHoveredId] = useState(null);

    const {
        setActivePlanet,
        setActivePlanetPos,
        requestSpeech,
        registerInteraction
    } = useMascot();


    // Icon mapping
    const iconMap = {
        html: "HTML",
        css: "CSS",
        javascript: "JS",
        react: "⚛",
        node: "Node",
        java: "Java"
    };

    // Planet size based on confidence
    const getPlanetSize = (confidence) => {
        return confidence === 'high' ? 80 : 65;
    };

    // Generate wave path points
    const generateWavePath = (count, width, height) => {
        const amplitude = 40;
        const frequency = 1.5;
        const points = [];

        for (let i = 0; i <= 100; i++) {
            const x = (i / 100) * width;
            const y = height / 2 + Math.sin((i / 100) * Math.PI * frequency) * amplitude;
            points.push(`${x},${y}`);
        }

        return `M ${points.join(' L ')}`;
    };

    // Calculate planet positions along the wave
    const getPlanetPositions = (count, width, height) => {
        const positions = [];
        const amplitude = 40;
        const frequency = 1.5;

        for (let i = 0; i < count; i++) {
            const progress = (i + 1) / (count + 1);
            const x = progress * width;
            const y = height / 2 + Math.sin(progress * Math.PI * frequency) * amplitude;
            positions.push({ x, y });
        }

        return positions;
    };

    const handleInteraction = (skill) => {
        setHoveredId(skill.id);
        if (onSelect) onSelect(skill);
    };

    const handleSkillSelect = (skill, e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        setActivePlanet("skills");
        registerInteraction("skills");
        setActivePlanetPos({
            x: rect.left + rect.width / 2,
            y: rect.top,
        });

        requestSpeech(
            `${skill.name}. ${skill.summary}`,
            "action"
        );


        requestSpeech(
            skill.botText ||
            `${skill.name} is one of my core skills. ${skill.summary}`, "skills"
        );
    };


    return (
        <div className="w-full py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Desktop/Tablet View */}
                <div className="hidden md:block">
                    <svg
                        viewBox="0 0 1000 200"
                        className="w-full h-auto"
                        style={{ minHeight: '200px' }}
                    >
                        {/* Wave path */}
                        <path
                            d={generateWavePath(skills.length, 1000, 200)}
                            fill="none"
                            stroke="url(#waveGradient)"
                            strokeWidth="2"
                            opacity={hoveredId ? "0.8" : "0.4"}
                            className="transition-opacity duration-300"
                        />

                        {/* Gradient definition */}
                        <defs>
                            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
                            </linearGradient>

                            {/* Glow filters */}
                            <filter id="glowHigh">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            <filter id="glowMedium">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            <radialGradient id="planetGradient">
                                <stop offset="0%" stopColor="#1e293b" />
                                <stop offset="100%" stopColor="#0f172a" />
                            </radialGradient>
                        </defs>

                        {/* Planet nodes */}
                        {getPlanetPositions(skills.length, 1000, 200).map((pos, index) => {
                            const skill = skills[index];
                            const size = getPlanetSize(skill.confidence);
                            const isHovered = hoveredId === skill.id;
                            const scale = isHovered ? 1.1 : 1;

                            return (
                                <g
                                    key={skill.id}
                                    onClick={(e) => handleSkillSelect(skill, e)}
                                    onMouseEnter={() => handleInteraction(skill)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    className="cursor-pointer"
                                    style={{
                                        transition: 'transform 0.2s ease',
                                        transformOrigin: 'center'
                                    }}
                                >
                                    {/* Planet glow */}
                                    <circle
                                        cx={pos.x}
                                        cy={pos.y}
                                        r={size / 2 * scale}
                                        fill={skill.confidence === 'high' ? '#3b82f6' : '#8b5cf6'}
                                        opacity={isHovered ? "0.4" : "0.2"}
                                        filter={skill.confidence === 'high' ? 'url(#glowHigh)' : 'url(#glowMedium)'}
                                        className="transition-all duration-200"
                                    />

                                    {/* Planet body */}
                                    <circle
                                        cx={pos.x}
                                        cy={pos.y}
                                        r={(size / 2 - 4) * scale}
                                        fill="url(#planetGradient)"
                                        stroke={isHovered ? '#fff' : '#94a3b8'}
                                        strokeWidth={isHovered ? '3' : '2'}
                                        className="transition-all duration-200"
                                    />

                                    {/* Icon/Text */}
                                    <text
                                        x={pos.x}
                                        y={pos.y}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill="#fff"
                                        fontSize={skill.icon === 'react' ? (32 * scale) : (16 * scale)}
                                        fontWeight="bold"
                                        className="select-none transition-all duration-200"
                                        style={{ pointerEvents: 'none' }}
                                    >
                                        {iconMap[skill.icon] || skill.name.slice(0, 2).toUpperCase()}
                                    </text>

                                    {/* Skill name below */}
                                    <text
                                        x={pos.x}
                                        y={pos.y + (size / 2) + 20}
                                        textAnchor="middle"
                                        fill="#e2e8f0"
                                        fontSize="14"
                                        fontWeight="500"
                                        className="select-none"
                                        style={{ pointerEvents: 'none' }}
                                    >
                                        {skill.name}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Mobile View - Stacked curved segments */}
                <div className="md:hidden space-y-8">
                    {skills.map((skill, index) => {
                        const size = getPlanetSize(skill.confidence);
                        const isHovered = hoveredId === skill.id;

                        return (
                            <div
                                key={skill.id}
                                className="relative"
                                style={{
                                    marginLeft: index % 2 === 0 ? '10%' : '40%'
                                }}
                            >
                                <svg
                                    viewBox="0 0 200 120"
                                    className="w-32 h-auto mx-auto"
                                >
                                    {/* Mini wave segment */}
                                    <path
                                        d="M 20,60 Q 100,40 180,60"
                                        fill="none"
                                        stroke="#3b82f6"
                                        strokeWidth="2"
                                        opacity="0.3"
                                    />

                                    {/* Planet */}
                                    <g
                                        onClick={() => handleInteraction(skill)}
                                        className="cursor-pointer"
                                    >
                                        <circle
                                            cx="100"
                                            cy="60"
                                            r={size / 2}
                                            fill={skill.confidence === 'high' ? '#3b82f6' : '#8b5cf6'}
                                            opacity="0.3"
                                        />
                                        <circle
                                            cx="100"
                                            cy="60"
                                            r={size / 2 - 4}
                                            fill="#1e293b"
                                            stroke={isHovered ? '#fff' : '#94a3b8'}
                                            strokeWidth="2"
                                        />
                                        <text
                                            x="100"
                                            y="60"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fill="#fff"
                                            fontSize={skill.icon === 'react' ? '24' : '14'}
                                            fontWeight="bold"
                                        >
                                            {iconMap[skill.icon] || skill.name.slice(0, 2)}
                                        </text>
                                    </g>
                                </svg>

                                <p className="text-center text-slate-300 mt-2 font-medium">
                                    {skill.name}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CoreSkillsWave;
