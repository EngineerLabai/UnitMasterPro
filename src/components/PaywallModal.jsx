import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Sparkles } from 'lucide-react';
import { usePremium } from '../contexts/PremiumContext';

export default function PaywallModal({ isOpen, onClose }) {
    const { upgradeToPremium } = usePremium();

    const handleUpgrade = () => {
        upgradeToPremium();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] border-none shadow-2xl bg-gradient-to-b from-white to-slate-50">
                <DialogHeader className="space-y-4 items-center text-center pb-2">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600 mb-2">
                        <Sparkles size={32} />
                    </div>
                    <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Upgrade to Pro
                    </DialogTitle>
                    <DialogDescription className="text-base text-slate-500">
                        Unlock the full potential of UnitMaster Pro and remove all limits.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <Check size={14} strokeWidth={3} />
                        </div>
                        <span className="font-medium text-slate-700">Unlimited PDF Exports</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <Check size={14} strokeWidth={3} />
                        </div>
                        <span className="font-medium text-slate-700">Access All Premium Units</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <Check size={14} strokeWidth={3} />
                        </div>
                        <span className="font-medium text-slate-700">Ad-Free Experience</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <Check size={14} strokeWidth={3} />
                        </div>
                        <span className="font-medium text-slate-700">Support Development</span>
                    </div>
                </div>

                <DialogFooter className="flex-col gap-2 sm:flex-col mt-4">
                    <Button
                        onClick={handleUpgrade}
                        className="w-full h-12 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200"
                    >
                        Get Pro - $4.99 / Lifetime
                    </Button>
                    <Button variant="ghost" onClick={onClose} className="w-full text-slate-400 font-normal">
                        Maybe Later
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
