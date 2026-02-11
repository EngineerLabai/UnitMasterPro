import { useState } from 'react';
import { Heart, Scale, Ruler } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BmiCalc() {
    const [unit, setUnit] = useState('metric');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [weightLbs, setWeightLbs] = useState('');
    const [heightFt, setHeightFt] = useState('');
    const [heightIn, setHeightIn] = useState('');

    const calculate = () => {
        let w = parseFloat(weight);
        let h = parseFloat(height);

        if (unit === 'imperial') {
            const wL = parseFloat(weightLbs);
            const hF = parseFloat(heightFt);
            const hI = parseFloat(heightIn);
            if (!isNaN(wL) && !isNaN(hF) && !isNaN(hI)) {
                w = wL * 0.453592;
                h = (hF * 30.48) + (hI * 2.54);
            } else {
                return null;
            }
        }

        if (isNaN(w) || isNaN(h) || h === 0) return null;

        // BMI = kg / m^2
        const hM = h / 100;
        const bmi = w / (hM * hM);
        return bmi.toFixed(1);
    };

    const getCategory = (bmi) => {
        if (!bmi) return { label: '-', color: 'slate-400' };
        const b = parseFloat(bmi);
        if (b < 18.5) return { label: 'Underweight', color: 'blue-500' };
        if (b < 25) return { label: 'Normal weight', color: 'emerald-500' };
        if (b < 30) return { label: 'Overweight', color: 'orange-500' };
        return { label: 'Obese', color: 'red-500' };
    };

    const bmi = calculate();
    const category = getCategory(bmi);

    return (
        <div className="space-y-6 animate-in fade-in pb-20">
            <div className="px-1 space-y-2">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                        <Heart size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">BMI Calculator</h2>
                        <p className="text-xs text-slate-500">Body Mass Index & Health.</p>
                    </div>
                </div>
            </div>

            <Card className="rounded-3xl shadow-lg border-slate-100">
                <CardContent className="p-6 space-y-6">
                    <Tabs value={unit} onValueChange={setUnit} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="metric">Metric (kg/cm)</TabsTrigger>
                            <TabsTrigger value="imperial">Imperial (lbs/ft)</TabsTrigger>
                        </TabsList>

                        <TabsContent value="metric" className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Weight (kg)</label>
                                <div className="relative">
                                    <Input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="pl-10 text-lg font-bold" placeholder="70" />
                                    <Scale className="absolute left-3 top-3 text-slate-300" size={18} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Height (cm)</label>
                                <div className="relative">
                                    <Input type="number" value={height} onChange={e => setHeight(e.target.value)} className="pl-10 text-lg font-bold" placeholder="175" />
                                    <Ruler className="absolute left-3 top-3 text-slate-300" size={18} />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="imperial" className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Weight (lbs)</label>
                                <div className="relative">
                                    <Input type="number" value={weightLbs} onChange={e => setWeightLbs(e.target.value)} className="pl-10 text-lg font-bold" placeholder="150" />
                                    <Scale className="absolute left-3 top-3 text-slate-300" size={18} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Feet</label>
                                    <Input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)} className="text-lg font-bold" placeholder="5" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Inches</label>
                                    <Input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)} className="text-lg font-bold" placeholder="10" />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="bg-slate-50 rounded-2xl p-8 text-center space-y-2 transition-all">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your BMI</div>
                        <div className={`text-6xl font-black text-${category.color === 'slate-400' ? 'slate-300' : category.color.replace('500', '600')}`}>
                            {bmi || '--'}
                        </div>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-${category.color}`}>
                            {category.label}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
