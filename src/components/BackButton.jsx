// BackButton.jsx
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = ({
    className = "",
    buttonClassName = "",
    noteClassName = "",
    noteText = "Use Bot for navigation.",
    isJourney = false,   // ← new prop
}) => {
    const navigate = useNavigate();

    return (
        <div className={`flex flex-col items-start ${className}`}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className={`
          flex items-center gap-2 px-4 py-2 
          rounded-full text-sm transition
          ${isJourney
                        ? "bg-transparent border border-white text-white hover:bg-white/10"
                        : "bg-space-blue/60 border border-cyan-400/40 text-cyan-300 hover:bg-space-blue/80"}
          ${buttonClassName}
        `}
            >
                <ArrowLeft size={16} />
                Home
            </motion.button>

            {noteText && (
                <span
                    className={`
            text-xs mt-1.5
            ${isJourney ? "text-white" : "text-cyan-300/70"}
            ${noteClassName}
          `}
                >
                    {noteText}
                </span>
            )}
        </div>
    );
};

export default BackButton;