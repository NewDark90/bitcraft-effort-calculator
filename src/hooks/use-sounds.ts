import { useSettings } from "@/hooks/use-settings";
import { isAudioPlaying } from "@/util/isAudioPlaying";
import { useCallback, useMemo } from "react";

export const useSounds = (
    
) => {

    const {
        settings: {
            playAlarmAudio
        }
     } = useSettings();


    const outOfStaminaAudio = useMemo(() => new Audio('/sounds/out-of-stamina.mp3'), []);
    const craftStartAudio = useMemo(() => new Audio('/sounds/craft-start.mp3'), []);
    const completeCraftAudio = useMemo(() => new Audio('/sounds/complete-craft.mp3'), []);

    const tryPlayAudio = useCallback((type: "work-complete" | "stamina-complete") => {
        if (!craftStartAudio)
            return;

        if (type === "work-complete" && !isAudioPlaying(craftStartAudio)) {
            //Intentional, it sounds better.
            craftStartAudio.play();
        } else if (type === "stamina-complete" && !isAudioPlaying(outOfStaminaAudio)) {
            completeCraftAudio.play();
        }

    }, [playAlarmAudio.value])

    return {
        tryPlayAudio
    };
};