import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContactActions from "../components/contact/ContactActions";
import ContactForm from "../components/contact/ContactForm";
import { contactData } from "../data/contactData";
import BackButton from "../components/BackButton";

const Contact = () => {
    const [showForm, setShowForm] = useState(false);

    return (
        <section className="relative min-h-screen bg-space-dark overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 w-[420px] h-[420px] md:w-[520px] md:h-[520px]
                -translate-x-1/2 -translate-y-1/2
                bg-cyan-500/8 blur-[120px] rounded-full" />
            </div>

            {/* Back button – now free from centering */}
            <BackButton
                className="absolute top-4 left-4 md:top-6 md:left-6 z-30"
                noteText="Use Bot for navigations"   // ← hide note to reduce height/clutter
            />

            {/* Main content – centered */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-4xl space-y-10">
                    {/* Contact Actions */}
                    <div className="space-y-6">
                        <ContactActions contactData={contactData} />
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setShowForm((v) => !v)}
                            className="
                px-6 py-3 rounded-lg
                border border-cyan-400/40
                text-cyan-300 font-medium
                hover:bg-cyan-400/10
                transition-all
              "
                        >
                            {showForm ? "Close message form" : "Send a message"}
                        </motion.button>
                    </div>

                    {/* Form */}
                    <AnimatePresence>
                        {showForm && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.4 }}
                                className="flex justify-center pt-4"
                            >
                                <ContactForm />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default Contact;
