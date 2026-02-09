import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner"

const PremiumContext = createContext();

export function PremiumProvider({ children }) {
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for premium status
        const status = localStorage.getItem('isPremium') === 'true';
        setIsPremium(status);
        setLoading(false);
    }, []);

    const upgradeToPremium = () => {
        localStorage.setItem('isPremium', 'true');
        setIsPremium(true);
        toast.success("Welcome to Pro!", {
            description: "You now have access to all features.",
            duration: 5000,
        });
    };

    const resetPremium = () => {
        localStorage.removeItem('isPremium');
        setIsPremium(false);
        toast.info("Premium reset to free tier.");
    }

    return (
        <PremiumContext.Provider value={{ isPremium, upgradeToPremium, resetPremium, loading }}>
            {children}
        </PremiumContext.Provider>
    );
}

export const usePremium = () => useContext(PremiumContext);
