import CraftParameters from "@/components/calculator/craft-parameters";
import ProgressBar from "@/components/progress-bar";
import { Button } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useWorkPlayerInteractivity, useWorkPlayerState } from "@/components/calculator/work-player.hooks";
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { ArmorEntity, FoodEntity, SkillEntity } from "@/database/tables";
import { CraftingTypeSlug } from "@/config/crafting-types";
import { useEffect } from "react";
import StaminaStatistics from "@/components/calculator/stamina-statistics";
import ProjectStatistics from "@/components/calculator/project-statistics";
import clsx from "clsx";
import { useEffectChange } from "@/hooks/use-effect-change";

export type WorkPlayerProps = {   
    skill: SkillEntity;
    armor: ArmorEntity;
    food?: FoodEntity;
    onCraftingTypeChange?: (type: CraftingTypeSlug) => void;
};

export default function WorkPlayer(
    { 
        skill, 
        armor, 
        food, 
        onCraftingTypeChange 
    }: WorkPlayerProps
) {

    const workPlayerState = useWorkPlayerState(armor, skill, food);
    useWorkPlayerInteractivity(workPlayerState);

    const {
        fullEffort, setFullEffort,
        currentEffort, setCurrentEffort,
        craftingType, setCraftingType,
        craftingTier, setCraftingTier,
        workInterval,
        isIntervalOverride, setIsIntervalOverride,
        setManualInterval,
        currentStamina, 
        workProgressStats,
        isWorking, setIsWorking,
        doWork, restart,
    } = workPlayerState;

    useEffectChange(() => {
        onCraftingTypeChange?.(craftingType);
    }, [craftingType]);

    const isEffortDone = currentEffort === fullEffort;

    return (
        <div className="w-full">
            <div className="w-full my-4 flex flex-row flex-wrap justify-center">

                <h2 className="w-full text-center">
                    Craft
                </h2>

                <CraftParameters 
                    className="w-full"
                    fullEffort={fullEffort}
                    currentEffort={currentEffort}
                    craftType={craftingType}
                    craftingTier={craftingTier}
                    workInterval={workInterval}
                    isIntervalOverride={isIntervalOverride}
                    isWorking={isWorking}

                    onCraftTypeChange={(type) => { setCraftingType(type) }}
                    onCraftTierChange={(tier) => { setCraftingTier(tier) }}
                    onCurrentEffortChange={(effort) => { setCurrentEffort(effort); }}
                    onFullEffortChange={(effort) => { setFullEffort(effort); }}
                    onIsIntervalOverrideChange={(isOverride) => { setIsIntervalOverride(isOverride) }}
                    onManualIntervalChange={(interval) => {
                        if (!isIntervalOverride) 
                            return
                        setManualInterval(interval);
                    }}
                >
                </CraftParameters>

                <div 
                    className="w-full flex flex-row justify-between sm:justify-center align-center my-2 grow"
                    >
                    { 
                        !isEffortDone && <>
                            <div className="hidden sm:block grow w-[64px]"></div>
                            <Button 
                                variant="text"
                                className="mx-2 p-2 md:px-8 md:py-3"
                                onClick={() => doWork(-1)}
                            >
                                <UndoIcon color="info" fontSize="large"></UndoIcon>
                            </Button>
                            <Button 
                                className="mx-2 p-2 md:px-8 md:py-3"
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
                                className="mx-2 p-2 md:px-8 md:py-3"
                                onClick={() => doWork(1)}
                            >
                                <RedoIcon color="info" fontSize="large"></RedoIcon>
                            </Button>
                        </> 
                    }
                    
                    <div className={clsx("sm:grow w-[64px] flex align-center", isEffortDone ? "grow" : "justify-end")}>
                        <Button 
                            className={isEffortDone ? "mx-auto" : "mx-2"}
                            variant="text"
                            onClick={restart}
                        >
                            <RestartAltIcon color="warning" sx={{ fontSize: 48 }}></RestartAltIcon>
                            
                        </Button>
                    </div>
                </div>

                
            </div>

            <ProgressBar key="stamina" 
                className="my-4"
                current={ currentStamina } 
                max={ armor?.stamina ?? 100 }>
            </ProgressBar>

            <StaminaStatistics staminaStats={workProgressStats.staminaStats}></StaminaStatistics>

            <ProgressBar key="effort" 
                className="my-4"
                current={ currentEffort } 
                max={ fullEffort } 
                barColor="var(--effort)">
                
            </ProgressBar>
            
            <ProjectStatistics projectStats={workProgressStats.projectStats}></ProjectStatistics>
        </div>
    );
}
 
 
