import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const Planet = ({ planet, index, isDragging, isActive, onClick }) => {
    const navigate = useNavigate()
    const planetRef = useRef(null);

    const touchStartTime = useRef(null)
    const touchTimer = useRef(null)

    const planetVariants = {
        initial: { opacity: 0, scale: 0.5, y: 100 },
        animate: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                delay: index * 0.15,
                duration: 0.8,
                ease: "easeOut"
            }
        }
    }

    const getPlanetGradient = (name) => {
        const gradients = {
            Mercury: 'from-gray-400 via-gray-500 to-gray-600',
            Venus: 'from-yellow-200 via-orange-300 to-yellow-400',
            Earth: 'from-blue-400 via-green-400 to-blue-600',
            Mars: 'from-red-400 via-orange-600 to-red-700',
            Jupiter: 'from-orange-300 via-yellow-200 to-orange-400',
            Saturn: 'from-yellow-300 via-yellow-400 to-yellow-600',
            Uranus: 'from-cyan-300 via-blue-300 to-cyan-400',
            Neptune: 'from-blue-500 via-indigo-500 to-blue-700'
        }
        return gradients[name] || 'from-gray-400 to-gray-600'
    }

    const getPlanetGlow = (name) => {
        const glows = {
            Mercury: '#9ca3af',
            Venus: '#fbbf24',
            Earth: '#3b82f6',
            Mars: '#ef4444',
            Jupiter: '#f59e0b',
            Saturn: '#fbbf24',
            Uranus: '#06b6d4',
            Neptune: '#3b82f6'
        }
        return glows[name] || '#6b7280'
    }

    const handleDoubleClick = () => {
        if (!isDragging && planet.route) {
            navigate(planet.route)
        }
    }

    const handleTouchStart = () => {
        touchStartTime.current = Date.now()
        touchTimer.current = setTimeout(() => {
            if (!isDragging && planet.route) {
                navigate(planet.route)
            }
        }, 800)
    }

    const handleTouchEnd = () => {
        if (touchTimer.current) {
            clearTimeout(touchTimer.current)
        }
        const touchDuration = Date.now() - touchStartTime.current
        if (touchDuration < 800 && !isDragging) {
            handleClick()
        }
    }

    const handleClick = () => {
        if (!isDragging && planetRef.current) {
            const rect = planetRef.current.getBoundingClientRect();

            onClick({
                id: planet.id,
                position: {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                },
                silent: false,
            });

        }
    };


    useEffect(() => {
        if (isActive && planetRef.current) {
            const rect = planetRef.current.getBoundingClientRect();

            onClick({
                id: planet.id,
                position: {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                },
                silent: true,
            });
        }
    }, [isActive]);



    useEffect(() => {
        return () => {
            if (touchTimer.current) {
                clearTimeout(touchTimer.current)
            }
        }
    }, [])

    return (
        <motion.div
            variants={planetVariants}
            initial="initial"
            animate="animate"
            data-planet-id={planet.id}
            className="relative flex-shrink-0 flex flex-col items-center"
        >
            <motion.div
                animate={{
                    scale: isActive ? 1.15 : 1,
                    rotate: isActive ? 5 : 0
                }}

                transition={{ duration: 0.3 }}
                ref={planetRef}
                className="relative cursor-pointer"
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{ width: planet.size, height: planet.size }}
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: planet.rotationSpeed, repeat: Infinity, ease: "linear" }}
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${getPlanetGradient(planet.name)} planet-glow`}
                    style={{ color: getPlanetGlow(planet.name) }}
                >
                    {planet.name === 'Earth' && (
                        <>
                            <div className="absolute top-1/4 right-1/4 w-1/3 h-1/3 bg-green-600/40 rounded-full blur-sm" />
                            <div className="absolute bottom-1/3 left-1/4 w-1/4 h-1/4 bg-green-500/30 rounded-full blur-sm" />
                        </>
                    )}

                    {planet.name === 'Jupiter' && (
                        <>
                            <div className="absolute top-1/3 left-0 right-0 h-1 bg-orange-600/50" />
                            <div className="absolute top-1/2 left-0 right-0 h-2 bg-yellow-600/40" />
                            <div className="absolute top-2/3 left-0 right-0 h-1 bg-orange-700/50" />
                        </>
                    )}

                    {planet.name === 'Mars' && (
                        <>
                            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-800/60 rounded-full" />
                            <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-red-900/50 rounded-full" />
                        </>
                    )}
                </motion.div>

                {planet.name === 'Saturn' && (
                    <>
                        <div className="absolute top-1/4 left-0 right-0 h-1 bg-yellow-600/40" />
                        <div className="absolute top-1/3 left-0 right-0 h-2 bg-orange-500/40" />
                        <div className="absolute top-1/2 left-0 right-0 h-2 bg-yellow-600/35" />
                        <div className="absolute top-2/3 left-0 right-0 h-1 bg-orange-700/40" />
                    </>
                )}


                <motion.div
                    animate={{ scale: isActive ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -inset-4 rounded-full blur-xl opacity-50"
                    style={{ backgroundColor: getPlanetGlow(planet.name) }}
                />
            </motion.div>

            <div className="w-0.5 h-32 bg-gradient-to-b from-accent to-transparent my-6" />

            <motion.div
                animate={{ y: isActive ? -5 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-center"
            >
                <h3 className="text-xl md:text-2xl font-heading font-bold text-accent mb-2">
                    {planet.section}
                </h3>
                <p className="text-secondary-light text-sm mb-3">{planet.name}</p>
            </motion.div>
        </motion.div>
    )
}

export default Planet