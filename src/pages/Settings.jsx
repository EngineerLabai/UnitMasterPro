import { useState, useEffect } from 'react';
import db from '../db/database';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function Settings() {
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
            <h2 className="text-xl font-bold text-slate-900 px-1">Settings</h2>

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
                        defaultValue={[settings.rounding]}
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

            {/* Theme (Placeholder) */}
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
                <p className="text-xs text-slate-500">Version 1.0.0 (PWA)</p>
                <p className="text-xs text-slate-400">Offline-first engineering converter.</p>
            </div>

            {saved && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2 z-50">
                    Settings saved
                </div>
            )}
        </div>
    );
}
