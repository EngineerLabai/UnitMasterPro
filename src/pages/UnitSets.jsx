import { useNavigate } from 'react-router-dom';
import {
    Ruler, Scale, Gauge, Thermometer, Hammer, Activity,
    Square, Box, Wind, Clock, HardDrive, Flame, Plug,
    Banknote, ChefHat, Calendar, Heart, Percent, Users
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from '../contexts/LanguageContext';

export default function UnitSets() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const categories = [
        { id: 'length', name: t('cat.length'), icon: Ruler, description: 'Meter, Inch, Mile', popular: true },
        { id: 'mass', name: t('cat.mass'), icon: Scale, description: 'Kilogram, Pound, Ounce', popular: true },
        { id: 'pressure', name: t('cat.pressure'), icon: Gauge, description: 'Pascal, Bar, PSI', popular: true },
        { id: 'temperature', name: t('cat.temperature'), icon: Thermometer, description: 'Celsius, Fahrenheit, Kelvin', popular: true },
        { id: 'area', name: t('cat.area'), icon: Square, description: 'Square Meter, Acre', popular: false },
        { id: 'volume', name: t('cat.volume'), icon: Box, description: 'Liter, Gallon, m³', popular: false },
        { id: 'speed', name: t('cat.speed'), icon: Wind, description: 'm/s, km/h, mph', popular: false },
        { id: 'time', name: t('cat.time'), icon: Clock, description: 'Second, Hour, Year', popular: false },
        { id: 'digital', name: t('cat.digital'), icon: HardDrive, description: 'Byte, KB, MB, GB', popular: false },
        { id: 'energy', name: t('cat.energy'), icon: Flame, description: 'Joule, Calorie, kWh', popular: false },
        { id: 'power', name: t('cat.power'), icon: Plug, description: 'Watt, Horsepower', popular: false },
        { id: 'force', name: t('cat.force'), icon: Hammer, description: 'Newton, Pound-force', popular: false },
        { id: 'torque', name: t('cat.torque'), icon: Activity, description: 'Nm, lbf·ft', popular: false },
    ];

    const specializedTools = [
        { id: 'currency', name: t('tool.currency'), icon: Banknote, path: '/currency', description: t('currency.desc') },
        { id: 'discount', name: t('tool.discount'), icon: Percent, path: '/discount', description: t('discount.desc') },
        { id: 'bill', name: t('tool.bill'), icon: Users, path: '/bill', description: t('bill.desc') },
        { id: 'cooking', name: t('tool.cooking'), icon: ChefHat, path: '/cooking', description: 'Ingredient volume to weight' },
        { id: 'date', name: t('tool.date'), icon: Calendar, path: '/date', description: 'Date calculator' },
        { id: 'bmi', name: t('tool.bmi'), icon: Heart, path: '/bmi', description: 'Body Mass Index' },
    ];

    const handleSelect = (category) => {
        navigate(`/?family=${category}`);
    };

    return (
        <div className="space-y-8 animate-in fade-in pb-24">
            <div className="flex justify-between items-center px-1">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-gray-100">{t('categories.title')}</h2>
                    <p className="text-sm text-slate-500 dark:text-gray-400">{t('categories.subtitle')}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/constants')}>
                    {t('categories.constants')}
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
                            className="cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] border-slate-100 dark:border-slate-800 dark:bg-slate-900 relative overflow-hidden group"
                        >
                            <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                                <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-gray-100">{cat.name}</h3>
                                    {/* Description is technical unit names, usually universal, but can be translated if needed. Keeping simple for now since descriptions in categoryInfo are handled. Removing line-clamp-1 desc here or keeping it? The original code had it. I'll keep it but maybe hide it since it's hard to translate dynamically without a huge map. Or I just leave it English for now as 'examples'. */}
                                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{cat.description}</p>
                                </div>
                                {cat.popular && (
                                    <Badge variant="secondary" className="absolute top-2 right-2 text-[10px] px-1.5 py-0 bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900/50">
                                        {t('categories.popular')}
                                    </Badge>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Specialized Tools */}
            <div className="pt-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-gray-100 mb-4 px-1">{t('categories.pro_tools')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {specializedTools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <Card
                                key={tool.id}
                                onClick={() => navigate(tool.path)}
                                className="cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] border-slate-100 dark:border-slate-800 dark:bg-slate-900 relative overflow-hidden group"
                            >
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className={`p-3 rounded-full ${tool.id === 'currency' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                        tool.id === 'discount' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' :
                                            tool.id === 'bill' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                                                'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                                        }`}>
                                        <Icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-gray-100 text-base">{tool.name}</h3>
                                        <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-1">{tool.description}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <Button variant="ghost" size="sm" className="hidden sm:flex">{t('categories.open')}</Button>
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
