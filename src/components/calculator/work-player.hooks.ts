import { craftingTiers } from "@/config/crafting-tiers";
import { craftingTypes, CraftingTypeSlug } from "@/config/crafting-types";
import { getStaminaCost } from "@/config/stamina-costs";
import { TierNumber } from "@/config/tier";
import { getWorkInterval } from "@/config/work-intervals";
import { calculatorDatabase } from "@/database/db";
import { ArmorEntity, FoodEntity, settingKeys, SkillEntity } from "@/database/tables";
import { useServiceWorker } from "@/hooks/use-service-worker";
import { useWakeLock } from "@/hooks/use-wake-lock";
import { minmax } from "@/util/minmax";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { useEventListener, useInterval, useLocalStorage } from "usehooks-ts";


export type UseWorkPlayerStateReturn = { 
    fullEffort: number; 
    currentEffort: number; 
    currentStamina: number; 
    craftingType: CraftingTypeSlug; 
    craftingTier: TierNumber; 
    isWorking: boolean; 
    workInterval: number;
    restart: () => void; 
    setIsWorking: Dispatch<SetStateAction<boolean>>; 
    setCraftingType: Dispatch<SetStateAction<CraftingTypeSlug>>; 
    setCraftingTier: Dispatch<SetStateAction<TierNumber>>; 
    setCurrentEffort: (effort: number) => number; 
    setFullEffort: (effort: number) => void; 
    doWork: (ratio?: number) => void; 
    doWorkBatch: (timeDelta: number) => void; 
    doStaminaRegen: (ratio?: number) => void; 
    getWorkProgressStats: () => WorkProgressStats;
};

export type WorkProgressStats = { 
    willComplete: boolean; 
    staminaIterations: number; 
    remainingWorkTimeMs: number; 
    remainingEffort: number; 
    timeToRegenerateStaminaMs: number;
}

const flatStaminaRegenRate = 0.25;

export const useWorkPlayerState = (
    armor: ArmorEntity,
    skill: SkillEntity,
    food: FoodEntity,
): UseWorkPlayerStateReturn => {

    const [fullEffort, _setFullEffort] = useLocalStorage('work-player.full-effort', 100);
    const [currentEffort, _setCurrentEffort] = useLocalStorage('work-player.current-effort', 0);
    const [craftingType, _setCraftingType] = useLocalStorage<CraftingTypeSlug>('work-player.crafting-type', craftingTypes[0].slug);
    const [craftingTier, _setCraftingTier] = useLocalStorage('work-player.crafting-tier', craftingTiers[0].tier);
    const [currentStamina, _setCurrentStamina] = useLocalStorage('work-player.current-stamina', armor.stamina);
    const [isWorking, _setIsWorking] = useLocalStorage('work-player.is-working', false);

    const workInterval = (getWorkInterval(craftingType) * 1000);
    const staminaCost = getStaminaCost(craftingType, craftingTier);

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
        const newStamina =  minmax(currentStamina + ((flatStaminaRegenRate + food.staminaRegen) * ratio), 0, armor.stamina);
        _setCurrentStamina(newStamina); 
        return newStamina;
    }

    const doWork = (ratio: number = 1) => {
        const newStamina = currentStamina - (staminaCost * ratio);
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
            newStamina >= staminaCost && 
            newEffort < fullEffort
        ) {
            timeDelta =- workInterval;
            newStamina =- staminaCost;
            newEffort += skill.power;
        }   

        if (newStamina < staminaCost) {
            _setIsWorking(false);
        }

        setCurrentEffort(newEffort);

        const staminaTicks = Math.floor(timeDelta / 1000);
        const staminaRegenerated = (flatStaminaRegenRate + food.staminaRegen) * staminaTicks;
        _setCurrentStamina(minmax(newStamina + staminaRegenerated, 0, armor.stamina));      
    }

    const getWorkProgressStats = (): WorkProgressStats => {
        const remainingStaminaIterations = Math.floor(currentStamina / staminaCost);
        const neededStaminaIterations = Math.ceil((fullEffort - currentEffort) / skill.power);

        const willComplete = remainingStaminaIterations <= neededStaminaIterations;
        //We either run out of stamina or complete the work, whatever comes first.
        const staminaIterations = Math.min(remainingStaminaIterations, neededStaminaIterations);

        const remainingWorkTimeMs = staminaIterations * workInterval;
        const remainingEffort = staminaIterations * skill.power;

        const staminaAfterWorkIterations = currentStamina - (staminaIterations * staminaCost);
        const timeToRegenerateStaminaMs = ((armor.stamina - staminaAfterWorkIterations) / (flatStaminaRegenRate + food.staminaRegen)) * 1000;

        return {
            willComplete,
            staminaIterations,
            remainingWorkTimeMs,
            remainingEffort,
            timeToRegenerateStaminaMs
        };
    }

    const result = {
        fullEffort,
        currentEffort,
        currentStamina,
        craftingType,
        craftingTier,
        isWorking,
        workInterval,

        restart,
        setIsWorking: _setIsWorking,
        setCraftingType: _setCraftingType,
        setCraftingTier: _setCraftingTier,
        setCurrentEffort,
        setFullEffort,
        doWork, 
        doWorkBatch,
        doStaminaRegen,
        getWorkProgressStats
    };

    useWorkPlayerInteractivity(result);

    return result;
}

type UseWorkPlayerInteractivityParameters = UseWorkPlayerStateReturn;



const useWorkPlayerInteractivity = (
    {
        isWorking,
        doWork,
        workInterval,
        doStaminaRegen,
        doWorkBatch,
        getWorkProgressStats
    }: UseWorkPlayerInteractivityParameters
) => {

    const documentRef = useRef(document);
    const [isFocused, setIsFocused] = useState(true);
    //const [blurredStamp, _setBlurredStamp] = useLocalStorage<null|number>('work-player.blurred-stamp', null);
    const { wakeLock, wakeRelease } = useWakeLock();

    const onServiceWorkerMessage = (message: ServiceWorkerMessage) => {
        const messageResponse = message as unknown as ServiceWorkerMessageEventResponse;
        if (messageResponse.type === 'craft-notification.response.complete') {
            // Play sound if complete or out of stamina.
        }

    }

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

                const stats = getWorkProgressStats();
                if (serviceWorker.isRegistered) {
                    serviceWorker.postMessage({
                        type: "craft-notification.request.queue",
                        payload: {
                            finishMs: stats.remainingWorkTimeMs,
                            willComplete: stats.willComplete
                        }
                    } satisfies ServiceWorkerMessageEventRequest);
                } else {
                    // Handle fallback if service worker doesn't exist. Other options have drawbacks.
                    // Could default to having a regular timer (might get out of sync)
                    // Could ignore this case given ~94% support.
                }
            }

            setIsFocused(false);
        }, 
        documentRef
    );

    useEventListener(
        "focus", 
        async (event) => {
            
            if (isWorking) {
                // In this case, we've lost focus, and regained it before the service worker recognizes it being done. 
                // Fast-forward the work steps to current time. 
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
            
            if (serviceWorker.isRegistered) {
                serviceWorker.postMessage({
                    type: "craft-notification.request.cancel",
                    payload: null
                } satisfies ServiceWorkerMessageEventRequest);
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