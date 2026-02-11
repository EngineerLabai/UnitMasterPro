import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRightLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { safeEvaluate } from '../utils/math';

// Default static rates (USD base) to ensure it works offline immediately
const FALLBACK_RATES = {
    USD: 1, EUR: 0.92, GBP: 0.79, TRY: 30.5, JPY: 148.2, CAD: 1.35, AUD: 1.52,
    CNY: 7.19, INR: 82.9, RUB: 91.2, BRL: 4.96, CHF: 0.88
};

const CURRENCIES = Object.keys(FALLBACK_RATES);

export default function Currency() {
    const [rates, setRates] = useState(FALLBACK_RATES);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [amount, setAmount] = useState('1');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('TRY');
    const [result, setResult] = useState('');

    useEffect(() => {
        fetchRates();
    }, []);

    useEffect(() => {
        calculate();
    }, [amount, fromCurrency, toCurrency, rates]);

    const fetchRates = async () => {
        setLoading(true);
        setError(false);
        try {
            // Check local storage first
            const cached = localStorage.getItem('currency_rates');
            if (cached) {
                const data = JSON.parse(cached);
                // Use cache if less than 24 hours old
                if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                    setRates(data.rates);
                    setLastUpdated(data.timestamp);
                    setLoading(false);
                    // Background update
                    updateFromApi();
                    return;
                }
            }
            await updateFromApi();
        } catch (e) {
            console.error(e);
            setError(true);
            // Keep using fallback or cached if available
            setLoading(false);
        }
    };

    const updateFromApi = async () => {
        try {
            const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();

            // Merge with existing to keep any custom ones if added later
            const newRates = { ...rates, ...data.rates };
            setRates(newRates);
            setLastUpdated(Date.now());

            localStorage.setItem('currency_rates', JSON.stringify({
                timestamp: Date.now(),
                rates: newRates
            }));
        } catch (e) {
            throw e;
        } finally {
            setLoading(false);
        }
    }

    const calculate = () => {
        if (!amount) {
            setResult('');
            return;
        }

        const val = safeEvaluate(amount);
        if (isNaN(val)) {
            setResult('...');
            return;
        }

        const rateFrom = rates[fromCurrency];
        const rateTo = rates[toCurrency];

        if (rateFrom && rateTo) {
            // Convert to USD then to target
            // Base is USD. 
            // 1 FROM = (1/rateFrom) USD
            // (1/rateFrom) * rateTo = TARGET
            const converted = (val / rateFrom) * rateTo;
            setResult(converted.toFixed(2));
        }
    };

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    // Get list of currencies from current rates
    const availableCurrencies = Object.keys(rates).sort();

    return (
        <div className="space-y-6 animate-in fade-in pb-20">
            <div className="flex justify-between items-center px-1">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Currency Converter</h2>
                    <p className="text-xs text-slate-500">
                        {loading ? 'Updating rates...' : lastUpdated ? `Rates updated: ${new Date(lastUpdated).toLocaleDateString()}` : 'Using offline estimation'}
                    </p>
                </div>
                <Button variant="ghost" size="icon" onClick={fetchRates} disabled={loading} className={loading ? 'animate-spin' : ''}>
                    <RefreshCw size={18} />
                </Button>
            </div>

            {error && !lastUpdated && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>Offline: Using fallback rates (may be inaccurate).</span>
                </div>
            )}

            <Card className="rounded-3xl shadow-xl border-slate-100 overflow-visible relative">
                <CardContent className="p-6 space-y-6 pt-8">
                    {/* From */}
                    <div className="space-y-2">
                        <div className="flex gap-4 items-center">
                            <Input
                                type="text"
                                inputMode="decimal"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="text-3xl font-bold h-auto py-2 border-0 shadow-none focus-visible:ring-0 px-0 bg-transparent placeholder:text-slate-200"
                                placeholder="0"
                            />
                            <Select value={fromCurrency} onValueChange={setFromCurrency}>
                                <SelectTrigger className="w-[100px] font-bold bg-slate-50 border-slate-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableCurrencies.map(c => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Swap */}
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
                            <ArrowRightLeft size={16} className="text-emerald-600" />
                        </Button>
                    </div>

                    {/* To */}
                    <div className="space-y-2">
                        <div className="flex gap-4 items-center">
                            <div className="w-full text-3xl font-bold text-emerald-600 break-all select-all">
                                {result || '...'}
                            </div>
                            <Select value={toCurrency} onValueChange={setToCurrency}>
                                <SelectTrigger className="w-[100px] font-bold bg-slate-50 border-slate-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableCurrencies.map(c => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
