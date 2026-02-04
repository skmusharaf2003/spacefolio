import { motion } from "framer-motion";
import BackButton from "../components/BackButton";

const NotFound = () => {
    return (
        <section className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white px-4 py-20">
            <div className="max-w-3xl mx-auto text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-hero-gradient text-4xl md:text-6xl font-bold"
                >
                    404: Lost in Space
                </motion.h1>
                <p className="mt-4 text-slate-300">
                    The page you're looking for drifted beyond our galaxy. Head back
                    to the solar system to continue exploring.
                </p>
                <div className="mt-8">
                    <BackButton noteClassName="text-center" />
                </div>
            </div>
        </section>
    );
};

export default NotFound;
