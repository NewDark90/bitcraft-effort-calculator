'use client'

import NumberInput from "@/components/common/number-input";
import SkillIcon from "@/components/skill-icon";
import { SkillService } from "@/services/skill-service";
import { useState } from "react";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckIcon from '@mui/icons-material/Check';


export type SkillProps = { 
    name: string;
    selectedSkill: string | null;
    className?: string;
    onSelectedSkillChange?: (skill: string | null) => void;
};

const skillService = new SkillService();

export default function Skill(
    { name, className, selectedSkill, onSelectedSkillChange }: SkillProps
) {

    const [power, setPower] = useState(() => skillService.getSkillPower(name));
    const updatePower = (powerNum: number | null) => {
        if (powerNum) {
            setPower(powerNum);
            skillService.setSkillPower(name, powerNum);
        }
    }

    let wrapperClass = `flex flex-col text-center items-center ${className}`;
    const isSelected = (name == selectedSkill);
    const selectedClass = `text-green-500`;

    return (
        <div className={ wrapperClass }>
            <div className="flex flex-row items-center justify-evenly [&>*]:mx-1 mx-2 cursor-pointer"
                onClick={() => onSelectedSkillChange?.(name)}>
                <SkillIcon name={ name } size={ 32 }></SkillIcon>
                <span className={isSelected ? selectedClass : ""}>
                    { name }
                </span>
                {
                    name == selectedSkill 
                        ? <CheckIcon fontSize={"small"} className={isSelected ? selectedClass : ""} />
                        : <CheckBoxOutlineBlankIcon fontSize={"small"} /> /*<span className={`w-[24px] block`}></span>*/
                }
            </div>

            <NumberInput 
                className="my-2"
                value={power} 
                onInput={updatePower}>

            </NumberInput>
        </div>
    );
}
