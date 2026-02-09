import { useState } from 'react';
import { Search, Copy, Check } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const constants = [
    { name: "Standard Gravity", symbol: "g", value: 9.80665, unit: "m/s²", category: "Physical" },
    { name: "Universal Gas Constant", symbol: "R", value: 8.314462618, unit: "J/(mol·K)", category: "Thermodynamics" },
    { name: "Atmospheric Pressure", symbol: "atm", value: 101325, unit: "Pa", category: "Pressure" },
    { name: "Speed of Light", symbol: "c", value: 299792458, unit: "m/s", category: "Physical" },
    { name: "Boltzmann Constant", symbol: "k", value: 1.380649e-23, unit: "J/K", category: "Thermodynamics" },
    { name: "Avogadro Constant", symbol: "NA", value: 6.02214076e23, unit: "1/mol", category: "Chemistry" },
    { name: "Planck Constant", symbol: "h", value: 6.62607015e-34, unit: "J·s", category: "Quantum" },
    { name: "Pi", symbol: "π", value: 3.14159265359, unit: "", category: "Mathematics" },
    { name: "Euler's Number", symbol: "e", value: 2.71828182846, unit: "", category: "Mathematics" },
];

export default function Constants() {
    const [query, setQuery] = useState('');
    const [copied, setCopied] = useState(null);

    const filtered = constants.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.symbol.toLowerCase().includes(query.toLowerCase())
    );

    const handleCopy = (val) => {
        navigator.clipboard.writeText(val);
        setCopied(val);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="space-y-6 animate-in fade-in pb-24">
            <div className="px-1 space-y-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Constants Library</h2>
                    <p className="text-sm text-slate-500">Search and copy engineering constants.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search constants..."
                        className="pl-10 bg-white"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-3">
                {filtered.map((c) => (
                    <Card key={c.name} className="border-slate-100 shadow-sm">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-800">{c.symbol}</span>
                                    <span className="text-sm font-medium text-slate-600">{c.name}</span>
                                </div>
                                <div className="text-xs text-slate-400 mt-1 bg-slate-50 inline-block px-1.5 py-0.5 rounded">{c.category}</div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="text-sm font-mono bg-slate-50 px-2 py-1 rounded text-slate-700">
                                    {c.value.toExponential(4)}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs text-blue-600 hover:text-blue-700 p-0"
                                    onClick={() => handleCopy(c.value)}
                                >
                                    {copied === c.value ? <Check size={12} className="mr-1" /> : <Copy size={12} className="mr-1" />}
                                    {copied === c.value ? 'Copied' : 'Copy'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {filtered.length === 0 && (
                    <div className="text-center py-10 text-slate-400 text-sm">
                        No constants found.
                    </div>
                )}
            </div>
        </div>
    );
}
