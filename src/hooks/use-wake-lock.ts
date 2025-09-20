import { useCallback, useRef } from 'react';

export const useWakeLock = () => {
    const wakeLockRef = useRef<WakeLockSentinel | null>(null);

    const release = useCallback(async () => {
        await wakeLockRef.current?.release();
        wakeLockRef.current = null;
    }, []);

    const lock = useCallback(async () => {
        await release();
        try {
            wakeLockRef.current = await navigator.wakeLock.request('screen');
        } catch (err) {
            console.warn('Issue creating wakelock', err);
        }
    }, []);

    return {
        wakeLock: lock,
        wakeRelease: release,
        isLocked: wakeLockRef.current !== null,
    };
};