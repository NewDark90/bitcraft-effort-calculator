'use client'

import NumberInput from "@/components/common/number-input";
import SkillIcon from "@/components/skill-icon";
import { useState } from "react";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckIcon from '@mui/icons-material/Check';
import { ArmorDetail, armorService } from "@/services/armor-service";
import { ArmorEntity } from "@/database/entities";
import { useLiveQuery } from "dexie-react-hooks";
import { Button, TextField } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';


export type ArmorProps = { 
    armor: ArmorEntity;
    className?: string;
    onArmorChange?: (armor: ArmorDetail) => void;
};

export default function Armor(
    { armor, className, onArmorChange }: ArmorProps
) {

    const [armorName, setArmorName] = useState(armor.name);
    /*
    const [armorDetail, setArmorDetail] = useState(() => armorService.getArmorDetail(index));
    const updateArmorDetail = (detail: ArmorDetail | null) => {
        
        if (index == selectedIndex && detail == null) {
            // Don't delete a selected armor set.
            return; 
        }

        setArmorDetail(detail);
        armorService.setArmorDetail(index, detail);
    }
    */

    const updateSelectedArmor = async (armor: ArmorEntity | undefined) => {
        if (armor) {
            await armorService.setSelectedArmor(armor);
        }
    }

    let wrapperClass = `flex flex-col text-center items-center ${className}`;
    const selectedClass = `text-green-500`;

    return (
        <div className={ wrapperClass }>
            <div className="flex flex-row items-center justify-evenly [&>*]:mx-1 mx-2 cursor-pointer"
                onClick={() => updateSelectedArmor(armor)}>
                <span className={armor.selected ? selectedClass : ""}>
                    { armor.name }
                </span>
                {
                    armor.selected
                        ? <CheckIcon fontSize={"small"} className={armor.selected ? selectedClass : ""} />
                        : <CheckBoxOutlineBlankIcon fontSize={"small"} /> /*<span className={`w-[24px] block`}></span>*/
                }
                
                <TextField 
                    label="Armor Name" 
                    variant="standard" 
                    className={armor.selected ? selectedClass : ""}
                    defaultValue={armorName} 
                    onChange={(event) => {
                        armor.name = event.target.value;
                        setArmorName(armor.name);
                        onArmorChange?.(armor);
                    }} />
            </div>

            <NumberInput 
                className="my-2"
                value={armor.energy}
                label="Energy"
                step={1}
                onValueChange={() => {}}>

            </NumberInput>

            <NumberInput 
                className="my-2"
                value={armor.interval} 
                label="Interval"
                step={0.01}
                format={{
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }}
                onValueChange={() => {}}>

            </NumberInput>

            <NumberInput 
                className="my-2"
                value={armor.regenPerSecond} 
                label="Energy Regen"
                step={1}
                onValueChange={() => {}}>

            </NumberInput>

            <Button variant="outlined" color="error" startIcon={<DeleteForeverIcon />}>
                Delete
            </Button>
        </div>
    );
}
