import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight } from 'lucide-react';
import db from '../db/database';
import unitsData from '../data/units.json';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const findUnit = (id) => {
    for (const family in unitsData) {
        const unit = unitsData[family].find(u => u.id === id);
        if (unit) return { ...unit, family };
    }
    return null;
};

export default function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        const favs = await db.favorites.orderBy('timestamp').reverse().toArray();
        setFavorites(favs);
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        await db.favorites.delete(id);
        loadFavorites();
    };

    const handleUse = (fav) => {
        navigate(`/?from=${fav.fromUnitId}&to=${fav.toUnitId}`);
    };

    if (favorites.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <p>No favorites yet.</p>
                <p className="text-sm">Star converts to see them here.</p>
                <Button variant="link" onClick={() => navigate('/')}>Go to Convert</Button>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in pb-20">
            <h2 className="text-xl font-bold text-slate-900 px-1">Favorite Conversions</h2>
            <div className="grid gap-3">
                {favorites.map(fav => {
                    const fromU = findUnit(fav.fromUnitId);
                    const toU = findUnit(fav.toUnitId);
                    if (!fromU || !toU) return null;

                    return (
                        <Card
                            key={fav.id}
                            onClick={() => handleUse(fav)}
                            className="cursor-pointer hover:shadow-md transition-all active:scale-[0.99] border-slate-100"
                        >
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="font-semibold text-slate-700">{fromU.symbol}</div>
                                    <ArrowRight size={16} className="text-slate-300" />
                                    <div className="font-semibold text-blue-600">{toU.symbol}</div>
                                    <div className="text-xs text-slate-400 ml-2 capitalize bg-slate-100 px-2 py-0.5 rounded-full">
                                        {fromU.family}
                                    </div>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                                    onClick={(e) => handleDelete(e, fav.id)}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
