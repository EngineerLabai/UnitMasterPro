import { useState } from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears, addDays, format, isValid, parseISO } from 'date-fns';

export default function DateGap() {
    const [d1, setD1] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [d2, setD2] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'));

    // For Add Mode
    const [startD, setStartD] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [daysToAdd, setDaysToAdd] = useState('30');

    const calculateDiff = () => {
        const date1 = parseISO(d1);
        const date2 = parseISO(d2);
        if (!isValid(date1) || !isValid(date2)) return null;

        return {
            days: Math.abs(differenceInDays(date1, date2)),
            weeks: Math.abs(differenceInWeeks(date1, date2)),
            months: Math.abs(differenceInMonths(date1, date2)),
            years: Math.abs(differenceInYears(date1, date2)),
        };
    };

    const calculateAdd = () => {
        const date = parseISO(startD);
        const d = parseInt(daysToAdd);
        if (!isValid(date) || isNaN(d)) return null;

        return format(addDays(date, d), 'PPP');
    };

    const diff = calculateDiff();
    const addResult = calculateAdd();

    return (
        <div className="space-y-6 animate-in fade-in pb-20">
            <div className="px-1 space-y-2">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Date Calculator</h2>
                        <p className="text-xs text-slate-500">Duration and future dates.</p>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="diff" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="diff">Difference</TabsTrigger>
                    <TabsTrigger value="add">Add Days</TabsTrigger>
                </TabsList>

                <TabsContent value="diff">
                    <Card className="rounded-3xl shadow-lg border-slate-100">
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Start Date</label>
                                    <Input type="date" value={d1} onChange={e => setD1(e.target.value)} className="font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">End Date</label>
                                    <Input type="date" value={d2} onChange={e => setD2(e.target.value)} className="font-bold" />
                                </div>
                            </div>

                            {diff && (
                                <div className="bg-slate-50 rounded-2xl p-6 space-y-4 text-center">
                                    <div>
                                        <div className="text-4xl font-black text-indigo-600">{diff.days}</div>
                                        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Days</div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 pt-4 border-t border-slate-200">
                                        <div>
                                            <span className="block font-bold text-slate-900 text-lg">{diff.weeks}</span>
                                            Weeks
                                        </div>
                                        <div>
                                            <span className="block font-bold text-slate-900 text-lg">{diff.months}</span>
                                            Months
                                        </div>
                                        <div>
                                            <span className="block font-bold text-slate-900 text-lg">{diff.years}</span>
                                            Years
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="add">
                    <Card className="rounded-3xl shadow-lg border-slate-100">
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Start Date</label>
                                    <Input type="date" value={startD} onChange={e => setStartD(e.target.value)} className="font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Days to Add/Subtract</label>
                                    <Input type="number" value={daysToAdd} onChange={e => setDaysToAdd(e.target.value)} className="font-bold" placeholder="e.g. 30 or -7" />
                                </div>
                            </div>

                            <div className="bg-indigo-50 rounded-2xl p-6 text-center">
                                <div className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-1">Resulting Date</div>
                                <div className="text-2xl font-black text-indigo-700">
                                    {addResult || 'Invalid input'}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
