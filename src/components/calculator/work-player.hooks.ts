import { CraftingType, craftingTypes } from "@/config/crafting-types";
import { calculatorDatabase } from "@/database/db";
import { ArmorEntity, settingKeys, SkillEntity } from "@/database/entities";
import { useNotificationSettings } from "@/hooks/use-notification-settings";
import { useServiceWorker } from "@/hooks/use-service-worker";
import { useWakeLock } from "@/hooks/use-wake-lock";
import { minmax } from "@/util/minmax";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { useEventListener, useInterval, useLocalStorage } from "usehooks-ts";


export type UseWorkPlayerStateReturn = { 
    fullEffort: number; 
    currentEffort: number; 
    currentStamina: number; 
    craftingType: CraftingType; 
    isWorking: boolean; 
    workInterval: number;
    restart: () => void; 
    setIsWorking: Dispatch<SetStateAction<boolean>>; 
    setCraftingType: Dispatch<SetStateAction<CraftingType>>; 
    setCurrentEffort: (effort: number) => number; 
    setFullEffort: (effort: number) => void; 
    doWork: (ratio?: number) => void; 
    doWorkBatch: (timeDelta: number) => void; 
    doStaminaRegen: (ratio?: number) => void; 
} 

export const useWorkPlayerState = (
    armor: ArmorEntity,
    skill: SkillEntity
): UseWorkPlayerStateReturn => {

    const [fullEffort, _setFullEffort] = useLocalStorage('work-player.full-effort', 100);
    const [currentEffort, _setCurrentEffort] = useLocalStorage('work-player.current-effort', 0);
    const [craftingType, _setCraftingType] = useLocalStorage('work-player.crafting-type', craftingTypes[0]);
    const [currentStamina, _setCurrentStamina] = useLocalStorage('work-player.current-stamina', armor.stamina);
    const [isWorking, _setIsWorking] = useLocalStorage('work-player.is-working', false);

    const workInterval = (armor.interval * 1000);

    const setCurrentEffort = useCallback((effort: number) => {
        const newEffort = minmax(effort, 0, fullEffort);
        _setCurrentEffort(newEffort);
        return newEffort;
    }, [fullEffort])

    const setFullEffort = useCallback((effort: number) => {
        const newEffort = Math.max(effort, 0);
        _setCurrentEffort(0);
        _setFullEffort(newEffort);
    }, []);

    const restart = useCallback(() => {
        _setIsWorking(false);
        _setCurrentEffort(0);
        _setCurrentStamina(armor.stamina);
    }, []);

    const doStaminaRegen = (ratio: number = 1) => {
        const newStamina =  minmax(currentStamina + ((0.25 + armor.regenPerSecond) * ratio), 0, armor.stamina);
        _setCurrentStamina(newStamina); 
        return newStamina;
    }

    const doWork = (ratio: number = 1) => {
        const newStamina = currentStamina - (craftingType.staminaCost * ratio);
        if (newStamina <= 0) {
            // Stop, not done
            _setIsWorking(false);
            return;
        }
        _setCurrentStamina(newStamina); 

        const newEffort = setCurrentEffort(currentEffort + (skill.power * ratio));

        if (newEffort >= fullEffort) {
            // Stop, done.
            _setIsWorking(false);
            return;
        }
    }

    const doWorkBatch = (timeDelta: number) => {
        let newStamina = currentStamina;
        let newEffort = currentEffort;

        while(
            timeDelta >= workInterval && 
            newStamina >= craftingType.staminaCost && 
            newEffort < fullEffort
        ) {
            timeDelta =- workInterval;
            newStamina =- craftingType.staminaCost;
            newEffort += skill.power;
        }   

        if (newStamina < craftingType.staminaCost) {
            _setIsWorking(false);
        }

        setCurrentEffort(newEffort);

        const staminaTicks = Math.floor(timeDelta / 1000);
        const staminaRegenerated = (0.25 + armor.regenPerSecond) * staminaTicks;
        _setCurrentStamina(minmax(newStamina + staminaRegenerated, 0, armor.stamina));  
        
    }
    const result = {
        fullEffort,
        currentEffort,
        currentStamina,
        craftingType,
        isWorking,
        workInterval,

        restart,
        setIsWorking: _setIsWorking,
        setCraftingType: _setCraftingType,
        setCurrentEffort,
        setFullEffort,
        doWork, 
        doWorkBatch,
        doStaminaRegen
    };

    useWorkPlayerInteractivity(result);

    return result;
}

type UseWorkPlayerInteractivityParameters = UseWorkPlayerStateReturn;

const onServiceWorkerMessage = (message: ServiceWorkerMessage) => {
    const messageResponse = message as unknown as ServiceWorkerMessageEventResponse;
    if (messageResponse.type === 'craft-notification.response.complete') {
        
    }

}

const useWorkPlayerInteractivity = (
    {
        isWorking,
        doWork,
        workInterval,
        doStaminaRegen,
        doWorkBatch
    }: UseWorkPlayerInteractivityParameters
) => {

    const documentRef = useRef(document);
    const [isFocused, setIsFocused] = useState(true);
    //const [blurredStamp, _setBlurredStamp] = useLocalStorage<null|number>('work-player.blurred-stamp', null);
    const { wakeLock, wakeRelease } = useWakeLock();
    const serviceWorker = useServiceWorker({ 
        serviceWorkerUrl: "/sw.js", 
        onMessage: onServiceWorkerMessage, 
        onError: (err) => { console.error("Service worker error", err); } 
    });

    useEffect(() => {
        if (serviceWorker.isSupported) {
            serviceWorker.register();
        }
    }, [])

    useEventListener(
        "blur", 
        async (event) => {
            if (isWorking) {
                await calculatorDatabase.settings.put({
                    id: settingKeys.calculatorBlurStamp,
                    value: Date.now()
                });
            }

            if (serviceWorker.isSupported && serviceWorker.isRegistered) {
                serviceWorker.postMessage("")
            }

            setIsFocused(false);
        }, 
        documentRef
    );

    useEventListener(
        "focus", 
        async (event) => {
            
            if (isWorking) {
                const blurredStamp = await calculatorDatabase.settings.get(settingKeys.calculatorBlurStamp);
                if (blurredStamp?.value) {
                    const timeElapsed = Date.now() - (blurredStamp?.value as number);
                    doWorkBatch(timeElapsed);
                    await calculatorDatabase.settings.put({
                        id: settingKeys.calculatorBlurStamp,
                        value: null
                    });
                }
            }
            setIsFocused(true);
        }, 
        documentRef
    );

    // Crafting
    useInterval(
        () => {
            doWork(1)
        },
        isWorking && isFocused ? workInterval : null
    )

    // Stamina Regen
    useInterval(
        () => {
            doStaminaRegen(1);  
        },
        !isWorking && isFocused ? 1000 : null
    )

    useEffect(() => {
        if (isWorking) {
            wakeLock();
        } else {
            wakeRelease();
        }

        return () => {
            wakeRelease();
        };
    }, [isWorking]);

    return {
        isFocused
    };
};