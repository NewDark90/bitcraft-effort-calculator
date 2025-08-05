'use client'

import NumberInput from "@/components/number-input";
import SkillIcon from "@/components/skill-icon";
import { skills } from "@/config/skills";
import { SkillService } from "@/services/skill-service";
import NoSsr from '@mui/material/NoSsr';
import Image from "next/image";
import { useState } from "react";

export type SkillProps = { name: string, className?: string };

const skillService = new SkillService();

export default function Skill(
    { name, className }: SkillProps
) {

    const [power, setPower] = useState(() => skillService.getSkillPower(name));

    const updatePower = (powerNum: number | null) => {
        if (powerNum) {
            setPower(powerNum);
            skillService.setSkillPower(name, powerNum);
        }
    }

    return (
        <div className={`flex flex-col text-center items-center ${className}` }>
            <div className="flex flex-row items-center justify-evenly [&>*]:mx-2">
                <SkillIcon name={ name } size={ 32 }></SkillIcon>
                <span>{ name }</span>
            </div>

            <NumberInput 
                className="my-2"
                value={power} 
                onInput={updatePower}>

            </NumberInput>
        </div>
    );
}
