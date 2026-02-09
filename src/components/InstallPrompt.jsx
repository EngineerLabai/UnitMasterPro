import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Check if user dismissed it recently
            const cached = localStorage.getItem('installPromptDismissed');
            if (!cached) {
                setShowPrompt(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setShowPrompt(false);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('installPromptDismissed', 'true');
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 bg-blue-600 text-white p-4 rounded-xl shadow-lg z-40 flex items-center justify-between animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                    <Download size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-sm">Install App</h3>
                    <p className="text-xs text-blue-100">Add to home screen for offline use</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={handleDismiss}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    <X size={20} />
                </button>
                <button
                    onClick={handleInstall}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm active:scale-95 transition-transform"
                >
                    Install
                </button>
            </div>
        </div>
    );
}
