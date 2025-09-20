import { CraftingType, craftingTypes } from "@/config/crafting-types";
import { ArmorEntity, SkillEntity } from "@/database/entities";
import { useWakeLock } from "@/hooks/use-wake-lock";
import { minmax } from "@/util/minmax";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { useEventListener, useInterval, useLocalStorage } from "usehooks-ts";

const useWorkPlayerServiceWorker = (
    isWorking: boolean, 
    setIsWorking: Dispatch<SetStateAction<boolean>>
    
) => {

    const [isFocused, setIsFocused] = useState(true);
    const documentRef = useRef(document);
    const [blurredStamp, _setBlurredStamp] = useLocalStorage<null|number>('work-player.blurred-stamp', null);

    useEventListener(
        "blur", 
        (event) => {
            setIsFocused(false);
        }, 
        documentRef
    );

    useEventListener(
        "focus", 
        (event) => {
            setIsFocused(true);
        }, 
        documentRef
    );

    return {
        isFocused
    };
};


export const useWorkPlayerState = (
    armor: ArmorEntity,
    skill: SkillEntity
) => {

    const [fullEffort, _setFullEffort] = useLocalStorage('work-player.full-effort', 100);
    const [currentEffort, _setCurrentEffort] = useLocalStorage('work-player.current-effort', 0);
    const [craftingType, _setCraftingType] = useLocalStorage('work-player.crafting-type', craftingTypes[0]);
    const [currentStamina, _setCurrentStamina] = useLocalStorage('work-player.current-stamina', armor.stamina);
    
    const [isWorking, _setIsWorking] = useState(false);
    const { wakeLock, wakeRelease } = useWakeLock();
    const { } = useWorkPlayerServiceWorker(isWorking, _setIsWorking, )
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

    // Crafting
    useInterval(
        () => {
            doWork(1)
        },
        isWorking ? workInterval : null
    )

    // Stamina Regen
    useInterval(
        () => {
            _setCurrentStamina(stamina => minmax(stamina + 0.25 + armor.regenPerSecond, 0, armor.stamina));  
        },
        !isWorking ? 1000 : null
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


    const result = {
        fullEffort,
        currentEffort,
        currentStamina,
        craftingType,
        isWorking,

        restart,
        setIsWorking: _setIsWorking,
        setCraftingType: _setCraftingType,
        setCurrentEffort,
        setFullEffort,
        doWork, 
        doWorkBatch
    };

    return result;
}