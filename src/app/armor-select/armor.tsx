'use client'

import NumberInput from "@/components/common/number-input";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckIcon from '@mui/icons-material/Check';
import { ArmorEntity } from "@/database/entities";
import { Button, TextField } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import SkillIcon from "@/components/skill-icon";
import AutorenewIcon from '@mui/icons-material/Autorenew';


export type ArmorProps = { 
    armor: ArmorEntity;
    className?: string;
    onArmorChange?: (armor: ArmorEntity) => void;
    onArmorSelect?: (armor: ArmorEntity) => void;
    onArmorDelete?: (armor: ArmorEntity) => void;
};

export default function Armor(
    { armor, className, onArmorChange, onArmorSelect, onArmorDelete }: ArmorProps
) {
    let wrapperClass = `flex flex-row text-center items-center w-full [&>*]:mx-2 ${className}`;
    const selectedClass = `text-green-500`;

    return (
        <div className={ wrapperClass }>
            
            <Button variant="outlined"
                size="large"
                className="self-stretch"
                color={ armor.selected ? "success" : "inherit" }
                onClick={() => onArmorSelect?.(armor)}
            >
                {
                    armor.selected
                        ? <CheckIcon fontSize={"medium"} className={armor.selected ? selectedClass : ""} />
                        : <RadioButtonUncheckedIcon fontSize={"medium"} /> /*<span className={`w-[24px] block`}></span>*/
                }
            </Button>
                
            <TextField 
                label="Armor Name" 
                variant="standard" 
                className={armor.selected ? selectedClass : ""}
                value={armor.name}
                onChange={(event) => {
                    onArmorChange?.({...armor, name: event.target.value});
                }}
            />

            <NumberInput 
                className="my-2"
                value={armor.stamina}
                label={
                    <>
                        <ElectricBoltIcon className="mx-1" htmlColor="var(--energy, yellow)" />
                        <span className="mx-1">Stamina</span>
                    </>
                }
                step={1}
                min={0}
                onValueChange={(stamina) => {
                    onArmorChange?.({...armor, stamina: stamina ?? armor.stamina});
                }}
            >
            </NumberInput>

            <NumberInput 
                className="my-2"
                value={armor.interval} 
                label={
                    <>
                        <SkillIcon 
                            folder="/other" 
                            name="Interval" 
                            size={24}
                            className="invert-0 dark:invert inline-block mx-1"
                        ></SkillIcon>
                        <span className="mx-1">Interval</span>
                    </>
                }
                step={0.01}
                min={0.01}
                format={{
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }}
                onValueChange={(interval) => {
                    onArmorChange?.({...armor, interval: interval ?? armor.interval});
                }}
            >
            </NumberInput>

            <NumberInput 
                className="my-2"
                value={armor.regenPerSecond} 
                label={
                    <>
                        <AutorenewIcon className="mx-1" htmlColor="var(--energy, yellow)" />
                        <span className="mx-1">Stamina Regen</span>
                    </>
                }
                step={1}
                min={0}
                onValueChange={(regenPerSecond) => {
                    onArmorChange?.({...armor, regenPerSecond: regenPerSecond ?? armor.regenPerSecond});
                }}
            >

            </NumberInput>

            <Button 
                variant="outlined" 
                color="error"
                className="my-2 self-end" 
                startIcon={<DeleteForeverIcon />}
                onClick={() => onArmorDelete?.(armor)}
            >
                Delete
            </Button>
        </div>
    );
}
