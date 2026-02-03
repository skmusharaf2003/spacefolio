import React from "react";
import { motion } from "framer-motion";
import {
    Mail,
    Phone,
    Github,
    Linkedin,
    Instagram,
    Twitter,
} from "lucide-react";
import { useMascot } from "../../context/MascotContext";

const iconMap = {
    gmail: Mail,
    phone: Phone,
    github: Github,
    linkedin: Linkedin,
    instagram: Instagram,
    twitter: Twitter,
};

const resolveAction = (action, value) => {
    if (action === "mailto") return `mailto:${value}`;
    if (action === "tel") return `tel:${value}`;
    return value;
};


const ContactActions = ({ contactData }) => {

    const {
        setActivePlanet,
        setActivePlanetPos,
        registerInteraction
    } = useMascot();

    const handleContactHover = (item, e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        setActivePlanet("contact");
        registerInteraction("contact");
        setActivePlanetPos({
            x: rect.left + rect.width / 2,
            y: rect.top,
        });

    };

    return (
        <div className="max-w-4xl mx-auto px-4 text-center space-y-12 md:space-y-16">
            {/* Header */}
            <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                    {contactData.headline}
                </h2>
                <p className="text-lg text-cyan-300/80 font-light">
                    {contactData.subline}
                </p>
            </div>

            {/* Primary Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 md:gap-6">
                {contactData.primaryActions.map((item) => {
                    const Icon = iconMap[item.icon];

                    return (
                        <motion.a
                            key={item.id}
                            href={resolveAction(item.action, item.value)}
                            target={item.action === "external" ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.06, y: -5 }}
                            onMouseEnter={(e) => handleContactHover(item, e)}
                            whileTap={{ scale: 0.96 }}
                            className={`
                group relative
                bg-black/50 backdrop-blur-xl 
                border border-cyan-500/30 rounded-xl 
                p-5 md:p-6 transition-all duration-300
                hover:border-cyan-400/70 hover:bg-black/70
                hover:shadow-[0_0_30px_rgba(0,240,255,0.18)]
              `}
                        >
                            {/* Subtle gradient shine on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

                            <div className="relative flex flex-col items-center gap-3">
                                <div className="p-3.5 rounded-full bg-cyan-950/40 border border-cyan-600/40 group-hover:border-cyan-400/60 transition-colors">
                                    <Icon className="w-7 h-7 md:w-8 md:h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                                </div>
                                <span className="text-sm md:text-base font-medium text-white group-hover:text-cyan-200 transition-colors">
                                    {item.label}
                                </span>
                            </div>
                        </motion.a>
                    );
                })}
            </div>

            {/* Secondary Actions */}
            {contactData.secondaryActions?.length > 0 && (
                <div className="flex justify-center gap-6 md:gap-8 pt-6 md:pt-8">
                    {contactData.secondaryActions.map((item) => {
                        const Icon = iconMap[item.icon];

                        return (
                            <motion.a
                                key={item.id}
                                href={item.value}
                                target="_blank"
                                rel="noopener noreferrer"
                                onMouseEnter={(e) => handleContactHover(item, e)}
                                whileHover={{ scale: 1.3 }}
                                whileTap={{ scale: 0.9 }}
                                className={`
                  flex items-center justify-center w-12 h-12 md:w-14 md:h-14 
                  rounded-full bg-black/50 border border-purple-500/40 
                  hover:border-purple-400 hover:bg-purple-950/50 
                  hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]
                  transition-all duration-300 backdrop-blur-md
                `}
                            >
                                <Icon className="w-6 h-6 md:w-7 md:h-7 text-purple-300 hover:text-purple-200 transition-colors" />
                            </motion.a>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ContactActions;
