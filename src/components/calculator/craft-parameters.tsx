import Image from "next/image";
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import NumberInput from "@/components/common/number-input";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { CraftingTier, craftingTierMap, craftingTiers } from "@/config/crafting-tiers";
import React from "react";
import SquareIcon from '@mui/icons-material/Square';
import clsx from "clsx";
import { TierNumber } from "@/config/tier";
import { craftingTypes } from "@/config/crafting-types";

export type CraftParametersProps = { 
    fullEffort: number;
    currentEffort: number;
    craftType: CraftingTier;

    isWorking: boolean;
    power?: number;

    className?: string;

    onFullEffortChange: (effort: number) => void;
    onCurrentEffortChange: (effort: number) => void;
    onCraftTypeChange: (craftType: CraftingTier) => void;
};

export default function CraftParameters(
    { 
        fullEffort, 
        currentEffort, 
        craftType, 
        power,
        isWorking,
        className,
        onCurrentEffortChange, 
        onFullEffortChange, 
        onCraftTypeChange 
    }: CraftParametersProps
) {
    const id = React.useId();

    const effortChangeHandler = (
        effort: number | null, 
        changeHandler: (effort: number) => void
    ) => {
        if (effort == null) {
            return;
        }
        changeHandler(effort);
    }

    const craftingTierChangeHandler = (event: SelectChangeEvent) => {
        const type = craftingTierMap.get(parseInt(event.target.value) as TierNumber);
        if (type == null) {
            return;
        }
        onCraftTypeChange(type);
    }

    return (
        <div className={clsx("flex flex-wrap items-end justify-center my-2", className)}>
            
            <div className="flex justify-center items-end">
                <NumberInput 
                    className="mx-4"
                    label="Effort Progress" 
                    value={currentEffort}
                    step={ 0 }
                    min={ 0 }
                    max={ fullEffort }
                    readOnly={ isWorking }
                    onValueChange={(effort) => effortChangeHandler(effort, onCurrentEffortChange)}
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
                    onValueChange={(effort) => effortChangeHandler(effort, onFullEffortChange)}
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
                    value={craftType.name}
                    onChange={ }
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

            <FormControl 
                sx={{ minWidth: 80 }}
                className="mx-4"
                >
                <InputLabel id={`crafting-tier-label-${id}`}>
                    {label}
                </InputLabel>
                <Select
                    labelId={`crafting-tier-label-${id}`}
                    label={label}
                    value={craftType.name}
                    onChange={craftingTierChangeHandler}
                >
                    {
                        craftingTiers.map(type => (
                            <MenuItem
                                value={type.name}
                                key={type.name}
                            >
                                { type.name }
                                &nbsp;
                                { type.color && <SquareIcon htmlColor={type.color}></SquareIcon> }
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
        </div>
    );
}
