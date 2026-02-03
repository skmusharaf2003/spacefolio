import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiCheck, FiCircle } from 'react-icons/fi';
import { useMascot } from "../../context/MascotContext";

const JourneyPhase = ({
    phase,
    isActive,
    isExpanded,
    onClick,
    onActivate,
    alignment,
}) => {
    const { ref, inView } = useInView({
        threshold: 0.5,
        triggerOnce: false,
    });

    useEffect(() => {
        if (inView) onActivate();
    }, [inView, onActivate]);

    // console.log("->", phase.phase.title, phase.preview.summary, phase.botText)

    const {
        setActivePlanet,
        setActivePlanetPos,
        triggerSpeechIntent,
        registerInteraction
    } = useMascot();

    useEffect(() => {
        if (!isExpanded) return;
        setActivePlanet("journey");
        registerInteraction("journey");
        requestSpeech(
            phase.botText ||
            `This phase represents ${phase.phase.title}. ${phase.preview.summary}`,
            "journey"
        );
    }, [isExpanded]);


    /* ---------------- STATUS LOGIC ---------------- */

    const getStatusIcon = () => {
        if (phase.state === 'completed') {
            return <FiCheck className="text-success" />;
        }
        if (phase.state === 'current') {
            return <FiCircle className="text-accent/50 animate-pulse" />;
        }
        return <FiCircle className="text-accent/50" />;
    };

    const getStatusBorder = () => {
        if (phase.state === 'completed') return 'border-success';
        if (phase.state === 'current') return 'border-primary glow-effect-strong';
        return 'border-accent/40';
    };

    const getBadge = () => {
        if (phase.state === 'completed') {
            return <span className="badge-success text-xs">Completed</span>;
        }
        if (phase.state === 'current') {
            return <span className="badge bg-secondary text-primary text-xs">Current</span>;
        }
        return <span className="badge bg-accent/20 text-accent text-xs">Upcoming</span>;
    };

    const canExpand = Boolean(phase.details);

    /* ---------------- RENDER ---------------- */

    return (
        <motion.div
            ref={ref}
            className={`relative ${alignment === 'left' ? 'text-left' : 'text-right lg:text-right'
                }`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            {/* Status Node */}
            <motion.div
                className={`inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 
          rounded-full border-4 ${getStatusBorder()} bg-space-dark mb-4 md:mb-6 relative z-10`}
                animate={{
                    scale: isActive && phase.state === 'current' ? [1, 1.15, 1] : 1,
                }}
                transition={{
                    duration: 2,
                    repeat: isActive && phase.state === 'current' ? Infinity : 0,
                }}
            >
                <div className="text-xl md:text-2xl">{getStatusIcon()}</div>
            </motion.div>

            {/* Phase Info */}
            <motion.div
                className={`glass-card-hover p-4 md:p-6 ${isActive && phase.state === 'current' ? 'glow-effect-strong' : ''
                    } ${canExpand ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={canExpand ? onClick : undefined}
                layout
            >
                {/* Header */}
                <div className="mb-3 md:mb-4">
                    <div
                        className={`flex items-center gap-2 md:gap-3 mb-2 relative ${alignment === 'right'
                            ? 'justify-end text-right'
                            : 'justify-start text-left'
                            }`}
                    >
                        <span className="text-xs md:text-sm font-medium text-secondary uppercase tracking-wider whitespace-nowrap">
                            Checkpoint {phase.order}
                        </span>

                        <span className="whitespace-nowrap">
                            {getBadge()}
                        </span>
                    </div>


                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-accent mb-2">
                        {phase.phase?.title || phase.title}
                    </h3>

                    <p className="text-sm md:text-base text-accent/80 font-body">
                        {phase.preview?.summary || phase.description}
                    </p>
                </div>

                {/* Expandable Details */}
                {canExpand && (
                    <motion.div
                        initial={false}
                        animate={{
                            height: isExpanded ? 'auto' : 0,
                            opacity: isExpanded ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-3 md:pt-4 border-t border-accent/20">
                            <p className="text-sm md:text-base text-accent/80 mb-4">
                                {phase.details.description}
                            </p>

                            {phase.details.highlights?.length > 0 && (
                                <ul className="space-y-2">
                                    {phase.details.highlights.map((item, index) => (
                                        <motion.li
                                            key={index}
                                            className="flex items-start gap-2 text-sm md:text-base text-accent/80"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.08 }}
                                        >
                                            <FiCheck className="text-primary mt-1 flex-shrink-0" />
                                            <span>{item}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Expand Hint */}
                {canExpand && (
                    <motion.div
                        className="mt-3 md:mt-4 text-center text-xs md:text-sm text-accent/60"
                        animate={{ y: isExpanded ? 0 : [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: isExpanded ? 0 : Infinity }}
                    >
                        {isExpanded ? 'Click to collapse' : 'Click to expand'}
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default JourneyPhase;
