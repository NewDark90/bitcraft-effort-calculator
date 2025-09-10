import CraftParameters from "@/components/calculator/craft-parameters";
import ProgressBar from "@/components/progress-bar";
import { SkillEntity, ArmorEntity } from "@/database/entities";
import { wakeLockService } from "@/services/wake-lock-service";
import { Button } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import WorkStatistics from "@/components/calculator/work-statistics";
import { useWorkPlayerState } from "@/components/calculator/work-player.hooks";
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

export type WorkPlayerProps = {   
    skill: SkillEntity;
    armor: ArmorEntity;
};

export default function WorkPlayer(
    { skill, armor }: WorkPlayerProps
) {

    const {
        fullEffort, setFullEffort,
        currentEffort, setCurrentEffort,
        craftingType, setCraftingType,
        currentStamina, 
        isWorking, setIsWorking,
        doWork, restart,
    } = useWorkPlayerState(armor, skill, wakeLockService);

    return (
        <div className="w-full">
            <div className="w-full my-4 flex flex-row flex-wrap justify-center">

                <h2 className="w-full text-center">
                    Craft
                </h2>

                <CraftParameters 
                    fullEffort={fullEffort}
                    currentEffort={currentEffort}
                    craftType={craftingType}
                    power={skill.power}
                    isWorking={isWorking}

                    onCraftTypeChange={(type) => { setCraftingType(type) }}
                    onCurrentEffortChange={(effort) => { setCurrentEffort(effort); }}
                    onFullEffortChange={(effort) => { setFullEffort(effort); }}
                >
                </CraftParameters>

                
                <Button 
                    variant="text"
                    onClick={restart}
                >
                    <RestartAltIcon color="warning" sx={{ fontSize: 48 }}></RestartAltIcon>
                    
                </Button>

                <div 
                    className="w-full flex flex-row justify-center my-2"
                    >
                    <Button 
                        variant="text"
                        className="w-1/5"
                        onClick={() => doWork(-1)}
                    >
                        <UndoIcon color="info" fontSize="large"></UndoIcon>
                    </Button>
                    <Button 
                        className="w-2/5"
                        variant="text"
                        onClick={() => setIsWorking(!isWorking)}
                    >
                        {
                            isWorking 
                                ? <PauseIcon color="info" sx={{ fontSize: 96 }}></PauseIcon>
                                : <PlayArrowIcon color="info" sx={{ fontSize: 96 }}></PlayArrowIcon>
                        }
                    </Button>
                    <Button 
                        variant="text"
                        className="w-1/5"
                        onClick={() => doWork(1)}
                    >
                        <RedoIcon color="info" fontSize="large"></RedoIcon>
                    </Button>
                </div>
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
 
 
