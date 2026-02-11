import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRightLeft, Copy, Star, Share2, Info } from 'lucide-react';
import unitsData from '../data/units.json';
import { familyInfo } from '../data/categoryInfo';
import { convert } from '../utils/converter';
import { safeEvaluate } from '../utils/math';
import db from '../db/database';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion";
import NanoBananaVisual from '../components/NanoBananaVisual';

export default function QuickConvert() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [amount, setAmount] = useState('1');
    const [family, setFamily] = useState('pressure');
    const [fromUnitId, setFromUnitId] = useState('');
    const [toUnitId, setToUnitId] = useState('');
    const [result, setResult] = useState('');
    const [rounding, setRounding] = useState(2);
    const [isFavorite, setIsFavorite] = useState(false);

    const historyTimeoutRef = useRef(null);

    // Load settings and params
    useEffect(() => {
        const loadInit = async () => {
            const setting = await db.settings.get('rounding');
            if (setting) setRounding(setting.value);

            const v = searchParams.get('v');
            const f = searchParams.get('from');
            const t = searchParams.get('to');
            const familyParam = searchParams.get('family');

            if (f && t) {
                for (const fam in unitsData) {
                    const found = unitsData[fam].find(u => u.id === f);
                    if (found) {
                        setFamily(fam);
                        setFromUnitId(f);
                        setToUnitId(t);
                        break;
                    }
                }
                if (v) setAmount(v);
            } else if (familyParam && unitsData[familyParam]) {
                setFamily(familyParam);
            }
        };
        loadInit();
    }, []);

    const currentUnits = unitsData[family] || [];
    const currentInfo = familyInfo[family] || {};

    // Update units when family changes
    useEffect(() => {
        const currentFromValid = currentUnits.find(u => u.id === fromUnitId);
        const currentToValid = currentUnits.find(u => u.id === toUnitId);

        if (!currentFromValid || !currentToValid) {
            if (currentUnits.length >= 2) {
                setFromUnitId(currentUnits[0].id);
                setToUnitId(currentUnits[1].id);
            }
        }
    }, [family, currentUnits]);

    // Sync URL params
    useEffect(() => {
        if (fromUnitId && toUnitId) {
            const newParams = { from: fromUnitId, to: toUnitId };
            if (amount !== '1') newParams.v = amount;
            setSearchParams(newParams, { replace: true });
        }
    }, [amount, fromUnitId, toUnitId, setSearchParams]);

    // Calculate & History
    useEffect(() => {
        if (!amount) {
            setResult('');
            return;
        }

        const numericValue = safeEvaluate(amount);

        if (isNaN(numericValue)) {
            setResult('...');
            return;
        }

        const units = unitsData[family];
        if (!units) return;

        const from = units.find(u => u.id === fromUnitId);
        const to = units.find(u => u.id === toUnitId);

        if (from && to) {
            const res = convert(numericValue, from, to);
            let displayRes = Number(res).toFixed(rounding).replace(/\.?0+$/, '');
            if (displayRes === 'NaN') displayRes = 'Error';

            setResult(displayRes);
            checkFavorite(from.id, to.id);

            if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
            historyTimeoutRef.current = setTimeout(async () => {
                await db.history.add({
                    value: numericValue,
                    fromUnitId: from.id,
                    toUnitId: to.id,
                    result: displayRes,
                    timestamp: Date.now()
                });
            }, 2000);
        }

        return () => {
            if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
        };
    }, [amount, fromUnitId, toUnitId, family, rounding]);

    const checkFavorite = async (fId, tId) => {
        const exists = await db.favorites.where({ fromUnitId: fId, toUnitId: tId }).first();
        setIsFavorite(!!exists);
    };

    const toggleFavorite = async () => {
        if (isFavorite) {
            await db.favorites.where({ fromUnitId, toUnitId }).delete();
            setIsFavorite(false);
            toast.success("Removed from favorites");
        } else {
            await db.favorites.add({
                fromUnitId,
                toUnitId,
                timestamp: Date.now()
            });
            setIsFavorite(true);
            toast.success("Added to favorites");
        }
    };

    const handleSwap = () => {
        const temp = fromUnitId;
        setFromUnitId(toUnitId);
        setToUnitId(temp);
    };

    const copyResult = () => {
        if (result) {
            navigator.clipboard.writeText(result);
            toast.success("Result copied to clipboard");
        }
    };

    const shareLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
    }

    return (
        <div className="space-y-6 pb-24">
            {/* Family Selector */}
            <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar px-1 pt-2 mask-linear">
                {Object.keys(unitsData).map(f => (
                    <div key={f} className="relative">
                        {family === f && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/30 -z-10"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <button
                            onClick={() => setFamily(f)}
                            className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors z-0 flex items-center gap-2 whitespace-nowrap ${family === f ? 'text-white' : 'text-slate-500 hover:text-indigo-600 bg-white dark:bg-slate-800'}`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    </div>
                ))}
            </div>

            {/* Info Banner */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={family}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                >
                    <Card className={`border-0 bg-gradient-to-br ${currentInfo.color || 'from-slate-50 to-slate-100'} dark:from-slate-800 dark:to-slate-900 mb-6 overflow-hidden shadow-lg`}>
                        <CardContent className="p-0 flex flex-col sm:flex-row items-center sm:items-stretch">
                            {/* Visual Side */}
                            <div className="w-full sm:w-1/3 bg-white/30 dark:bg-black/20 p-6 flex items-center justify-center">
                                <NanoBananaVisual family={family} />
                            </div>

                            {/* Content Side */}
                            <div className="flex-1 p-6 space-y-3">
                                <div>
                                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                                        {currentInfo.title || family.charAt(0).toUpperCase() + family.slice(1)}
                                    </h3>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">
                                        {currentInfo.description}
                                    </p>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {currentInfo.detailed_desc}
                                </p>
                                {currentInfo.fun_fact && (
                                    <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3 text-xs border border-white/20 dark:border-slate-700/50 flex gap-2 items-start">
                                        <Info size={14} className="mt-0.5 shrink-0 text-indigo-500" />
                                        <span className="text-indigo-900 dark:text-indigo-200 font-medium">
                                            <span className="font-bold opacity-70 block mb-1 uppercase tracking-wider text-[10px]">Did you know?</span>
                                            {currentInfo.fun_fact}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </AnimatePresence>

            {/* Conversion Card */}
            <Card className="rounded-[2rem] border-0 shadow-2xl shadow-indigo-200/50 dark:shadow-none bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl relative overflow-visible">
                <div className="absolute top-4 right-4 flex gap-1 z-20">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={shareLink}
                        className="rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700"
                    >
                        <Share2 size={18} />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={toggleFavorite}
                        className={`rounded-full hover:bg-amber-50 dark:hover:bg-slate-700 ${isFavorite ? 'text-amber-400' : 'text-slate-400'}`}
                    >
                        <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
                    </Button>
                </div>

                <CardContent className="p-8 space-y-8">
                    {/* From Section */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">From</label>
                        <div className="flex gap-4 items-center">
                            <Input
                                type="text"
                                inputMode="decimal"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="text-4xl font-black h-auto py-2 border-0 shadow-none focus-visible:ring-0 px-0 bg-transparent placeholder:text-slate-200 text-slate-800 dark:text-slate-100 tracking-tight"
                                placeholder="0"
                            />
                            <div className="flex flex-col items-end min-w-[130px]">
                                <Select value={fromUnitId} onValueChange={setFromUnitId}>
                                    <SelectTrigger className="w-full text-right justify-end font-bold bg-slate-50 dark:bg-slate-700 border-0 rounded-xl h-10 px-3 hover:bg-slate-100 focus:ring-0">
                                        <SelectValue placeholder="Unit" />
                                    </SelectTrigger>
                                    <SelectContent align="end" className="max-h-[300px]">
                                        {currentUnits.map(u => (
                                            <SelectItem key={u.id} value={u.id}>
                                                <span className="font-medium">{u.symbol}</span>
                                                <span className="ml-2 text-xs text-slate-400">{u.name}</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Funky Divider */}
                    <div className="relative h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-600 to-transparent flex items-center justify-center my-2">
                        <Button
                            onClick={handleSwap}
                            size="icon"
                            className="absolute bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-full h-12 w-12 shadow-md hover:scale-110 hover:shadow-lg hover:border-indigo-100 transition-all text-indigo-500"
                        >
                            <ArrowRightLeft size={20} />
                        </Button>
                    </div>

                    {/* To Section */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">To</label>
                        <div className="flex gap-4 items-center">
                            <div className="w-full text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 break-all select-all tracking-tight">
                                {result || '...'}
                            </div>
                            <div className="flex flex-col items-end min-w-[130px]">
                                <Select value={toUnitId} onValueChange={setToUnitId}>
                                    <SelectTrigger className="w-full text-right justify-end font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-0 rounded-xl h-10 px-3 hover:bg-indigo-100 focus:ring-0">
                                        <SelectValue placeholder="Unit" />
                                    </SelectTrigger>
                                    <SelectContent align="end" className="max-h-[300px]">
                                        {currentUnits.map(u => (
                                            <SelectItem key={u.id} value={u.id}>
                                                <span className="font-medium">{u.symbol}</span>
                                                <span className="ml-2 text-xs text-slate-400">{u.name}</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Copy Button */}
            <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                    onClick={copyResult}
                    className="w-full py-7 rounded-2xl text-lg font-bold shadow-xl shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white border-0"
                    size="lg"
                >
                    <Copy size={20} className="mr-2" />
                    Copy Result
                </Button>
            </motion.div>
        </div>
    );
}
