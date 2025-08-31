import Image from "next/image";
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import NumberInput from "@/components/common/number-input";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { CraftingType, craftingTypeMap, craftingTypes } from "@/config/crafting-types";
import React from "react";

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
        <div  className="w-full">
            <h2 className="w-full">
                Craft
            </h2>
            
            <NumberInput 
                label="Effort" 
                value={effort}
                step={0}
                min={0}
                onValueChange={effortChangeHandler}
            >
            </NumberInput>

            <FormControl sx={{ m: 1, minWidth: 80 }}>
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
                                {type.name}
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
        </div>
    );
}
