import { craftingTiers } from "@/config/crafting-tiers";
import { craftingTypes, CraftingTypeSlug } from "@/config/crafting-types";
import { getEffectiveStaminaCost, getStaminaCost } from "@/config/stamina-costs";
import { TierNumber } from "@/config/tier";
import { getWorkInterval, getWorkIntervalFromSeconds, WorkInterval } from "@/config/work-intervals";
import { ArmorEntity, FoodEntity, SkillEntity } from "@/database/tables";
import { useEffectChange } from "@/hooks/use-effect-change";
import { useServiceWorker } from "@/hooks/use-service-worker";
import { useSettings } from "@/hooks/use-settings";
import { useSounds } from "@/hooks/use-sounds";
import { useWakeLock } from "@/hooks/use-wake-lock";
import { minmax } from "@/util/minmax";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useEventListener, useInterval, useLocalStorage } from "usehooks-ts";


export type UseWorkPlayerStateReturn = { 
    fullEffort: number; 
    currentEffort: number; 
    currentStamina: number; 
    fullStamina: number;
    craftingType: CraftingTypeSlug; 
    craftingTier: TierNumber; 
    isWorking: boolean; 
    workInterval: WorkInterval;
    isIntervalOverride: boolean;
    staminaCost: number;
    workProgressStats: WorkProgressStats;

    restart: () => void; 
    setIsWorking: Dispatch<SetStateAction<boolean>>; 
    setCraftingType: Dispatch<SetStateAction<CraftingTypeSlug>>; 
    setCraftingTier: Dispatch<SetStateAction<TierNumber>>; 
    setCurrentEffort: (effort: number) => number; 
    setFullEffort: (effort: number) => void; 
    setCurrentStamina: (stamina: number) => void; 
    setIsIntervalOverride: Dispatch<SetStateAction<boolean>> 
    setManualInterval: Dispatch<SetStateAction<number>> 
    doWork: (ratio?: number) => void; 
    doWorkBatch: (timeDelta: number) => void; 
    doPassiveStaminaRegen: (ratio?: number) => void; 
};


export type WorkProgressStats = { 

    staminaStats: {
        willComplete: boolean; 

        /**  
         * How long will it take to complete a stamina bar? 
         * ([full] - [remaining]) / [full] 
         * <currentStaminaTimeRemaining> / <fullStaminaTimeRemaining>
         */
        workTime: {
            // remainingWorkTimeMs: number; 
            // fullWorkTimeMs: number; 
            remainingMs: number;
            fullMs: number;
        }

        /**
         * How much effort will be completed with this stamina bar?
         * ([full] - [remaining]) / [full] 
         */
        effort: {
            // remainingEffort: number; 
            remaining: number;
            full: number;
        }

        /** 
         * How long will it take to regenerate the stamina bar?
         *  (timeToFull) / (full)
         */
        staminaRegen: {
            // timeToRegenerateStaminaMs: number;
            // fullTimeToRegenerateStaminaMs: number;
            timeToFullMs: number;
            fullMs: number;
        }
    }

    projectStats: {
        /*
         * How long will it take to complete the whole craft?
         * - (amountOfFullEffortTimeRemaining) / (amountOfTimeFullEffortToProcess)
         */
        workTime: {
            remainingMs: number;
            fullMs: number;
        }

        /**
         * How many stamina bars will it take?
         * [currentNumberOfCompletedStaminaBars] / [neededStaminaBars]
         */
        staminaBar: {
            remaining: number;
            total: number;
        }

        /**
         * How long will the total downtime be between regenerations?
         * [currentTimeNeededToRegenAllStamina] / [fullTimeNeededToRegenAllStamina]
         */
        staminaRegen: {
            remainingMs: number;
            fullMs: number;
        }
    }
}

const flatStaminaRegenRate = 0.25;

