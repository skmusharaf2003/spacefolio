import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import StarsBackground from "../components/StarBackground"
import SolarSystem from '../components/space/SolarSystem'
import Bot from '../bot/Bot'
import BackButton from "../components/BackButton"

const Home = ({ onPlanetFocus }) => {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])



    return (
        <div className="relative min-h-screen overflow-hidden">
            <StarsBackground scrollY={scrollY} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="relative z-10"
            >
                <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <motion.h1
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-2xl md:text-3xl font-heading font-bold text-accent"
                        >
                            Portfolio
                        </motion.h1>
                    </div>
                </header>

                <main className="pt-20">
                    <BackButton className="px-6 mb-6" />
                    <SolarSystem onPlanetFocus={onPlanetFocus} />
                </main>

                <Bot />
            </motion.div>

        </div>
    )
}

export default Home;
