export function tryParseInt(value: string | null | undefined, defaultValue = 0) {
    if (value === null || value === undefined) {
        return defaultValue;
    }
    
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
}