export const useWorkPlayerState = (
    armor: ArmorEntity,
    skill: SkillEntity,
    food?: FoodEntity,
): UseWorkPlayerStateReturn => {

    const [fullEffort, _setFullEffort] = useLocalStorage('work-player.full-effort', 100);
    const [currentEffort, _setCurrentEffort] = useLocalStorage('work-player.current-effort', 0);
    const [craftingType, _setCraftingType] = useLocalStorage<CraftingTypeSlug>('work-player.crafting-type', craftingTypes[0].slug);
    const [craftingTier, _setCraftingTier] = useLocalStorage('work-player.crafting-tier', craftingTiers[0].tierId);
    const [currentStamina, _setCurrentStamina] = useLocalStorage('work-player.current-stamina', armor.stamina);
    const [isWorking, _setIsWorking] = useLocalStorage('work-player.is-working', false);
    const [isIntervalOverride, _setIsIntervalOverride] = useLocalStorage('work-player.is-interval-override', false);
    const [manualInterval, _setManualInterval] = useLocalStorage('work-player.manual-interval', 1.6);

    const { tryPlayAudio } = useSounds();

    const workInterval: WorkInterval = isIntervalOverride 
        ? getWorkIntervalFromSeconds(manualInterval)
        : getWorkInterval(craftingType, [armor, food]);

    const staminaPassiveRegenRate = flatStaminaRegenRate + (food?.staminaRegen ?? 0);
    const staminaActiveRegenRate = food?.activeStaminaRegen ?? 0;

    const fullStamina = armor.stamina;
    const staminaCost = getStaminaCost(craftingType, craftingTier);
    const staminaCostEffective = getEffectiveStaminaCost(staminaCost, workInterval.effective, staminaActiveRegenRate)

    const setCurrentEffort = (effort: number) => {
        const newEffort = minmax(effort, 0, fullEffort);
        _setCurrentEffort(newEffort);
        return newEffort;
    };

    const setFullEffort = (effort: number) => {
        const newEffort = Math.max(effort, 0);
        _setCurrentEffort(minmax(currentEffort, 0, newEffort));
        _setFullEffort(newEffort);
    };

    const incrementCurrentStamina = (stamina: number) => {
        _setCurrentStamina(
            currentStamina => minmax((currentStamina + stamina), 0, armor.stamina)
        ); 
    } 

    const restart = () => {
        _setIsWorking(false);
        _setCurrentEffort(0);
        _setCurrentStamina(armor.stamina);
    };

    const doPassiveStaminaRegen = (ratio: number = 1) => {
        incrementCurrentStamina((staminaPassiveRegenRate + staminaActiveRegenRate) * ratio);
    };

    const doWork = (ratio: number = 1) => {
        // While we might have extra stamina after regen, we want to assume the regeneration comes after the work, not before.
        const staminaAfterIterationRaw = currentStamina - (staminaCost * ratio);
        if (staminaAfterIterationRaw <= 0) {
            // Stop, not done
            tryPlayAudio("stamina-complete");
            _setIsWorking(false);
            return;
        }

        incrementCurrentStamina(staminaCostEffective * ratio * -1);
        const newEffort = setCurrentEffort(currentEffort + (skill.power * ratio));

        if (newEffort >= fullEffort) {
            // Stop, done.
            tryPlayAudio("work-complete");
            _setIsWorking(false);
            return;
        }
    };

    const doWorkBatch = (timeDelta: number) => {
        let newStamina = currentStamina;
        let newEffort = currentEffort;

        while(
            timeDelta >= workInterval.effectiveMs && 
            newStamina >= staminaCost && 
            newEffort < fullEffort
        ) {
            timeDelta =- workInterval.effectiveMs;
            newStamina =- staminaCost;
            newEffort += skill.power;
        }   

        if (newStamina < staminaCost) {
            _setIsWorking(false);
        }

        setCurrentEffort(newEffort);

        const staminaTicks = Math.floor(timeDelta / 1000);
        const staminaRegenerated = staminaPassiveRegenRate * staminaTicks;
        incrementCurrentStamina(staminaRegenerated);    
    };


    const workProgressStats = ((): WorkProgressStats => {
        //const powerPerStamina = skill.power / staminaCost;
        //const powerPerSecond = skill.power / workInterval.effective;

        // Stamina 
        const totalStaminaBarIterations = Math.floor(armor.stamina / staminaCostEffective);
        const remainingStaminaIterations = Math.floor(currentStamina / staminaCostEffective);
        const neededStaminaIterations = Math.ceil((fullEffort - currentEffort) / skill.power);
        const fullStaminaIterations = Math.ceil(fullEffort / skill.power);

        const willComplete = remainingStaminaIterations <= neededStaminaIterations;
        //We either run out of stamina or complete the work, whatever comes first.
        const staminaIterations = Math.min(remainingStaminaIterations, neededStaminaIterations);

        const fullStaminaEffort = totalStaminaBarIterations * skill.power;
        const remainingWorkTimeMs = staminaIterations * workInterval.effectiveMs;
        const remainingEffort = staminaIterations * skill.power;
        const fullWorkTimeMs = totalStaminaBarIterations * workInterval.effectiveMs;

        //const staminaAfterWorkIterations = currentStamina - (staminaIterations * staminaCost);
        const staminaRegenRate = (staminaPassiveRegenRate + staminaActiveRegenRate);
        const timeToRegenerateStaminaMs = ((armor.stamina - currentStamina) / staminaRegenRate) * 1000;
        const fullTimeToRegenerateStaminaMs = (armor.stamina / staminaRegenRate) * 1000;

        // Project
        const projectEffortTimeRemainingMs = Math.ceil(currentEffort / skill.power) * workInterval.effectiveMs; 
        const projectEffortTimeFullMs = Math.ceil(fullEffort / skill.power) * workInterval.effectiveMs; 

        const projectStaminaBarsRemaining = currentEffort / fullStaminaEffort;
        const projectStaminaBarsTotal = fullEffort / fullStaminaEffort; 

        const neededTimeToRegenerateFullJobStaminaMs = ((neededStaminaIterations * staminaCost) / staminaRegenRate * 1000);
        const fullTimeToRegenerateFullJobStaminaMs = ((fullStaminaIterations * staminaCost) / staminaRegenRate * 1000)

        return {
            staminaStats: {
                willComplete,
                workTime: {
                    remainingMs: remainingWorkTimeMs,
                    fullMs: fullWorkTimeMs
                },
                effort: {
                    remaining: remainingEffort,
                    full: fullStaminaEffort
                },
                staminaRegen: {
                    timeToFullMs: timeToRegenerateStaminaMs,
                    fullMs: fullTimeToRegenerateStaminaMs
                }
            },
            projectStats: {
                workTime: {
                    remainingMs: projectEffortTimeRemainingMs, 
                    fullMs: projectEffortTimeFullMs,
                },
                staminaBar: {
                    remaining: projectStaminaBarsRemaining,
                    total: projectStaminaBarsTotal,
                }, 
                staminaRegen: {
                    remainingMs: neededTimeToRegenerateFullJobStaminaMs,
                    fullMs: fullTimeToRegenerateFullJobStaminaMs,
                }
            },
        };
    })();

    const result: UseWorkPlayerStateReturn = {
        fullEffort,
        currentEffort,
        currentStamina,
        fullStamina,
        craftingType,
        craftingTier,
        isWorking,
        workInterval,
        isIntervalOverride, 
        staminaCost,
        workProgressStats,


        restart,
        setIsWorking: _setIsWorking,
        setCraftingType: _setCraftingType,
        setCraftingTier: _setCraftingTier,
        setCurrentEffort,
        setFullEffort,
        setCurrentStamina: _setCurrentStamina,
        setIsIntervalOverride: _setIsIntervalOverride,
        setManualInterval: _setManualInterval,
        doWork, 
        doWorkBatch,
        doPassiveStaminaRegen,
    };

    return result;
}

