import { ArmorEntity, SkillEntity } from "@/database/entities";
import { CraftingType } from "@/config/crafting-types";
import humanizeDuration from 'humanize-duration';

export type WorkStatisticsProps = { 
    
    skill: SkillEntity;
    armor: ArmorEntity;

    craftingType: CraftingType;
    fullEffort: number;
    currentEffort: number;
    currentStamina: number;
};

const humanize = humanizeDuration.humanizer({ maxDecimalPoints: 2 })


export default function WorkStatistics({ 
    skill, 
    armor,
    craftingType,
    fullEffort,
    currentEffort,
    currentStamina
}: WorkStatisticsProps) {

    // Ratios
    const powerPerStamina = skill.power / craftingType.staminaCost;
    const powerPerSecond = skill.power / armor.interval;

    // Single Stamina Bar calculations
    const staminaIterations = Math.floor(armor.stamina / craftingType.staminaCost);
    const effortPerStaminaBar = staminaIterations * skill.power;
    const timePerStaminaBar = staminaIterations * armor.interval;

    // Full Effort Calculations
    const timeStaminaWaiting = (Math.max(fullEffort - effortPerStaminaBar, 0) / powerPerStamina / (armor.regenPerSecond + 0.25));
    const timeEffortCrafting = fullEffort / powerPerSecond;

    return (
        <div>
            <div>Stamina Iterations: {staminaIterations} </div>
            <div>Effort per Stamina Bar: {effortPerStaminaBar} </div>
            <div>Time per Stamina Bar: {humanize(timePerStaminaBar * 1000)} </div>
            <div>Time crafting: {humanize(timeEffortCrafting * 1000)}</div>
            <div>Time waiting: {humanize(timeStaminaWaiting * 1000)}</div>
        </div>
    );
}
 
 
