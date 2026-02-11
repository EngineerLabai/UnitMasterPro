import { useState, useEffect } from 'react';
import { ArrowLeft, ChefHat, Scale, Coffee } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Toaster } from "@/components/ui/sonner"

const INGREDIENTS = [
    { id: 'water', name: 'Water', density: 1.0 }, // g/ml
    { id: 'flour_ap', name: 'Flour (All Purpose)', density: 0.53 }, // ~125g per cup (236ml) -> 0.53
    { id: 'flour_bread', name: 'Flour (Bread)', density: 0.54 },
    { id: 'sugar_granulated', name: 'Sugar (Granulated)', density: 0.85 }, // ~200g per cup
    { id: 'sugar_powdered', name: 'Sugar (Powdered)', density: 0.51 }, // ~120g per cup
    { id: 'brown_sugar_packed', name: 'Brown Sugar (Packed)', density: 0.93 }, // ~220g per cup
    { id: 'butter', name: 'Butter', density: 0.96 }, // ~227g per cup
    { id: 'milk', name: 'Milk', density: 1.03 },
    { id: 'oil', name: 'Vegetable Oil', density: 0.92 },
    { id: 'honey', name: 'Honey', density: 1.42 },
    { id: 'rice_uncooked', name: 'Rice (Uncooked)', density: 0.85 },
    { id: 'oats', name: 'Rolled Oats', density: 0.38 }, // ~90g per cup
    { id: 'cocoa', name: 'Cocoa Powder', density: 0.36 }, // ~85g per cup
];

const VOLUME_UNITS = [
    { id: 'ml', name: 'Milliliter', factor: 1 },
    { id: 'cup_us', name: 'Cup (US)', factor: 236.588 },
    { id: 'tbsp', name: 'Tablespoon', factor: 14.7868 },
    { id: 'tsp', name: 'Teaspoon', factor: 4.9289 },
    { id: 'fl_oz', name: 'Fluid Ounce', factor: 29.5735 },
];

const WEIGHT_UNITS = [
    { id: 'g', name: 'Gram', factor: 1 },
    { id: 'kg', name: 'Kilogram', factor: 1000 },
    { id: 'oz', name: 'Ounce', factor: 28.3495 },
    { id: 'lb', name: 'Pound', factor: 453.592 },
];

export default function Cooking() {
    const [amount, setAmount] = useState('1');
    const [ingredient, setIngredient] = useState('flour_ap');
    const [mode, setMode] = useState('vol_to_weight'); // or 'weight_to_vol'
    const [fromUnit, setFromUnit] = useState('cup_us'); // default from volume
    const [toUnit, setToUnit] = useState('g'); // default to weight
    const [result, setResult] = useState('');

    useEffect(() => {
        calculate();
    }, [amount, ingredient, mode, fromUnit, toUnit]);

    const calculate = () => {
        const val = parseFloat(amount || 0);
        if (isNaN(val)) {
            setResult('...');
            return;
        }

        const ing = INGREDIENTS.find(i => i.id === ingredient);
        if (!ing) return;

        let res = 0;

        if (mode === 'vol_to_weight') {
            // Volume -> Weight
            // 1. Convert Input Volume to mL
            const vUnit = VOLUME_UNITS.find(u => u.id === fromUnit);
            const wUnit = WEIGHT_UNITS.find(u => u.id === toUnit);
            if (!vUnit || !wUnit) return;

            const ml = val * vUnit.factor;
            // 2. Convert mL to Grams using density (g = ml * density)
            const grams = ml * ing.density;
            // 3. Convert Grams to Target Weight Unit
            res = grams / wUnit.factor;
        } else {
            // Weight -> Volume
            // 1. Convert Input Weight to Grams
            const wUnit = WEIGHT_UNITS.find(u => u.id === fromUnit);
            const vUnit = VOLUME_UNITS.find(u => u.id === toUnit);
            if (!vUnit || !wUnit) return;

            const grams = val * wUnit.factor;
            // 2. Convert Grams to mL using density (ml = g / density)
            const ml = grams / ing.density;
            // 3. Convert mL to Target Volume Unit
            res = ml / vUnit.factor;
        }

        setResult(res.toFixed(1)); // Cooking usually 1 decimal is enough
    };

    const toggleMode = () => {
        if (mode === 'vol_to_weight') {
            setMode('weight_to_vol');
            setFromUnit('g'); // Default weight
            setToUnit('cup_us'); // Default volume
        } else {
            setMode('vol_to_weight');
            setFromUnit('cup_us');
            setToUnit('g');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in pb-20">
            <div className="px-1 space-y-2">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                        <ChefHat size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Cooking Converter</h2>
                        <p className="text-xs text-slate-500">Convert ingredients by density.</p>
                    </div>
                </div>
            </div>

            <Card className="rounded-3xl shadow-xl border-slate-100 overflow-visible relative">
                <CardContent className="p-6 space-y-6 pt-8">
                    {/* Ingredient Selector */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ingredient</label>
                        <Select value={ingredient} onValueChange={setIngredient}>
                            <SelectTrigger className="w-full font-bold bg-slate-50 border-slate-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {INGREDIENTS.map(i => (
                                    <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="space-y-2 w-1/2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                {mode === 'vol_to_weight' ? 'Volume' : 'Weight'}
                            </label>
                            <div className="flex flex-col gap-2">
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="text-2xl font-bold h-auto py-2"
                                    placeholder="0"
                                />
                                <Select value={fromUnit} onValueChange={setFromUnit}>
                                    <SelectTrigger className="w-full text-xs h-8">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(mode === 'vol_to_weight' ? VOLUME_UNITS : WEIGHT_UNITS).map(u => (
                                            <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex items-center justify-center pt-6">
                            <Button variant="ghost" size="icon" onClick={toggleMode}>
                                <ArrowLeft size={20} className="text-slate-400" />
                            </Button>
                        </div>

                        <div className="space-y-2 w-1/2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                {mode === 'vol_to_weight' ? 'Weight' : 'Volume'}
                            </label>
                            <div className="flex flex-col gap-2">
                                <div className="text-2xl font-bold text-orange-600 py-2 break-all">
                                    {result}
                                </div>
                                <Select value={toUnit} onValueChange={setToUnit}>
                                    <SelectTrigger className="w-full text-xs h-8">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(mode === 'vol_to_weight' ? WEIGHT_UNITS : VOLUME_UNITS).map(u => (
                                            <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
