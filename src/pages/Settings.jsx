import { useState, useEffect } from 'react';
import db from '../db/database';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { usePremium } from '../contexts/PremiumContext';
import { useTheme } from '../contexts/ThemeContext';
import { Sparkles, CheckCircle2, Trash2, Share2, Mail, RefreshCcw, Database } from 'lucide-react';
import PaywallModal from '../components/PaywallModal';
import { toast } from "sonner";

export default function Settings() {
    const { isPremium, resetPremium } = usePremium();
    const { theme, setTheme } = useTheme();
    const [showPaywall, setShowPaywall] = useState(false);
    const [settings, setSettings] = useState({
        rounding: 2,
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const entry = await db.settings.get('rounding');
        if (entry) setSettings(prev => ({ ...prev, rounding: entry.value }));
    };

    const handleRoundingChange = async (val) => {
        const newVal = val[0];
        setSettings(prev => ({ ...prev, rounding: newVal }));
        await db.settings.put({ key: 'rounding', value: newVal });
        showSaved();
    }

    const showSaved = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const clearData = async (type) => {
        if (!confirm(`Are you sure you want to clear ${type}?`)) return;

        try {
            if (type === 'history') await db.history.clear();
            if (type === 'favorites') await db.favorites.clear();
            toast.success(`${type} cleared successfully`);
        } catch (e) {
            toast.error("Failed to clear data");
        }
    };

    const factoryReset = async () => {
        if (!confirm("Start FRESH? This will delete ALL data including local premium status.")) return;
        await db.delete();
        toast.info("App resetting...");
        setTimeout(() => window.location.reload(), 1000);
    };

    const shareApp = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'UnitMaster Pro',
                    text: 'Check out this awesome unit converter!',
                    url: window.location.origin
                });
            } catch (e) { }
        } else {
            navigator.clipboard.writeText(window.location.origin);
            toast.success("Link copied to clipboard");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in pb-20">
            <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

            <h2 className="text-xl font-bold text-slate-900 px-1 dark:text-gray-100">Settings</h2>

            {/* Premium Status */}
            <Card className={`border-none shadow-md overflow-hidden bg-gradient-to-br ${isPremium ? 'from-blue-600 to-indigo-700 text-white' : 'from-slate-800 to-slate-900 text-white'}`}>
                <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                {isPremium ? <CheckCircle2 size={20} className="text-blue-200" /> : <Sparkles size={20} className="text-amber-400" />}
                                {isPremium ? 'UnitMaster Pro' : 'Free Version'}
                            </h3>
                            <p className="text-xs opacity-80">
                                {isPremium ? 'Lifetime access active' : 'Support dev & unlock all features'}
                            </p>
                        </div>
                        {!isPremium && (
                            <Button
                                size="sm"
                                variant="secondary"
                                className="font-bold text-slate-900"
                                onClick={() => setShowPaywall(true)}
                            >
                                Upgrade
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Rounding */}
            <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Decimal Precision</CardTitle>
                    <CardDescription>Adjust how many decimal places to show.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-600 text-2xl">{settings.rounding}</span>
                        <span className="text-slate-400 text-sm">decimals</span>
                    </div>
                    <Slider
                        value={[settings.rounding]}
                        max={6}
                        step={1}
                        onValueChange={handleRoundingChange}
                        className="py-2"
                    />
                </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Appearance</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <Switch
                        id="dark-mode"
                        checked={theme === 'dark'}
                        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                </CardContent>
            </Card>

            {/* Data Management */}
            <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Data Management</CardTitle>
                    <CardDescription>Manage your local data.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start text-slate-600 dark:text-slate-300" onClick={() => clearData('history')}>
                        <RefreshCcw size={16} className="mr-2" /> Clear History
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-slate-600 dark:text-slate-300" onClick={() => clearData('favorites')}>
                        <Trash2 size={16} className="mr-2" /> Clear Favorites
                    </Button>
                    <Button variant="destructive" className="w-full justify-start bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-100 dark:bg-red-900/20 dark:border-red-900/30 shadow-none" onClick={factoryReset}>
                        <Database size={16} className="mr-2" /> Factory Reset App
                    </Button>
                    {isPremium && (
                        <Button variant="ghost" className="w-full justify-start text-slate-400 h-8 text-xs" onClick={resetPremium}>
                            Reset Premium (Dev)
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Support */}
            <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start text-slate-600 dark:text-slate-300" onClick={shareApp}>
                        <Share2 size={16} className="mr-2" /> Share App
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-slate-600 dark:text-slate-300" onClick={() => window.location.href = 'mailto:support@engineerlab.ai'}>
                        <Mail size={16} className="mr-2" /> Contact Support
                    </Button>
                </CardContent>
            </Card>

            {/* About */}
            <div className="text-center py-8 space-y-2">
                <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl">
                        UM
                    </div>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-gray-100">UnitMaster Pro</h3>
                <p className="text-xs text-slate-500">Version 1.2.0 (PWA)</p>
                <p className="text-xs text-slate-400">&copy; 2026 EngineerLab AI</p>
            </div>

            {saved && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2 z-50">
                    Settings saved
                </div>
            )}
        </div>
    );
}
