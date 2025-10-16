import { useSettings } from "@/hooks/use-settings";
import { playAudioOnce } from "@/util/audio";
import { useMemo } from "react";

export const useSounds = (
    
) => {

    const {
        settings: {
            playAlarmAudio
        }
     } = useSettings();


    //const outOfStaminaAudio = useMemo(() => new Audio('/sounds/out-of-stamina.mp3'), []);
    //const craftStartAudio = useMemo(() => new Audio('/sounds/craft-start.mp3'), []);
    //const completeCraftAudio = useMemo(() => new Audio('/sounds/complete-craft.mp3'), []);

    const memeAlarm = useMemo(() => new Audio('/sounds/meme.mp3'), []);

    const tryPlayAudio = (type: "work-complete" | "stamina-complete") => {
        if (!playAlarmAudio.value)
            return;

        if (type === "work-complete") {
            playAudioOnce(memeAlarm);
        } else if (type === "stamina-complete") {
            playAudioOnce(memeAlarm);
        }

    };

    return {
        tryPlayAudio
    };
};