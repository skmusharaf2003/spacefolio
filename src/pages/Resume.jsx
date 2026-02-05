import { motion } from "framer-motion";
import { profileData } from "../data/mockData";
import { Download, ExternalLink } from "lucide-react";
import BackButton from "../components/BackButton";

const Resume = () => {
    return (
        <section className="relative min-h-screen overflow-hidden bg-space-dark text-white px-4 py-20">
            {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-white rounded-full opacity-40"
                    style={{
                        width: `${0.8 + Math.random() * 1.8}px`,
                        height: `${0.8 + Math.random() * 1.8}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                    }}
                    animate={{ opacity: [0.3, 0.9, 0.3] }}
                    transition={{
                        duration: 4 + Math.random() * 4,
                        repeat: Infinity,
                        delay: Math.random() * 6,
                    }}
                />
            ))}
            {/* Cosmic Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] 
                -translate-x-1/2 -translate-y-1/2 
                bg-cyan-500/10 blur-[140px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto">

                {/* Back Button - Now in document flow on mobile, absolute on desktop */}
                <BackButton className="mb-6 md:mb-0 md:absolute md:left-0 md:top-0" />

                {/* Content wrapper - centered text */}
                <div className="text-center">
                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-6xl font-bold mb-4 cosmic-text-gradient"
                    >
                        Mission Resume
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-accent/80 max-w-2xl mx-auto mb-10"
                    >
                        Access my professional profile and experience archive.
                        Download or view the latest version anytime.
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-5 justify-center"
                    >

                        {/* Open */}
                        <a
                            href={profileData.resumeViewUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center justify-center gap-2
                            px-7 py-3 rounded-full
                            bg-gradient-to-r from-cyan-500 to-blue-600
                            font-semibold shadow-lg shadow-cyan-500/30
                            hover:opacity-90 transition"
                        >
                            <ExternalLink size={18} />
                            Open Resume
                        </a>

                        {/* Download */}
                        <a
                            href={profileData.resumeUrl}
                            download
                            className="group flex items-center justify-center gap-2
                            px-7 py-3 rounded-full
                            border border-cyan-400/50
                            text-cyan-200
                            hover:bg-cyan-500/10 transition"
                        >
                            <Download size={18} />
                            Download
                        </a>
                    </motion.div>

                    {/* Info Panel */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-14 mx-auto max-w-2xl
                        rounded-xl border border-cyan-400/20
                        bg-space-blue/40 backdrop-blur-md
                        p-5"
                    >
                        <p className="text-sm text-accent/70 leading-relaxed">
                            ✨ Thank you for taking the time to view my resume.
                            I truly appreciate your interest in my work and journey.
                            If you'd like to know more, feel free to explore my projects
                            or reach out through the contact section.
                        </p>

                    </motion.div>
                </div>

            </div>
        </section>
    );
};

export default Resume;
