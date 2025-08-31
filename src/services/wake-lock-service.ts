export class WakeLockService {
    
    private wakeLock: WakeLockSentinel | null = null;
    private visibilityListener: (() => Promise<void>) | null = null;

    async lock() {
        this.setVisibilityListener();
        await this.release();
        try {
            this.wakeLock = await navigator.wakeLock.request("screen");
        }
        catch (err) {
            console.warn("Issue with wakelock", err)
        }
    }

    async release() {
        await this.wakeLock?.release();
        this.wakeLock = null;
    }

    private setVisibilityListener() {
        if (this.visibilityListener) {
            return;
        }

        this.visibilityListener = async () => {
            if (this.wakeLock != null && document.visibilityState === "visible") {
                this.release();
                this.wakeLock = await navigator.wakeLock.request("screen");
            }
        };
        document.addEventListener("visibilitychange", this.visibilityListener);
    }
}

export const wakeLockService = new WakeLockService();