import { Link, useLocation } from 'react-router-dom';
import { Home, Star, History as HistoryIcon, Settings, Gauge, Sparkles } from 'lucide-react';
import OfflineIndicator from './OfflineIndicator';
import InstallPrompt from './InstallPrompt';
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { usePremium } from '../contexts/PremiumContext';
import { Badge } from "@/components/ui/badge";
import { GlobalSearch } from './GlobalSearch';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }) {
    const location = useLocation();
    const { isPremium } = usePremium();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', icon: Home, label: 'Convert' },
        { path: '/favorites', icon: Star, label: 'Favorites' },
        { path: '/history', icon: HistoryIcon, label: 'History' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative overflow-hidden transition-colors duration-500">
            {/* Ambient Background Gradient Blobs */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200 dark:bg-purple-900/30 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-indigo-200 dark:bg-indigo-900/30 rounded-full blur-[100px] animate-pulse delay-1000" />
                <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-blue-100 dark:bg-blue-900/20 rounded-full blur-[100px] animate-pulse delay-2000" />
            </div>

            <OfflineIndicator />
            <InstallPrompt />
            <Toaster position="top-center" richColors />

            {/* Glassmorphic Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-white/20 dark:border-white/10 transition-all duration-300">
                <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter hover:opacity-80 transition-opacity">
                        <div className="p-1.5 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-500/20">
                            <Sparkles size={16} fill="currentColor" />
                        </div>
                        <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-blue-400">
                            UnitMaster
                        </span>
                        {isPremium && (
                            <Badge variant="secondary" className="bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 border-none shadow-sm text-[10px] px-1.5 py-0">
                                PRO
                            </Badge>
                        )}
                    </Link>

                    <div className="flex items-center gap-2">
                        <GlobalSearch />
                        <Link to="/sets">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <Gauge size={22} className="text-slate-600 dark:text-slate-300" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content with Transition */}
            <main className="flex-1 w-full max-w-md mx-auto pt-20 pb-28 px-4 relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="h-full"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Floating Glass Bottom Nav */}
            <nav className="fixed bottom-6 left-4 right-4 z-50">
                <div className="max-w-xs mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full shadow-2xl shadow-indigo-500/10 flex justify-between items-center px-6 py-3">
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="relative flex flex-col items-center justify-center w-12 h-12"
                            >
                                {active && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/20 rounded-2xl -z-10"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <Icon
                                    size={24}
                                    strokeWidth={active ? 2.5 : 2}
                                    className={`transition-colors duration-300 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                                />
                                {active && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -bottom-1 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
