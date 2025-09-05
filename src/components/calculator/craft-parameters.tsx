import Image from "next/image";
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import NumberInput from "@/components/common/number-input";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { CraftingType, craftingTypeMap, craftingTypes } from "@/config/crafting-types";
import React from "react";
import SquareIcon from '@mui/icons-material/Square';

export type SkillIconProps = { 
    effort: number;
    craftType: CraftingType;

    onEffortChange: (effort: number) => void;
    onCraftTypeChange: (craftType: CraftingType) => void;
};

export default function CraftParameters(
    { effort, craftType, onEffortChange, onCraftTypeChange }: SkillIconProps
) {
    const id = React.useId();
    const label = "Type";

    const effortChangeHandler = (effort: number | null) => {
        if (effort == null) {
            return;
        }
        onEffortChange(effort);
    }

    const craftingTypeChangeHandler = (event: SelectChangeEvent) => {
        const type = craftingTypeMap.get(event.target.value as string);
        if (type == null) {
            return;
        }
        onCraftTypeChange(type);
    }

    return (
        <div className="flex flex-wrap items-end justify-center my-2">
            
            <NumberInput 
                className="mx-4"
                label="Effort" 
                value={effort}
                step={0}
                min={0}
                onValueChange={effortChangeHandler}
            >
            </NumberInput>

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
