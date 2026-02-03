import { experienceData } from "../data/experienceData";
import ExperienceItem from "../components/experience/ExperienceItem";
import { motion } from "framer-motion";
import { useMascot } from "../context/MascotContext";

export default function ExperienceSection() {

    const {
        setActivePlanet,
        setActivePlanetPos,
        requestSpeech,
        registerInteraction
    } = useMascot();

    const handleExperienceSelect = (exp, e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        setActivePlanet("experience");
        registerInteraction("experience");
        setActivePlanetPos({
            x: rect.left + rect.width / 2,
            y: rect.top,
        });

        requestSpeech(
            "This role helped me build real-world experience.",
            "action"
        );


        requestSpeech(
            exp.botText ||
            `I worked as a ${exp.role} at ${exp.company}. ${exp.outcome}`, "experience"
        );
    };

    return (
        <section className="relative py-24 max-w-6xl mx-auto px-4">
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
                    style={{
                        fontSize: 'clamp(40px, 8vw, 96px)',
                        fontWeight: 900,
                        margin: 0,
                        background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #ec4899 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.03em',
                        lineHeight: 1,
                    }}
                >
                    MY EXPERIENCE
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
                    Real-world roles, responsibilities, and outcomes that shaped my growth.
                </motion.p>
            </div>

            {/* Timeline */}
            <div className="relative space-y-20">
                {experienceData.map((exp, index) => (
                    <ExperienceItem key={exp.id} data={exp} index={index} onClick={(e) => handleExperienceSelect(exp, e)} />
                ))}
            </div>
        </section>
    );
}
