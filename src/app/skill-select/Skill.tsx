'use client'

import NumberInput from "@/components/common/number-input";
import SkillIcon from "@/components/skill-icon";
import { skillService } from "@/services/skill-service";
import { useState } from "react";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckIcon from '@mui/icons-material/Check';
import { SkillEntity } from "@/database/entities";


export type SkillProps = { 
    skill: SkillEntity;
    className?: string;
    onSelectedSkillChange?: (skill: SkillEntity) => void;
};

export default function Skill(
    { skill, className, onSelectedSkillChange }: SkillProps
) {

    const updatePower = (powerNum: number | null) => {
        if (powerNum) {
            skill.power = powerNum;
            skillService.setSkill(skill, skill.id);
        }
    }

    const updateSelectedSkill = async (skill: SkillEntity | undefined) => {
        if (skill) {
            await skillService.setSelectedSkill(skill);
        }
    }

    let wrapperClass = `flex flex-col text-center items-center ${className}`;
    const selectedClass = `text-green-500`;

    return (
        <div className={ wrapperClass }>
            <div className="flex flex-row items-center justify-evenly [&>*]:mx-1 mx-2 cursor-pointer"
                onClick={() => updateSelectedSkill(skill)}>
                <SkillIcon name={ skill.name } size={ 32 }></SkillIcon>
                <span className={skill.selected ? selectedClass : ""}>
                    { skill.name }
                </span>
                {
                    skill.selected 
                        ? <CheckIcon fontSize={"small"} className={skill.selected ? selectedClass : ""} />
                        : <CheckBoxOutlineBlankIcon fontSize={"small"} /> /*<span className={`w-[24px] block`}></span>*/
                }
            </div>

            <NumberInput 
                className="my-2"
                value={skill.power} 
                onValueChange={updatePower}>

            </NumberInput>
        </div>
    );
}
