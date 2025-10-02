import Image from "next/image";
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import NumberInput from "@/components/common/number-input";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { CraftingType, craftingTypeMap, craftingTypes } from "@/config/crafting-types";
import React from "react";
import SquareIcon from '@mui/icons-material/Square';
import clsx from "clsx";

export type CraftParametersProps = { 
    fullEffort: number;
    currentEffort: number;
    craftType: CraftingType;

    isWorking: boolean;
    power?: number;

    className?: string;

    onFullEffortChange: (effort: number) => void;
    onCurrentEffortChange: (effort: number) => void;
    onCraftTypeChange: (craftType: CraftingType) => void;
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
    const label = "Type";

    const effortChangeHandler = (
        effort: number | null, 
        changeHandler: (effort: number) => void
    ) => {
        if (effort == null) {
            return;
        }
        changeHandler(effort);
    }

    const craftingTypeChangeHandler = (event: SelectChangeEvent) => {
        const type = craftingTypeMap.get(event.target.value as string);
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
                    {label}
                </InputLabel>
                <Select
                    labelId={`crafting-type-label-${id}`}
                    label={label}
                    value={craftType.name}
                    onChange={craftingTypeChangeHandler}
                >
                    {
                        craftingTypes.map(type => (
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
