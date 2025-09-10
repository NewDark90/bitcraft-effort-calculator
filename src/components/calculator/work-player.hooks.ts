import { CraftingType, craftingTypes } from "@/config/crafting-types";
import { ArmorEntity, SkillEntity } from "@/database/entities";
import { WakeLockService, wakeLockService } from "@/services/wake-lock-service";
import { minmax } from "@/util/minmax";
import { useEffect, useState } from "react";
import { useInterval, useLocalStorage } from "usehooks-ts";


export const useWorkPlayerState = (
    armor: ArmorEntity,
    skill: SkillEntity,
    wakeLockService: WakeLockService
) => {

    const [fullEffort, _setFullEffort] = useLocalStorage('work-player.full-effort', 0);
    const [currentEffort, _setCurrentEffort] = useLocalStorage('work-player.current-effort', 0);
    const [craftingType, _setCraftingType] = useLocalStorage('work-player.crafting-type', craftingTypes[0]);
    const [currentStamina, _setCurrentStamina] = useState(armor.stamina);
    
    const [isWorking, _setIsWorking] = useState(false);

    const setCurrentEffort = (effort: number) => {
        const newEffort = minmax(effort, 0, fullEffort);
        _setCurrentEffort(newEffort);
        return newEffort;
    }

    const setFullEffort = (effort: number) => {
        const newEffort = Math.max(effort, 0);
        _setCurrentEffort(0);
        _setFullEffort(newEffort);
    }

    const restart = () => {
        _setIsWorking(false);
        _setCurrentEffort(0);
        _setCurrentStamina(armor.stamina);
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

    // Crafting
    useInterval(
        () => {
            doWork(1)
        },
        isWorking ? (armor.interval * 1000) : null
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
            wakeLockService.lock();
        } else {
            wakeLockService.release();
        }

        return () => {
            wakeLockService.release();
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
        doWork
    };

    return result;
}