type UseWorkPlayerInteractivityParameters = UseWorkPlayerStateReturn;

export const useWorkPlayerInteractivity = (
    {
        isWorking,
        doWork,
        workInterval,
        doPassiveStaminaRegen,
        setCurrentStamina,
        currentStamina,
        fullStamina,
        setIsWorking,
    }: UseWorkPlayerInteractivityParameters
) => {

    const documentRef = useRef(document);
    const [isFocused, setIsFocused] = useState(true);
    const [previousFullStamina, setPreviousFullStamina] = useState(fullStamina);
    //const [blurredStamp, _setBlurredStamp] = useLocalStorage<null|number>('work-player.blurred-stamp', null);
    const { wakeLock, wakeRelease } = useWakeLock();
    const {
        settings: {
            networkDelay
        }
     } = useSettings();
     
    const { tryPlayAudio } = useSounds();

    const onServiceWorkerMessage = (message: ServiceWorkerMessage) => {
        const messageResponse = message as unknown as ServiceWorkerMessageEventResponse;
        if (messageResponse.type === 'craft-notification.response.complete') {
            // Play sound if complete or out of stamina.
            tryPlayAudio(messageResponse.payload.isComplete ? "work-complete" : "stamina-complete");
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
    });

    if (previousFullStamina != fullStamina) {
        // It's possible that someone has changed their stamina values through armor and returned to the page.
        // The calculation should happen outside of this page specifically in a wrapper component that doesn't control display, but for now this at least prevents weird issues.
        setPreviousFullStamina(fullStamina);
        setCurrentStamina(fullStamina);
        setIsWorking(false);
    }

    // Full Stamina Audio
    useEffectChange(() => {
        if (currentStamina == fullStamina && !isWorking) {
            tryPlayAudio("stamina-full");
        }
    }, [currentStamina])

    useEventListener(
        "blur", 
        async (_event) => {
            /*
            if (isWorking) {
                await calculatorDatabase.settings.put({
                    id: settingKeys.calculatorBlurStamp,
                    value: Date.now()
                });

                if (serviceWorker.isRegistered) {
                    serviceWorker.postMessage({
                        type: "craft-notification.request.queue",
                        payload: {
                            finishMs: workProgressStats.staminaStats.workTime.remainingMs,
                            willComplete: workProgressStats.staminaStats.willComplete
                        }
                    } satisfies ServiceWorkerMessageEventRequest);
                } else {
                    // Handle fallback if service worker doesn't exist. Other options have drawbacks.
                    // Could default to having a regular timer (might get out of sync)
                    // Could ignore this case given ~94% support.
                }
            }
            */

            setIsFocused(false);
        }, 
        documentRef
    );

    useEventListener(
        "focus", 
        async (_event) => {
            /*
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
            */
            setIsFocused(true);
        }, 
        documentRef
    );

    // Crafting
    useInterval(
        () => {
            doWork(1)
        },
        isWorking  /* && isFocused */ ? workInterval.effectiveMs + networkDelay.value : null
    )

    // Stamina Regen
    useInterval(
        () => {
            doPassiveStaminaRegen(1);  
        },
        !isWorking /* && isFocused */ ? 1000 + networkDelay.value : null
    )

    useEffectChange(() => {
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