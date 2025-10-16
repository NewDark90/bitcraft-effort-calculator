export function tryParseJson<T>(jsonString: string | null, defaultValue: T): T {
    if (jsonString == null) {
        return defaultValue;
    }
    try {
        const parsed = JSON.parse(jsonString);
        return parsed as T;
    } catch {
        return defaultValue;
    }
}