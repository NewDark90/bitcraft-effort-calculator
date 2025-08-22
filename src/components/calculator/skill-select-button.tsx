import ButtonLink from "@/components/common/button-link";
import SkillIcon from "@/components/skill-icon";
import { SkillEntity } from "@/database/entities";
import Image from "next/image";

export type SkillSelectButtonProps = { skill?: SkillEntity };

export default function SkillSelectButton(
    { skill }: SkillSelectButtonProps
) {

    const iconSize = 32;
    
    const buttonClasses = "flex flex-wrap items-center justify-evenly";

    return (
        <ButtonLink
            href="/skill-select"
            rel="noopener noreferrer"
            className={buttonClasses}
        >
            <span className="w-full">
                Tool Power
            </span>
            
            <div className="grow flex justify-center items-center">
                <Image
                    aria-hidden
                    className="invert-0 dark:invert -scale-x-100"
                    src={`/skills/other/power.svg`}
                    alt={`Power icon`}
                    width={ 24 }
                    height={ 24 }
                />
                <span className="mx-2">{skill?.power ?? 0}</span>
            </div>

            <div className="grow flex justify-center items-center">
                <SkillIcon 
                    name={ skill?.name } 
                    size={ iconSize } 
                ></SkillIcon>
                <span className="mx-2">{skill?.name ?? "[Select Skill]"}</span>
            </div>
        </ButtonLink>
    );
}
 
 
