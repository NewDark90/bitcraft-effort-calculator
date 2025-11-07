
import { NotificationStyle } from "@/database/tables/settings";
import { useMemo } from "react";

export type UseFormattersReturn = { 
    staminaRegenFormatter: Intl.NumberFormat; 
};

export const useFormatters = (
    
): UseFormattersReturn => {

    const staminaRegenFormatter = useMemo(() => {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal', 
            maximumFractionDigits: 2, 
            minimumFractionDigits: 0, 
        })
    }, []);

    return {
        staminaRegenFormatter
    };
};


