import { useState, useEffect, useCallback } from 'react';

interface UseServiceWorkerOptions {
    serviceWorkerUrl?: string;
    onMessage?: (message: ServiceWorkerMessage) => void;
    onError?: (error: Error) => void;
}

export const useServiceWorker = (options: UseServiceWorkerOptions = {}) => {
    const {
        serviceWorkerUrl = '/sw.js',
        onMessage,
        onError
    } = options;

    const isSupported = 'serviceWorker' in navigator;

    const [isRegistered, setIsRegistered] = useState(false);
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
    const [error, setError] = useState<Error | null>(null);


    // Set up message listener
    useEffect(() => {
        if (!isSupported) return;

        const handleMessage = (event: MessageEvent) => {
            if (!event.data || typeof event.data !== 'object') return;

            const message = event.data as ServiceWorkerMessage;

            // Forward to custom message handler
            onMessage?.(message);
        };

        navigator.serviceWorker.addEventListener('message', handleMessage);

        return () => {
            navigator.serviceWorker.removeEventListener('message', handleMessage);
        };
    }, [isSupported, onMessage]);

    const postMessage = useCallback((message: ServiceWorkerMessage) => {
        if (!isSupported || !registration?.active) {
            throw new Error('Service worker not available');
        }
        registration.active.postMessage(message);
    }, [isSupported, registration]);

    
    // Register service worker
    const register = useCallback(async () => {
        if (!isSupported || registration) 
            return;

        try {
            const reg = await navigator.serviceWorker.register(serviceWorkerUrl);
            setRegistration(reg);
            setIsRegistered(true);
        } catch (error) {
            const err = error instanceof Error ? error : new Error('Failed to register service worker');
            setError(err);
            onError?.(err);
        }
    }, [isSupported, serviceWorkerUrl, onError]);

    // Unregister service worker
    const unregister = useCallback(async () => {
        if (!registration) 
            return;

        try {
            const unregistered = await registration.unregister();
            if (unregistered) {
                setIsRegistered(false);
                setRegistration(null);
            }
        } catch (error) {
            const err = error instanceof Error ? error : new Error('Failed to unregister service worker');
            setError(err);
            onError?.(err);
        }
    }, [registration, onError]);

    return {
        // State
        isSupported,
        isRegistered,
        registration,
        error,

        // Methods
        postMessage,
        register,
        unregister
    };
};
