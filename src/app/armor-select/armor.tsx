'use client'

import NumberInput from "@/components/common/number-input";
import { useState } from "react";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckIcon from '@mui/icons-material/Check';
import { ArmorDetail, armorService } from "@/services/armor-service";
import { ArmorEntity } from "@/database/entities";
import { Button, TextField } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import SkillIcon from "@/components/skill-icon";


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

    let wrapperClass = `flex flex-row text-center items-center justify-center w-full [&>*]:mx-2 ${className}`;
    const selectedClass = `text-green-500`;

    return (
        <div className={ wrapperClass }>
            
            <Button variant="outlined"
                size="large"
                color={ armor.selected ? "success" : "inherit" }
                onClick={() => updateSelectedArmor(armor)}
            >
                {
                    armor.selected
                        ? <CheckIcon fontSize={"small"} className={armor.selected ? selectedClass : ""} />
                        : <CheckBoxOutlineBlankIcon fontSize={"small"} /> /*<span className={`w-[24px] block`}></span>*/
                }
            </Button>
                
            <TextField 
                label="Armor Name" 
                variant="standard" 
                className={armor.selected ? selectedClass : ""}
                value={armorName}
                onChange={(event) => {
                    armor.name = event.target.value;
                    setArmorName(armor.name);
                    onArmorChange?.(armor);
                }} />

            <NumberInput 
                className="my-2"
                value={armor.energy}
                label={
                    <span>
                        <ElectricBoltIcon htmlColor="var(--energy, yellow)"></ElectricBoltIcon>
                        Energy
                    </span>
                }
                step={1}
                onValueChange={() => {}}>

            </NumberInput>

            <NumberInput 
                className="my-2"
                value={armor.interval} 
                label={
                    <span>
                        <SkillIcon 
                            folder="/other" 
                            name="Interval" 
                            size={24}
                            className="invert-0 dark:invert inline-block"
                        ></SkillIcon>
                        Interval
                    </span>
                }
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
                label={
                    <span>
                        <ElectricBoltIcon htmlColor="var(--energy, yellow)"></ElectricBoltIcon>
                        Regeneration
                    </span>
                }
                step={1}
                onValueChange={() => {}}>

            </NumberInput>

            <Button 
                variant="outlined" 
                color="error"
                className="my-2 self-end" 
                startIcon={<DeleteForeverIcon />}
                >
                Delete
            </Button>
        </div>
    );
}
