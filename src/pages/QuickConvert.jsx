import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRightLeft, Copy, Star, Share2 } from 'lucide-react';
import unitsData from '../data/units.json';
import { convert } from '../utils/converter';
import { safeEvaluate } from '../utils/math';
import db from '../db/database';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
            } else {
                // Only set default if state isn't already set (avoid overwrite on re-renders if not needed)
                // But here we want to ensure first load works.
                // Let's rely on dependent useEffect for unit setting if family changes
            }
        };
        loadInit();
    }, []); // Run once on mount

    const currentUnits = unitsData[family] || [];

    // Update units when family changes
    useEffect(() => {
        const currentFromValid = currentUnits.find(u => u.id === fromUnitId);
        const currentToValid = currentUnits.find(u => u.id === toUnitId);

        // If current units not in new family, switch to defaults of new family
        if (!currentFromValid || !currentToValid) {
            if (currentUnits.length >= 2) {
                setFromUnitId(currentUnits[0].id);
                setToUnitId(currentUnits[1].id);
            }
        }
    }, [family, currentUnits]);

    // Sync URL params when state changes (Deep Link ready state)
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
            // Check if it's just partially typed text, usually don't clear, just show ... or error?
            // For now, let's keep result as empty or previous valid? 
            // Better to show '...' if invalid math
            setResult('...');
            return;
        }

        const units = unitsData[family];
        if (!units) return;

        const from = units.find(u => u.id === fromUnitId);
        const to = units.find(u => u.id === toUnitId);

        if (from && to) {
            const res = convert(numericValue, from, to);
            // Handle massive numbers or tiny numbers better
            let displayRes = Number(res).toFixed(rounding).replace(/\.?0+$/, '');
            if (displayRes === 'NaN') displayRes = 'Error';

            setResult(displayRes);

            checkFavorite(from.id, to.id);

            // Only add to history if it's a valid number and user stopped typing
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
        <div className="space-y-6 animate-in fade-in duration-500 pb-24">
            {/* Family Selector */}
            <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                {Object.keys(unitsData).map(f => (
                    <Button
                        key={f}
                        variant={family === f ? "default" : "outline"}
                        onClick={() => setFamily(f)}
                        className="rounded-full flex-shrink-0"
                        size="sm"
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </Button>
                ))}
            </div>

            {/* Conversion Card */}
            <Card className="rounded-3xl shadow-xl border-slate-100 overflow-visible relative">
                <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={shareLink}
                        className="rounded-full text-slate-300 hover:text-blue-600 hover:bg-blue-50"
                    >
                        <Share2 size={20} />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={toggleFavorite}
                        className={`rounded-full hover:bg-yellow-50 ${isFavorite ? 'text-yellow-400' : 'text-slate-300'}`}
                    >
                        <Star size={20} fill={isFavorite ? "currentColor" : "none"} />
                    </Button>
                </div>

                <CardContent className="p-6 space-y-6 pt-12">
                    {/* From Section */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">From</label>
                        <div className="flex gap-4 items-center">
                            <Input
                                type="text"
                                inputMode="decimal"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="text-3xl font-bold h-auto py-2 border-0 shadow-none focus-visible:ring-0 px-0 bg-transparent placeholder:text-slate-200"
                                placeholder="0"
                            />
                            <div className="flex flex-col items-end min-w-[120px]">
                                <Select value={fromUnitId} onValueChange={setFromUnitId}>
                                    <SelectTrigger className="w-[140px] text-right justify-end font-bold bg-slate-50 border-slate-200">
                                        <SelectValue placeholder="Unit" />
                                    </SelectTrigger>
                                    <SelectContent align="end">
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

                    {/* Swap Divider */}
                    <div className="relative h-4 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <Button
                            onClick={handleSwap}
                            size="icon"
                            className="relative z-10 rounded-full h-10 w-10 shadow-sm"
                            variant="outline"
                        >
                            <ArrowRightLeft size={16} className="text-blue-600" />
                        </Button>
                    </div>

                    {/* To Section */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">To</label>
                        <div className="flex gap-4 items-center">
                            <div className="w-full text-3xl font-bold text-blue-600 break-all select-all">
                                {result || '...'}
                            </div>
                            <div className="flex flex-col items-end min-w-[120px]">
                                <Select value={toUnitId} onValueChange={setToUnitId}>
                                    <SelectTrigger className="w-[140px] text-right justify-end font-bold bg-slate-50 border-slate-200">
                                        <SelectValue placeholder="Unit" />
                                    </SelectTrigger>
                                    <SelectContent align="end">
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
            <Button
                onClick={copyResult}
                className="w-full py-6 rounded-xl text-md font-bold shadow-lg shadow-slate-200"
                size="lg"
            >
                <Copy size={20} className="mr-2" />
                COPY RESULT
            </Button>
        </div>
    );
}
