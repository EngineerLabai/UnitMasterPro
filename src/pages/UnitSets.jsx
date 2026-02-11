import { useNavigate } from 'react-router-dom';
import {
    Ruler, Scale, Gauge, Zap, Thermometer, Hammer, Activity,
    Square, Box, Wind, Clock, HardDrive, Flame, Plug,
    Banknote, ChefHat, Calendar, Heart, Percent
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const categories = [
    { id: 'length', name: 'Length', icon: Ruler, description: 'Meter, Inch, Mile', popular: true },
    { id: 'mass', name: 'Mass', icon: Scale, description: 'Kilogram, Pound, Ounce', popular: true },
    { id: 'pressure', name: 'Pressure', icon: Gauge, description: 'Pascal, Bar, PSI', popular: true },
    { id: 'temperature', name: 'Temperature', icon: Thermometer, description: 'Celsius, Fahrenheit, Kelvin', popular: true },
    { id: 'area', name: 'Area', icon: Square, description: 'Square Meter, Acre', popular: false },
    { id: 'volume', name: 'Volume', icon: Box, description: 'Liter, Gallon, m³', popular: false },
    { id: 'speed', name: 'Speed', icon: Wind, description: 'm/s, km/h, mph', popular: false },
    { id: 'time', name: 'Time', icon: Clock, description: 'Second, Hour, Year', popular: false },
    { id: 'digital', name: 'Digital', icon: HardDrive, description: 'Byte, KB, MB, GB', popular: false },
    { id: 'energy', name: 'Energy', icon: Flame, description: 'Joule, Calorie, kWh', popular: false },
    { id: 'power', name: 'Power', icon: Plug, description: 'Watt, Horsepower', popular: false },
    { id: 'force', name: 'Force', icon: Hammer, description: 'Newton, Pound-force', popular: false },
    { id: 'torque', name: 'Torque', icon: Activity, description: 'Nm, lbf·ft', popular: false },
];

const specializedTools = [
    { id: 'currency', name: 'Currency', icon: Banknote, path: '/currency', description: 'Real-time exchange rates' },
    { id: 'cooking', name: 'Cooking', icon: ChefHat, path: '/cooking', description: 'Ingredient volume to weight' },
    { id: 'date', name: 'Date Gap', icon: Calendar, path: '/date', description: 'Date calculator' },
    { id: 'bmi', name: 'BMI Calc', icon: Heart, path: '/bmi', description: 'Body Mass Index' },
];

export default function UnitSets() {
    const navigate = useNavigate();

    const handleSelect = (category) => {
        navigate(`/?family=${category}`);
    };

    return (
        <div className="space-y-6 animate-in fade-in pb-24">
            <div className="flex justify-between items-center px-1">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Unit Categories</h2>
                    <p className="text-sm text-slate-500">Select a category.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/constants')}>
                    Constants
                </Button>
            </div>

            {/* Standard Units */}
            <div className="grid grid-cols-2 gap-4">
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                        <Card
                            key={cat.id}
                            onClick={() => handleSelect(cat.id)}
                            className="cursor-pointer hover:shadow-md transition-all active:scale-[0.98] border-slate-100 relative overflow-hidden group"
                        >
                            <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{cat.name}</h3>
                                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{cat.description}</p>
                                </div>
                                {cat.popular && (
                                    <Badge variant="secondary" className="absolute top-2 right-2 text-[10px] px-1.5 py-0 bg-yellow-50 text-yellow-600 border-yellow-100">
                                        Popular
                                    </Badge>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Specialized Tools */}
            <div className="pt-4">
                <h3 className="text-lg font-bold text-slate-900 mb-4 px-1">Specialized Tools</h3>
                <div className="grid grid-cols-1 gap-4">
                    {specializedTools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <Card
                                key={tool.id}
                                onClick={() => navigate(tool.path)}
                                className="cursor-pointer hover:shadow-md transition-all active:scale-[0.98] border-slate-100 relative overflow-hidden group"
                            >
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className={`p-3 rounded-full ${tool.id === 'currency' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                        <Icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">{tool.name} Converter</h3>
                                        <p className="text-xs text-slate-500">{tool.description}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <Button variant="ghost" size="sm">Open</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
