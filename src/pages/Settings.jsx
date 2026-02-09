import { useState, useEffect } from 'react';
import db from '../db/database';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { usePremium } from '../contexts/PremiumContext';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import PaywallModal from '../components/PaywallModal';

export default function Settings() {
    const { isPremium, resetPremium } = usePremium();
    const [showPaywall, setShowPaywall] = useState(false);
    const [settings, setSettings] = useState({
        rounding: 2,
        theme: 'light'
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const keys = ['rounding', 'theme'];
        const loaded = {};
        for (const key of keys) {
            const entry = await db.settings.get(key);
            if (entry) loaded[key] = entry.value;
        }
        setSettings(prev => ({ ...prev, ...loaded }));
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

    return (
        <div className="space-y-6 animate-in fade-in pb-20">
            <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

            <h2 className="text-xl font-bold text-slate-900 px-1">Settings</h2>

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
                    {isPremium && (
                        <button
                            onClick={resetPremium}
                            className="text-[10px] mt-4 opacity-50 hover:opacity-100 underline decoration-dotted"
                        >
                            Reset trial (Dev mode)
                        </button>
                    )}
                </CardContent>
            </Card>

            {/* Rounding */}
            <Card className="border-slate-100 shadow-sm">
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
                    <div className="p-3 bg-slate-50 rounded-lg text-center">
                        <p className="text-xs text-slate-500">
                            Example: 1.234567 → <span className="font-bold text-slate-900">{Number(1.234567).toFixed(settings.rounding)}</span>
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Theme */}
            <Card className="border-slate-100 shadow-sm opacity-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-50/50 z-10 flex items-center justify-center">
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm text-slate-500">Coming Soon</span>
                </div>
                <CardHeader>
                    <CardTitle className="text-base">Appearance</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <Switch id="dark-mode" disabled />
                </CardContent>
            </Card>

            {/* About */}
            <div className="text-center py-8 space-y-2">
                <h3 className="font-bold text-slate-900">UnitMaster Pro</h3>
                <p className="text-xs text-slate-500">Version 1.1.0 (PWA)</p>
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
