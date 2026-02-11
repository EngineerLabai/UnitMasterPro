import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share2, Star, RefreshCcw, Percent } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import NanoBananaVisual from '../components/NanoBananaVisual';

export default function Discount() {
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState(20);
    const [tax, setTax] = useState(0);
    const [result, setResult] = useState({ final: 0, saved: 0, taxAmount: 0 });

    useEffect(() => {
        calculate();
    }, [price, discount, tax]);

    const calculate = () => {
        const p = parseFloat(price) || 0;
        const d = parseFloat(discount) || 0;
        const t = parseFloat(tax) || 0;

        const savedAmount = p * (d / 100);
        const priceAfterDiscount = p - savedAmount;
        const taxAmount = priceAfterDiscount * (t / 100);
        const finalPrice = priceAfterDiscount + taxAmount;

        setResult({
            final: finalPrice.toFixed(2),
            saved: savedAmount.toFixed(2),
            taxAmount: taxAmount.toFixed(2)
        });
    };

    const handleShare = () => {
        navigator.clipboard.writeText(`Original: ${price}, Discount: ${discount}%, Final: ${result.final}`);
        toast.success("Copied to clipboard");
    };

    return (
        <div className="space-y-6 pb-24 animate-in fade-in">
            <Card className="border-0 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 mb-6 overflow-hidden shadow-lg">
                <CardContent className="p-0 flex flex-col sm:flex-row items-center sm:items-stretch">
                    <div className="w-full sm:w-1/3 bg-white/30 dark:bg-black/20 p-6 flex items-center justify-center">
                        <NanoBananaVisual family="discount" />
                    </div>
                    <div className="flex-1 p-6 space-y-2">
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400">
                            Discount & Tax
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Calculate final price after discounts and sales tax. Perfect for shopping sales!
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-slate-100 dark:border-slate-800 shadow-xl dark:bg-slate-900">
                <CardContent className="p-6 space-y-8">
                    {/* Price Input */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Original Price</label>
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0.00"
                            className="text-4xl font-black h-16 py-2 border-0 shadow-none bg-slate-50 dark:bg-slate-800 rounded-xl px-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-300"
                        />
                    </div>

                    {/* Discount Slider */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Discount</label>
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">{discount}%</span>
                        </div>
                        <Slider
                            value={[discount]}
                            onValueChange={(v) => setDiscount(v[0])}
                            max={100}
                            step={1}
                            className="py-2"
                        />
                    </div>

                    {/* Tax Slider */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sales Tax</label>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">{tax}%</span>
                        </div>
                        <Slider
                            value={[tax]}
                            onValueChange={(v) => setTax(v[0])}
                            max={50}
                            step={0.5}
                            className="py-2"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Result Area */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="border-0 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100">
                    <CardContent className="p-5 flex flex-col justify-center items-center text-center h-full">
                        <span className="text-xs uppercase font-bold opacity-60 mb-1">You Save</span>
                        <span className="text-3xl font-black">{result.saved}</span>
                    </CardContent>
                </Card>
                <Card className="border-0 bg-indigo-600 text-white">
                    <CardContent className="p-5 flex flex-col justify-center items-center text-center h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <Percent size={64} />
                        </div>
                        <span className="text-xs uppercase font-bold opacity-80 mb-1">Final Price</span>
                        <span className="text-4xl font-black">{result.final}</span>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-center">
                <Button variant="ghost" className="text-slate-400" onClick={handleShare}>
                    <Share2 size={16} className="mr-2" /> Share Calculation
                </Button>
            </div>
        </div>
    );
}
