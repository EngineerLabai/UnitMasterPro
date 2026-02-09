import { Link, useLocation } from 'react-router-dom';
import { Home, Star, History as HistoryIcon, Settings, Gauge } from 'lucide-react';
import OfflineIndicator from './OfflineIndicator';
import InstallPrompt from './InstallPrompt';
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { usePremium } from '../contexts/PremiumContext';
import { Badge } from "@/components/ui/badge";

export default function Layout({ children }) {
    const location = useLocation();
    const { isPremium } = usePremium();

    const isActive = (path) => location.pathname === path ? 'text-blue-600' : 'text-slate-400';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans mb-20 transition-all duration-300">
            <OfflineIndicator />
            <InstallPrompt />
            <Toaster position="top-center" richColors />

            <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10 shadow-sm transition-all duration-300">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 tracking-tight">
                        <span>UnitMaster Pro</span>
                        {isPremium && (
                            <Badge variant="default" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-[10px] px-1.5 py-0 h-5 border-none shadow-sm animate-in zoom-in">
                                PRO
                            </Badge>
                        )}
                    </Link>
                    <Link to="/sets">
                        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-blue-600 transition-colors">
                            <Gauge size={24} />
                        </Button>
                    </Link>
                </div>
            </header>
            <main className="flex-1 max-w-md mx-auto w-full p-4 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 safe-area-bottom z-50">
                <div className="max-w-md mx-auto flex justify-around py-3">
                    <Link to="/" className={`flex flex-col items-center gap-1 transition-all ${isActive('/')} active:scale-90`}>
                        <Home size={24} />
                        <span className="text-[10px] font-medium">Convert</span>
                    </Link>
                    <Link to="/favorites" className={`flex flex-col items-center gap-1 transition-all ${isActive('/favorites')} active:scale-90`}>
                        <Star size={24} />
                        <span className="text-[10px] font-medium">Favorites</span>
                    </Link>
                    <Link to="/history" className={`flex flex-col items-center gap-1 transition-all ${isActive('/history')} active:scale-90`}>
                        <HistoryIcon size={24} />
                        <span className="text-[10px] font-medium">History</span>
                    </Link>
                    <Link to="/settings" className={`flex flex-col items-center gap-1 transition-all ${isActive('/settings')} active:scale-90`}>
                        <Settings size={24} />
                        <span className="text-[10px] font-medium">Settings</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
