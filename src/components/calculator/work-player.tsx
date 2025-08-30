import CraftParameters from "@/components/calculator/craft-parameters";
import ProgressBar from "@/components/progress-bar";
import { SkillEntity, ArmorEntity } from "@/database/entities";
import { craftParameterService } from "@/services/craft-parameter-service";
import { Button } from "@mui/material";
import { useState } from "react";
import { useInterval } from "usehooks-ts";

export type WorkPlayerProps = {   
    skill: SkillEntity;
    armor: ArmorEntity;
};

export default function WorkPlayer(
    { skill, armor }: WorkPlayerProps
) {

    const [fullEffort, setFullEffort] = useState(craftParameterService.getEffort());
    const [currentEffort, setCurrentEffort] = useState(0);
    const [craftingType, setCraftingType] = useState(craftParameterService.getCraftingType());
    const [currentStamina, setCurrentStamina] = useState(armor.stamina);
    
    const [isPlaying, setIsPlaying] = useState(false);

    // Crafting
    useInterval(
        () => {

        },
        isPlaying ? armor.interval : null
    )

    // Stamina Regen
    useInterval(
        () => {

        },
        !isPlaying ? 1000 : null
    )

    const togglePlaying = () => {
        setIsPlaying(!isPlaying);
    }

    return (
        <div className="">
            
            
            <CraftParameters 
                effort={fullEffort}
                craftType={craftingType}
                onCraftTypeChange={(type) => { 
                    setCraftingType(type);
                    craftParameterService.setCraftingType(type);
                }}
                onEffortChange={(effort) => { 
                    setFullEffort(effort);
                    setCurrentEffort(0);
                    craftParameterService.setEffort(effort);
                }}
            >
            </CraftParameters>


            <ProgressBar key="effort" 
                current={ currentEffort } 
                max={ fullEffort } 
                barColor="var(--effort)">
                
            </ProgressBar>

            <ProgressBar key="stamina" 
                current={ currentStamina } 
                max={ armor?.stamina ?? 100 }>
            </ProgressBar>


            <Button 
                onClick={togglePlaying}
            >

            </Button>
        </div>
    );
}
 
 
