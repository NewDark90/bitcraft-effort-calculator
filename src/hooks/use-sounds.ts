import { useSettings } from "@/hooks/use-settings";
import { playAudioOnce } from "@/util/audio";
import { minmax } from "@/util/minmax";
import { useMemo } from "react";

export const useSounds = (
    
) => {

    const {
        settings: {
            playAlarmAudio,
            alarmVolume,
            alarmFile
        }
     } = useSettings();

    const alarmAudio = useMemo(
        () => {
            if (typeof Audio === "undefined") {
                return;
            }

            const audio = new Audio(alarmFile.value);
            return audio;
        }, 
        [alarmFile.value]
    );
    
    if (alarmAudio) {
        alarmAudio.volume = alarmVolume.value;
    }

    const setAlarmVolume = async (volume: number) => {
        if (!alarmAudio)
            return;
            
        alarmAudio.volume = minmax(volume, 0, 1);
        await alarmVolume.save(alarmAudio.volume);
    }

    const tryPlayAudio = (type: "work-complete" | "stamina-complete" | "stamina-full") => {
        if (!playAlarmAudio.value)
            return;

        if (type === "work-complete" && playAlarmAudio.value === "out-of-stamina") {
            playAudioOnce(alarmAudio);
        } else if (type === "stamina-complete" && playAlarmAudio.value === "out-of-stamina") {
            playAudioOnce(alarmAudio);
        } else if (type === "stamina-full" && playAlarmAudio.value === "stamina-full") {
            playAudioOnce(alarmAudio);
        }
    };

    return {
        tryPlayAudio,
        setAlarmVolume
    };
};