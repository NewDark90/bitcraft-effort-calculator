export const isAudioPlaying = (audio: HTMLAudioElement): boolean => {
    return audio.duration > 0 && !audio.paused
} 

/** Avoids playing the audio if it is already playing. */
export const playAudioOnce = (audio: HTMLAudioElement | null | undefined) => {
    if (audio == null) 
        return; 
    
    if (isAudioPlaying(audio)) 
        return;

    audio.play();
}