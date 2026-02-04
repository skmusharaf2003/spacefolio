import { motion } from "framer-motion";
import { profileData } from "../data/mockData";

const Resume = () => {
    return (
        <section className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white px-4 py-16">
            <div className="max-w-5xl mx-auto text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-hero-gradient text-4xl md:text-6xl font-bold"
                >
                    Resume
                </motion.h1>
                <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
                    View or download my resume using the button below. If you update
                    <span className="text-accent"> profileData.resumeUrl</span>, this page
                    will always point to the latest version.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href={profileData.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:opacity-90 transition"
                    >
                        Open Resume
                    </a>
                    <a
                        href={profileData.resumeUrl}
                        className="px-6 py-3 rounded-full border border-cyan-400/60 text-cyan-100 hover:bg-cyan-500/10 transition"
                    >
                        Download Resume
                    </a>
                </div>

                <div className="mt-10 rounded-2xl border border-slate-700/60 bg-slate-900/50 p-4 backdrop-blur-sm">
                    <p className="text-sm text-slate-400">
                        Tip: If your resume is hosted on Google Drive or another external
                        provider, make sure the link is publicly accessible.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Resume;
