import NumberInput from "@/components/common/number-input";
import { Button, FormControl, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import React from "react";
import clsx from "clsx";
import { TierNumber } from "@/config/tier";
import { craftingTypes, CraftingTypeSlug } from "@/config/crafting-types";
import TierSelector from "@/components/tier-selector";
import SkillIcon from "@/components/skill-icon";
import { WorkInterval } from "@/config/work-intervals";
import CalculateIcon from '@mui/icons-material/Calculate';
import EditIcon from '@mui/icons-material/Edit';


export type CraftParametersProps = { 
    fullEffort: number;
    currentEffort: number;
    craftType: CraftingTypeSlug;
    craftingTier: TierNumber;
    workInterval: WorkInterval;
    isIntervalOverride: boolean;
    isWorking: boolean;

    className?: string;

    onFullEffortChange: (effort: number) => void;
    onCurrentEffortChange: (effort: number) => void;
    onCraftTypeChange: (craftType: CraftingTypeSlug) => void;
    onCraftTierChange: (craftType: TierNumber) => void;
    onIsIntervalOverrideChange: (isManual: boolean) => void;
    onManualIntervalChange: (interval: number) => void;
};

export default function CraftParameters(
    { 
        fullEffort, 
        currentEffort, 
        craftType, 
        craftingTier,
        workInterval,
        isWorking,
        isIntervalOverride,

        className,

        onCurrentEffortChange, 
        onFullEffortChange, 
        onCraftTypeChange,
        onCraftTierChange,
        onIsIntervalOverrideChange,
        onManualIntervalChange,
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

            <div className="flex flex-row flex-wrap item-center justify-center text-center self-center">
                
                <div className="w-full">
                    <Tooltip placement="top"  title={
                        <div className="text-base text-center">
                            <span>Interval may not perfectly match the game speed due to network round trips. If the timing is off, try changing the &quot;network delay&quot; setting.</span>
                        </div>
                    }>
                        <div>
                            <SkillIcon
                                folder="/other"
                                name="interval"
                                size={24}
                                className="invert-0 dark:invert inline-block"
                            ></SkillIcon>
                            Interval  
                            <span className="text-xs mx-2">{isIntervalOverride ? "[Manual]" : "[Calculated]" }</span>
                        </div>
                    </Tooltip>
                </div>
                <Tooltip placement="top" title={
                        <div className="text-base text-center">
                            <span>Toggle: {isIntervalOverride ? "Calculated Mode" : "Edit Mode" } </span>
                        </div>
                    }>
                    <Button
                        className="min-w-[32px]"
                        onClick={() => { onIsIntervalOverrideChange(!isIntervalOverride) }}>
                            {
                                isIntervalOverride 
                                    ? <CalculateIcon></CalculateIcon>
                                    : <EditIcon></EditIcon>
                            }
                    </Button>
                </Tooltip>
                
                <NumberInput 
                    className="my-2"
                    value={workInterval.effective} 
                    readOnly={!isIntervalOverride}
                    step={0}
                    min={0.01}
                    format={{
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2
                    }}
                    onValueChange={(interval) => {
                        if (!interval)
                            return;

                        onManualIntervalChange(interval);
                    }}
                >
                </NumberInput>
            </div>

        </div>
    );
}
