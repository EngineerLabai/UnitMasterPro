import { Link, useLocation } from 'react-router-dom';
import { Home, Star, History as HistoryIcon, Settings, Gauge } from 'lucide-react';
import OfflineIndicator from './OfflineIndicator';
import InstallPrompt from './InstallPrompt';
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"

export default function Layout({ children }) {
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'text-blue-600' : 'text-slate-400';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans mb-20">
            <OfflineIndicator />
            <InstallPrompt />
            <Toaster position="top-center" richColors />

            <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10 shadow-sm">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 tracking-tight">
                        <span>UnitMaster Pro</span>
                    </Link>
                    <Link to="/sets">
                        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-blue-600">
                            <Gauge size={24} />
                        </Button>
                    </Link>
                </div>
            </header>
            <main className="flex-1 max-w-md mx-auto w-full p-4 pt-4">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
                <div className="max-w-md mx-auto flex justify-around py-3">
                    <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/')}`}>
                        <Home size={24} />
                        <span className="text-[10px] font-medium">Convert</span>
                    </Link>
                    <Link to="/favorites" className={`flex flex-col items-center gap-1 ${isActive('/favorites')}`}>
                        <Star size={24} />
                        <span className="text-[10px] font-medium">Favorites</span>
                    </Link>
                    <Link to="/history" className={`flex flex-col items-center gap-1 ${isActive('/history')}`}>
                        <HistoryIcon size={24} />
                        <span className="text-[10px] font-medium">History</span>
                    </Link>
                    <Link to="/settings" className={`flex flex-col items-center gap-1 ${isActive('/settings')}`}>
                        <Settings size={24} />
                        <span className="text-[10px] font-medium">Settings</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
