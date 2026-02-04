import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:opacity-90 transition"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default NotFound;
