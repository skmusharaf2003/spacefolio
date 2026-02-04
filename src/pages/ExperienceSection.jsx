import { experienceData } from "../data/experienceData";
import ExperienceItem from "../components/experience/ExperienceItem";
import { motion } from "framer-motion";
import { useMascot } from "../context/MascotContext";

export default function ExperienceSection() {

    const {
        setActivePlanet,
        setActivePlanetPos,
        registerInteraction,
        requestSpeech
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
            exp.botText ||
            `I worked as a ${exp.role} at ${exp.company}. ${exp.outcome}`,
            "experience"
        );
    };

    return (
        <section className="relative py-16 md:py-24 max-w-6xl mx-auto px-4">
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
