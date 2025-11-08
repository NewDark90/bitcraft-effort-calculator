
import { useCallback, useMemo } from "react";

export type UseFormattersReturn = { 
    staminaRegenFormatter: Intl.NumberFormat; 
    staminaBarCountFormatter: Intl.NumberFormat; 
    workTimeFormatter: (totalSeconds: number) => string
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

    const staminaBarCountFormatter = useMemo(() => {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal', 
            maximumFractionDigits: 1, 
            minimumFractionDigits: 1, 
        })
    }, []);

    const workTimeFormatter = useCallback(
        (totalSeconds: number): string => {
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = Math.round(totalSeconds % 60);

            // Add leading zeros if necessary
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(seconds).padStart(2, '0');

            return `${formattedMinutes}:${formattedSeconds}`;
        }, 
        []
    );

    return {
        staminaRegenFormatter,
        staminaBarCountFormatter,
        workTimeFormatter,
    };
};


