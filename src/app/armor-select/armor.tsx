'use client'

import NumberInput from "@/components/common/number-input";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckIcon from '@mui/icons-material/Check';
import { ArmorEntity } from "@/database/tables";
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
                    if (stamina == null) 
                        return;
                    onArmorChange?.({...armor, stamina: stamina });
                }}
            >
            </NumberInput>

            <NumberInput 
                className="my-2"
                value={(armor.gatherBonus ?? 0) * 100} 
                label={
                    <span className="mx-1">Gather Bonus %</span>
                }
                step={1}
                min={0.01}
                format={{
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                }}
                onValueChange={(gatherBonusPercent) => {
                    if (gatherBonusPercent == null) 
                        return;
                    onArmorChange?.({...armor, gatherBonus: gatherBonusPercent / 100 });
                }}
            >
            </NumberInput>

            <NumberInput 
                className="my-2"
                value={(armor.craftBonus ?? 0) * 100} 
                label={
                    <span className="mx-1">Craft Bonus %</span>
                }
                step={1}
                min={0.01}
                format={{
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                }}
                onValueChange={(craftBonusPercent) => {
                    if (craftBonusPercent == null) 
                        return;
                    onArmorChange?.({...armor, craftBonus: craftBonusPercent / 100 });
                }}
            >
            </NumberInput>

            <NumberInput 
                className="my-2"
                value={(armor.buildBonus ?? 0) * 100} 
                label={
                    <span className="mx-1">Build Bonus %</span>
                }
                step={1}
                min={0.01}
                format={{
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                }}
                onValueChange={(buildBonusPercent) => {
                    if (buildBonusPercent == null) 
                        return;
                    onArmorChange?.({...armor, buildBonus: buildBonusPercent / 100 });
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
