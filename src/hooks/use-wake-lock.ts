import { useRef } from 'react';

export const useWakeLock = () => {
    const wakeLockRef = useRef<WakeLockSentinel | null>(null);

    const release = async () => {
        await wakeLockRef.current?.release();
        wakeLockRef.current = null;
    };

    const lock = async () => {
        await release();
        try {
            wakeLockRef.current = await navigator.wakeLock.request('screen');
        } catch (err) {
            console.warn('Issue creating wakelock', err);
        }
    };

    return {
        wakeLock: lock,
        wakeRelease: release,
        isLocked: wakeLockRef.current !== null,
    };
};