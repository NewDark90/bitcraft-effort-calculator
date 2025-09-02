import CraftParameters from "@/components/calculator/craft-parameters";
import ProgressBar from "@/components/progress-bar";
import { SkillEntity, ArmorEntity } from "@/database/entities";
import { craftParameterService } from "@/services/craft-parameter-service";
import { wakeLockService, WakeLockService } from "@/services/wake-lock-service";
import { Button } from "@mui/material";
import { useState } from "react";
import { useInterval } from "usehooks-ts";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import WorkStatistics from "@/components/calculator/work-statistics";

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
            const newStamina = currentStamina - craftingType.staminaCost;
            if (newStamina < 0) {
                // Stop, not done
                togglePlaying(false);
            }

            setCurrentStamina(newStamina);  
            const newEffort = Math.min(currentEffort + skill.power, fullEffort);
            setCurrentEffort(newEffort);

            if (newEffort == fullEffort) {
                // Stop, done.
                restart();
            }
        },
        isPlaying ? (armor.interval * 1000) : null
    )

    // Stamina Regen
    useInterval(
        () => {
            const newStamina = Math.min(currentStamina + 0.25 + armor.regenPerSecond, armor.stamina);
            setCurrentStamina(newStamina);  
        },
        !isPlaying ? 1000 : null
    )

    const togglePlaying = (playing: boolean) => {
        (playing 
            ? wakeLockService.lock()
            : wakeLockService.release());

        setIsPlaying(playing);
    }

    const restart = () => {
        togglePlaying(false);
        setCurrentEffort(0);
        setCurrentStamina(armor.stamina);
    }

    return (
        <div className="w-full">
            
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


            <div>
                <Button 
                    variant="text"
                    onClick={restart}
                >
                    <RestartAltIcon></RestartAltIcon>
                    
                </Button>
                <Button 
                    variant="text"
                    onClick={() => togglePlaying(!isPlaying)}
                >
                    {
                        isPlaying 
                            ? <PauseIcon></PauseIcon>
                            : <PlayArrowIcon></PlayArrowIcon>
                    }
                </Button>
            </div>

            <WorkStatistics 
                skill={ skill } 
                armor={ armor } 
                craftingType={ craftingType } 
                fullEffort={ fullEffort } 
                currentEffort={ currentEffort } 
                currentStamina={ currentStamina }
            >
            </WorkStatistics>
        </div>
    );
}
 
 
