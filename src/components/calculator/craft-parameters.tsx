import Image from "next/image";
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import NumberInput from "@/components/common/number-input";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Tooltip } from "@mui/material";
import { useState } from "react";
import { CraftingTier, craftingTierMap, craftingTiers } from "@/config/crafting-tiers";
import React from "react";
import SquareIcon from '@mui/icons-material/Square';
import clsx from "clsx";
import { TierNumber } from "@/config/tier";
import { craftingTypes, CraftingTypeSlug } from "@/config/crafting-types";
import TierSelector from "@/components/tier-selector";
import SkillIcon from "@/components/skill-icon";
import { WorkInterval } from "@/config/work-intervals";

export type CraftParametersProps = { 
    fullEffort: number;
    currentEffort: number;
    craftType: CraftingTypeSlug;
    craftingTier: TierNumber;
    workInterval: WorkInterval;
    isWorking: boolean;

    className?: string;

    onFullEffortChange: (effort: number) => void;
    onCurrentEffortChange: (effort: number) => void;
    onCraftTypeChange: (craftType: CraftingTypeSlug) => void;
    onCraftTierChange: (craftType: TierNumber) => void;
};

export default function CraftParameters(
    { 
        fullEffort, 
        currentEffort, 
        craftType, 
        craftingTier,
        workInterval,
        isWorking,
        className,
        onCurrentEffortChange, 
        onFullEffortChange, 
        onCraftTypeChange,
        onCraftTierChange
    }: CraftParametersProps
) {
    const id = React.useId();

    return (
        <div className={clsx("flex flex-wrap items-end justify-center my-2 [&>*]:my-2", className)}>
            
            <div className="flex justify-center items-end">
                <NumberInput 
                    className="mx-4"
                    label="Effort Progress" 
                    value={currentEffort}
                    step={ 0 }
                    min={ 0 }
                    max={ fullEffort }
                    readOnly={ isWorking }
                    onValueChange={(effort) => {
                        if (effort == null) 
                            return;
                        onCurrentEffortChange(effort);
                    }}
                >
                </NumberInput>
                <span className="font-extrabold text-2xl my-1">/</span>
                <NumberInput 
                    className="mx-4"
                    label="Effort Total" 
                    value={fullEffort}
                    step={ 0 }
                    min={ 0 }
                    readOnly={ isWorking }
                    onValueChange={(effort) => {
                        if (effort == null) 
                            return;
                        onFullEffortChange(effort);
                    }}
                >
                </NumberInput>
            </div>

            <FormControl 
                sx={{ minWidth: 80 }}
                className="mx-4"
                >
                <InputLabel id={`crafting-type-label-${id}`}>
                    Type
                </InputLabel>
                <Select
                    labelId={`crafting-type-label-${id}`}
                    label={"Type"}
                    value={craftType}
                    onChange={(event) => {
                        const type = event.target.value as CraftingTypeSlug;
                        if (type == null) {
                            return;
                        }
                        onCraftTypeChange(type);
                    }}
                >
                    {
                        craftingTypes.map(type => (
                            <MenuItem
                                value={type.slug}
                                key={type.slug}
                            >
                                { type.name }
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>

            {
                (craftType == "gather" || craftType == "craft") 
                &&
                <TierSelector 
                    tier={craftingTier}
                    onTierChange={(tier) => {
                        onCraftTierChange(tier);
                    }}
                    >

                </TierSelector>
            } 

            <Tooltip title={
                <div className="text-base text-center">
                    <span>Interval may not perfectly match the game speed due to network round trips. If the timing is off, try changing the "network delay" setting.</span>
                </div>
            }>
                <div className="flex flex-row flex-wrap item-center justify-center text-center self-center">
                    <span className="w-full">Interval</span>
                    <SkillIcon
                        folder="/other"
                        name="interval"
                        size={24}
                        className="invert-0 dark:invert inline-block"
                    ></SkillIcon>
                    <span className="m-2">{(workInterval.effective).toFixed(2)}</span>
                </div>
            </Tooltip>

            
        </div>
    );
}
