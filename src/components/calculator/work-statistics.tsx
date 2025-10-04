
import { CraftingTier } from "@/config/crafting-tiers";
import humanizeDuration from 'humanize-duration';
import { Theme, useTheme } from "@mui/material";
import { SkillEntity } from "@/database/tables/skills";
import { ArmorEntity } from "@/database/tables/armors";

export type WorkStatisticsProps = { 
    
    skill: SkillEntity;
    armor: ArmorEntity;

    craftingType: CraftingTier;
    fullEffort: number;
    currentEffort: number;
    currentStamina: number;
};

const humanize = humanizeDuration.humanizer({ round: true, largest: 2 })

const row = (label: React.ReactNode, value: React.ReactNode, theme: Theme): JSX.Element => {
    return <>
        <div className="text-right" style={{color: theme.palette.secondary.main }}> 
            {label} 
        </div>
        <div className="text-left"> 
            {value}  
        </div>
    </>
}


export default function WorkStatistics({ 
    skill, 
    armor,
    craftingType,
    fullEffort,
    currentEffort,
    currentStamina
}: WorkStatisticsProps) {

    
    const theme = useTheme();

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
        <div className="grid grid-cols-2 gap-2">
            { row(<span>Stamina Iterations</span>, staminaIterations, theme)} 
            { row(<span>Effort per Stamina Bar</span>, humanize(timePerStaminaBar * 1000), theme) }
            { row(<span>Time Crafting</span>, humanize(timeEffortCrafting * 1000), theme) }
            
            { row(<span>Time Waiting</span>, humanize(timeStaminaWaiting * 1000), theme) }


            
            { /* row(<span></span>, ) */}
        </div>
    );
}
 
 
