import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share2, Users, Minus, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import NanoBananaVisual from '../components/NanoBananaVisual';

export default function BillSplitter() {
    const [bill, setBill] = useState('');
    const [tip, setTip] = useState(15);
    const [people, setPeople] = useState(2);
    const [result, setResult] = useState({ total: 0, perPerson: 0, tipAmount: 0 });

    useEffect(() => {
        const b = parseFloat(bill) || 0;
        const t = (b * tip) / 100;
        const total = b + t;
        const perPerson = total / people;

        setResult({
            total: total.toFixed(2),
            perPerson: perPerson.toFixed(2),
            tipAmount: t.toFixed(2)
        });
    }, [bill, tip, people]);

    const handleShare = () => {
        navigator.clipboard.writeText(`Bill: ${bill}, Tip: ${tip}%, Total: ${result.total}, Per Person: ${result.perPerson}`);
        toast.success("Copied to clipboard");
    };

    return (
        <div className="space-y-6 pb-24 animate-in fade-in">
            {/* Header Card */}
            <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 mb-6 overflow-hidden shadow-lg">
                <CardContent className="p-0 flex flex-col sm:flex-row items-center sm:items-stretch">
                    <div className="w-full sm:w-1/3 bg-white/30 dark:bg-black/20 p-6 flex items-center justify-center">
                        <NanoBananaVisual family="bill" />
                    </div>
                    <div className="flex-1 p-6 space-y-2">
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                            Split Bill & Tip
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Easily split the check among friends and calculate the perfect tip.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-slate-100 dark:border-slate-800 shadow-xl dark:bg-slate-900">
                <CardContent className="p-6 space-y-8">
                    {/* Bill Input */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Total Bill</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">$</span>
                            <Input
                                type="number"
                                value={bill}
                                onChange={(e) => setBill(e.target.value)}
                                placeholder="0.00"
                                className="text-4xl font-black h-16 py-2 border-0 shadow-none bg-slate-50 dark:bg-slate-800 rounded-xl px-12 text-slate-900 dark:text-slate-100 placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    {/* Tip Selection */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tip Percentage</label>
                            <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">{tip}%</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 mb-2">
                            {[10, 15, 18, 20].map((val) => (
                                <Button
                                    key={val}
                                    variant={tip === val ? "default" : "outline"}
                                    onClick={() => setTip(val)}
                                    className={`h-10 text-xs font-bold ${tip === val ? 'bg-purple-600 hover:bg-purple-700' : 'text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                                >
                                    {val}%
                                </Button>
                            ))}
                        </div>
                        <Slider
                            value={[tip]}
                            onValueChange={(v) => setTip(v[0])}
                            max={50}
                            step={1}
                            className="py-2"
                        />
                    </div>

                    {/* People Selection */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Split Amongst</label>
                            <span className="flex items-center gap-1 text-pink-600 dark:text-pink-400 font-bold text-lg">
                                <Users size={18} /> {people}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setPeople(Math.max(1, people - 1))}
                                className="h-10 w-10 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm rounded-lg"
                            >
                                <Minus size={18} />
                            </Button>
                            <div className="flex-1 text-center font-bold text-slate-900 dark:text-slate-100 text-xl">
                                {people} <span className="text-xs font-normal text-slate-400 ml-1">people</span>
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setPeople(people + 1)}
                                className="h-10 w-10 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm rounded-lg"
                            >
                                <Plus size={18} />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="border-0 bg-white dark:bg-slate-800 shadow-lg text-slate-900 dark:text-slate-100">
                    <CardContent className="p-5 flex flex-col justify-center items-center text-center h-full">
                        <span className="text-xs uppercase font-bold text-slate-400 mb-1">Total Bill</span>
                        <span className="text-2xl font-bold">{result.total}</span>
                        <span className="text-[10px] text-slate-400 mt-1">Tip: {result.tipAmount}</span>
                    </CardContent>
                </Card>
                <Card className="border-0 bg-pink-600 text-white shadow-lg shadow-pink-200 dark:shadow-none">
                    <CardContent className="p-5 flex flex-col justify-center items-center text-center h-full relative overflow-hidden">
                        <div className="absolute -bottom-4 -right-4 p-2 opacity-10 rotate-12">
                            <Users size={80} />
                        </div>
                        <span className="text-xs uppercase font-bold opacity-80 mb-1">Per Person</span>
                        <span className="text-4xl font-black">{result.perPerson}</span>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-center">
                <Button variant="ghost" className="text-slate-400" onClick={handleShare}>
                    <Share2 size={16} className="mr-2" /> Share Bill
                </Button>
            </div>
        </div>
    );
}
