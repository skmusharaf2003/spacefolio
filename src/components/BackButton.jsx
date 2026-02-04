import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = ({
    className = "",
    buttonClassName = "",
    noteClassName = "",
    noteText = "Use back button for navigation.",
}) => {
    const navigate = useNavigate();

    return (
        <div className={`flex flex-col items-start gap-1 ${className}`}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className={`flex items-center gap-2 px-4 py-2 bg-space-blue/60 border border-cyan-400/40 rounded-full text-cyan-300 text-sm hover:bg-space-blue/80 transition ${buttonClassName}`}
            >
                <ArrowLeft size={16} />
                Home
            </motion.button>
            <span className={`text-xs text-cyan-300/70 ${noteClassName}`}>
                {noteText}
            </span>
        </div>
    );
};

export default BackButton;
