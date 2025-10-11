export const isAudioPlaying = (audio: HTMLAudioElement): boolean => {
    return audio.duration > 0 && !audio.paused
} 