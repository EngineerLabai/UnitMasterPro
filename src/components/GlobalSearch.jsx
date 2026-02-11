import { useState, useEffect } from "react"
import { Calculator, Calendar, CreditCard, Settings, User, Smile, Search, Ruler, Link as LinkIcon, Download, Banknote, ChefHat } from "lucide-react"
import { useNavigate } from "react-router-dom"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import unitsData from '../data/units.json'

// Flatten units for search
const allUnits = [];
Object.entries(unitsData).forEach(([family, units]) => {
    units.forEach(unit => {
        allUnits.push({ ...unit, family });
    });
});

export function GlobalSearch() {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const down = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = (action) => {
        setOpen(false)
        action()
    }

    return (
        <>
            <Button
                variant="outline"
                className="w-full justify-between text-muted-foreground h-9 px-4 py-2 hidden md:flex"
                onClick={() => setOpen(true)}
            >
                <span className="inline-flex items-center">
                    <Search className="mr-2 h-4 w-4" />
                    Search units...
                </span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>

            {/* Mobile Trigger - Icon only */}
            <Button variant="ghost" size="icon" className="md:hidden text-slate-500" onClick={() => setOpen(true)}>
                <Search size={20} />
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a unit or command..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

                    <CommandGroup heading="Suggestions">
                        <CommandItem value="Browse Categories" onSelect={() => runCommand(() => navigate('/sets'))}>
                            <Ruler className="mr-2 h-4 w-4" />
                            <span>Browse Categories</span>
                        </CommandItem>
                        <CommandItem value="Constants Library" onSelect={() => runCommand(() => navigate('/constants'))}>
                            <LinkIcon className="mr-2 h-4 w-4" />
                            <span>Constants Library</span>
                        </CommandItem>
                        <CommandItem value="Currency Converter" onSelect={() => runCommand(() => navigate('/currency'))}>
                            <Banknote className="mr-2 h-4 w-4" />
                            <span>Currency Converter</span>
                        </CommandItem>
                        <CommandItem value="Discount & Tax Calculator" onSelect={() => runCommand(() => navigate('/discount'))}>
                            <Percent className="mr-2 h-4 w-4" />
                            <span>Discount & Tax Calculator</span>
                        </CommandItem>
                        <CommandItem value="Split Bill & Tip" onSelect={() => runCommand(() => navigate('/bill'))}>
                            <Users className="mr-2 h-4 w-4" />
                            <span>Split Bill & Tip</span>
                        </CommandItem>
                        <CommandItem value="Cooking Converter" onSelect={() => runCommand(() => navigate('/cooking'))}>
                            <ChefHat className="mr-2 h-4 w-4" />
                            <span>Cooking Converter</span>
                        </CommandItem>
                        <CommandItem value="Export History" onSelect={() => runCommand(() => navigate('/history'))}>
                            <Download className="mr-2 h-4 w-4" />
                            <span>Export History</span>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Units">
                        {allUnits.map((unit) => (
                            <CommandItem
                                key={`${unit.family}-${unit.id}`}
                                value={`${unit.name} ${unit.symbol} ${unit.family}`}
                                onSelect={() => runCommand(() => navigate(`/?family=${unit.family}&from=${unit.id}`))}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span>{unit.name} ({unit.symbol})</span>
                                    <span className="text-xs text-muted-foreground capitalize">{unit.family}</span>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
