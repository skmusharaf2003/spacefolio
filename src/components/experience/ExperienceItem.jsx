import { motion } from "framer-motion";

export default function ExperienceItem({ data, index, onClick }) {
    const isOngoing = data.status === "ongoing";

    // Stagger children slightly based on index
    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.6,
                ease: "easeOut",
            },
        }),
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={itemVariants}
            custom={index}
            onClick={onClick}
            className="relative grid grid-cols-[auto_1fr] gap-4 sm:gap-5 md:gap-8 group"
        >
            {/* Timeline - vertical line + dot */}
            <div className="relative flex flex-col items-center sm:pt-1.5">
                {/* Glowing dot */}
                <div className="relative z-10">
                    <div
                        className={`w-5 h-5 rounded-full border-4 ${isOngoing
                            ? "border-cyan-400 bg-cyan-500/20 animate-pulse-ring"
                            : "border-green-400 bg-green-500/20"
                            } shadow-lg shadow-black/40 flex items-center justify-center`}
                    >
                        <div
                            className={`w-2.5 h-2.5 rounded-full ${isOngoing ? "bg-cyan-400" : "bg-green-400"
                                }`}
                        />
                    </div>

                    {/* Ongoing pulse ring */}
                    {isOngoing && (
                        <motion.div
                            className="absolute inset-0 rounded-full border-2 border-cyan-400/60"
                            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0.1, 0.4] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                    )}
                </div>

                {/* Gradient line */}
                <div className="absolute top-8 bottom-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-cyan-400/70 via-cyan-400/30 to-transparent" />
            </div>

            {/* Experience Card */}
            <motion.div
                whileHover={{ y: -6, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`
          relative bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/70 
          backdrop-blur-md border border-slate-700/60 rounded-xl p-5 sm:p-6 md:p-7 
          shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-cyan-900/30 
          transition-all duration-300 group-hover:border-cyan-500/40
        `}
            >
                {/* Ongoing badge */}
                {isOngoing && (
                    <div className="absolute -top-3 right-5 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold rounded-full shadow-md border border-cyan-300/30">
                        Present
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                            {data.role}
                        </h3>
                        <p className="text-base text-cyan-300/90 mt-1 font-medium">
                            {data.company}
                            <span className="text-gray-500 mx-2">•</span>
                            <span className="text-gray-400 text-sm">{data.type}</span>
                        </p>
                    </div>

                    <div className="text-left sm:text-right whitespace-nowrap">
                        <span className="text-sm md:text-base font-medium text-cyan-200/80 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/30">
                            {data.duration}
                        </span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed mb-5 text-base">
                    {data.description}
                </p>

                {/* Responsibilities */}
                <ul className="space-y-2.5 mb-6 text-gray-300 text-[15px]">
                    {data.responsibilities.map((item, i) => (
                        <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.08 }}
                            className="flex items-start gap-3"
                        >
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                            {item}
                        </motion.li>
                    ))}
                </ul>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {data.tech.map((tech, i) => (
                        <motion.span
                            key={tech}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + i * 0.05 }}
                            className="px-3 py-1 text-xs font-medium bg-cyan-950/50 border border-cyan-700/40 text-cyan-200 rounded-full hover:bg-cyan-900/60 transition-colors"
                        >
                            {tech}
                        </motion.span>
                    ))}
                </div>

                {/* Outcome / Achievement */}
                {data.outcome && (
                    <div className="text-base text-cyan-100/90 bg-gradient-to-r from-cyan-950/40 to-transparent border-l-4 border-cyan-500 pl-4 py-1 italic">
                        {data.outcome}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
