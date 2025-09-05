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
import { minmax } from "@/util/minmax";

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
            if (currentStamina <= craftingType.staminaCost) {
                // Stop, not done
                togglePlaying(false);
                return;
            }

            setCurrentStamina(stamina => stamina - craftingType.staminaCost);  
            const newEffort = Math.min(currentEffort + skill.power, fullEffort);
            setCurrentEffort(newEffort);

            if (newEffort >= fullEffort) {
                // Stop, done.
                togglePlaying(false);
                return;
            }
        },
        isPlaying ? (armor.interval * 1000) : null
    )

    // Stamina Regen
    useInterval(
        () => {
            setCurrentStamina(stamina => minmax(stamina + 0.25 + armor.regenPerSecond, 0, armor.stamina));  
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
            <div className="w-full my-4 flex flex-row flex-wrap justify-center">

                <h2 className="w-full text-center">
                    Craft
                </h2>

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

                
                <Button 
                    variant="text"
                    onClick={restart}
                >
                    <RestartAltIcon color="warning" sx={{ fontSize: 48 }}></RestartAltIcon>
                    
                </Button>

                <Button 
                    className="w-full"
                    variant="text"
                    onClick={() => togglePlaying(!isPlaying)}
                >
                    {
                        isPlaying 
                            ? <PauseIcon color="info"  sx={{ fontSize: 96 }}></PauseIcon>
                            : <PlayArrowIcon color="info" sx={{ fontSize: 96 }}></PlayArrowIcon>
                    }
                </Button>
            </div>

            <ProgressBar key="stamina" 
                className="my-4"
                current={ currentStamina } 
                max={ armor?.stamina ?? 100 }>
            </ProgressBar>

            <ProgressBar key="effort" 
                className="my-4"
                current={ currentEffort } 
                max={ fullEffort } 
                barColor="var(--effort)">
                
            </ProgressBar>

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
 
 
