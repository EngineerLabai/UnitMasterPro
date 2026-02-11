import React from 'react';
import { motion } from 'framer-motion';

const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

const NanoBananaVisual = ({ family }) => {
    const getVisual = () => {
        switch (family) {
            case 'length':
                return (
                    <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-lg">
                        <defs>
                            <linearGradient id="lengthGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#60A5FA" />
                                <stop offset="100%" stopColor="#3B82F6" />
                            </linearGradient>
                        </defs>
                        <rect x="20" y="50" width="160" height="20" rx="10" fill="url(#lengthGrad)" />
                        <circle cx="20" cy="60" r="8" fill="#fff" />
                        <circle cx="180" cy="60" r="8" fill="#fff" />
                        <path d="M40 50 V70 M60 50 V65 M80 50 V70 M100 50 V65 M120 50 V70 M140 50 V65 M160 50 V70" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                );
            case 'mass':
                return (
                    <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-lg">
                        <defs>
                            <linearGradient id="massGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#34D399" />
                                <stop offset="100%" stopColor="#10B981" />
                            </linearGradient>
                        </defs>
                        <circle cx="100" cy="60" r="40" fill="url(#massGrad)" />
                        <path d="M60 100 L140 100 L120 120 L80 120 Z" fill="#065F46" opacity="0.2" />
                        <path d="M85 45 Q100 30 115 45" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
                    </svg>
                );
            case 'pressure':
                return (
                    <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-lg">
                        <defs>
                            <linearGradient id="pressGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#F59E0B" />
                                <stop offset="100%" stopColor="#FBBF24" />
                            </linearGradient>
                        </defs>
                        <path d="M40 90 A 60 60 0 1 1 160 90" fill="none" stroke="#E5E7EB" strokeWidth="12" strokeLinecap="round" />
                        <path d="M40 90 A 60 60 0 0 1 100 30" fill="none" stroke="url(#pressGrad)" strokeWidth="12" strokeLinecap="round" />
                        <circle cx="100" cy="90" r="8" fill="#D97706" />
                        <line x1="100" y1="90" x2="70" y2="50" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                );
            case 'temperature':
                return (
                    <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-lg">
                        <rect x="90" y="20" width="20" height="80" rx="10" fill="#E5E7EB" />
                        <circle cx="100" cy="90" r="18" fill="#EF4444" />
                        <rect x="94" y="40" width="12" height="50" rx="6" fill="#EF4444" />
                        <path d="M120 40 L130 40 M120 55 L130 55 M120 70 L130 70" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                        <defs>
                            <linearGradient id="tempGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#F87171" />
                                <stop offset="100%" stopColor="#EF4444" />
                            </linearGradient>
                        </defs>
                    </svg>
                );
            case 'area':
                return (
                    <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-lg">
                        <defs>
                            <linearGradient id="areaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#818CF8" />
                                <stop offset="100%" stopColor="#6366F1" />
                            </linearGradient>
                        </defs>
                        <rect x="60" y="30" width="60" height="60" rx="8" fill="url(#areaGrad)" opacity="0.8" />
                        <rect x="80" y="50" width="60" height="60" rx="8" fill="url(#areaGrad)" />
                        <rect x="85" y="55" width="20" height="20" fill="#fff" opacity="0.3" rx="4" />
                    </svg>
                );
            case 'volume':
                return (
                    <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-lg">
                        <defs>
                            <linearGradient id="volGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#2DD4BF" />
                                <stop offset="100%" stopColor="#0D9488" />
                            </linearGradient>
                        </defs>
                        <path d="M70 40 L130 40 L130 90 Q 100 100 70 90 Z" fill="url(#volGrad)" />
                        <ellipse cx="100" cy="40" rx="30" ry="10" fill="#5EEAD4" />
                        <ellipse cx="100" cy="85" rx="30" ry="10" fill="none" stroke="#fff" strokeWidth="2" opacity="0.5" />
                        <path d="M110 35 Q115 20 125 15" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
                    </svg>
                );
            case 'speed':
                return (
                    <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-lg">
                        <defs>
                            <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#38BDF8" />
                                <stop offset="100%" stopColor="#0EA5E9" />
                            </linearGradient>
                        </defs>
                        <path d="M40 60 L140 60 L130 50 M140 60 L130 70" stroke="url(#speedGrad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20 40 L60 40" stroke="#BAE6FD" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                        <path d="M30 80 L90 80" stroke="#BAE6FD" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                    </svg>
                );
            case 'time':
                return (
                    <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-lg">
                        <circle cx="100" cy="60" r="35" fill="#DDD6FE" />
                        <circle cx="100" cy="60" r="30" fill="#fff" />
                        <path d="M100 60 L100 40 M100 60 L115 60" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="100" cy="60" r="3" fill="#7C3AED" />
                        <path d="M90 20 L110 20" stroke="#7C3AED" strokeWidth="4" strokeLinecap="round" />
                        <path d="M100 20 L100 28" stroke="#7C3AED" strokeWidth="2" />
                    </svg>
                );
            case 'digital':
                return (
                    <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-lg">
                        <rect x="60" y="40" width="80" height="50" rx="4" fill="#E2E8F0" />
                        <rect x="70" y="55" width="10" height="20" fill="#64748B" />
                        <rect x="85" y="55" width="10" height="20" fill="#64748B" />
                        <rect x="100" y="55" width="10" height="20" fill="#64748B" />
                        <rect x="115" y="55" width="10" height="20" fill="#64748B" />
                        <path d="M60 75 L140 75 L135 85 L65 85 Z" fill="#94A3B8" opacity="0.5" />
                    </svg>
                );
            case 'energy':
                return (
                    <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-lg">
                        <path d="M110 20 L80 60 H105 L90 100 L120 60 H95 L110 20 Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" strokeLinejoin="round" />
                        <circle cx="100" cy="60" r="45" stroke="#FBBF24" strokeWidth="2" opacity="0.3" fill="none" strokeDasharray="4 4" />
                    </svg>
                );
            case 'power':
                return (
                    <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-lg">
                        <rect x="70" y="40" width="60" height="40" rx="4" fill="#84CC16" />
                        <rect x="130" y="50" width="10" height="20" rx="2" fill="#4D7C0F" />
                        <path d="M90 40 V80 M110 40 V80" stroke="#A3E635" strokeWidth="2" opacity="0.5" />
                        <path d="M85 55 L95 65 L115 50" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            case 'force':
                return (
                    <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-lg">
                        <rect x="100" y="40" width="40" height="40" rx="4" fill="#F87171" />
                        <path d="M50 60 L90 60 M80 50 L90 60 L80 70" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            case 'torque':
                return (
                    <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-lg">
                        <circle cx="100" cy="60" r="10" fill="#9CA3AF" />
                        <path d="M100 30 A 30 30 0 1 1 70 60" fill="none" stroke="#EC4899" strokeWidth="4" strokeLinecap="round" />
                        <path d="M60 50 L70 60 L80 50" stroke="#EC4899" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            className="w-full h-32 flex items-center justify-center p-2"
        >
            {getVisual()}
        </motion.div>
    );
};

export default NanoBananaVisual;
