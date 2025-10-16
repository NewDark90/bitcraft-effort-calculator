import ButtonLink from "@/components/common/button-link";
import SkillIcon from "@/components/skill-icon";
import { SkillEntity } from "@/database/tables";

export type SkillSelectButtonProps = { skill?: SkillEntity };

export default function SkillSelectButton(
    { skill }: SkillSelectButtonProps
) {

    const iconSize = 32;

    return (
        <ButtonLink
            href="/skill-select"
            rel="noopener noreferrer"
            className="flex flex-wrap items-center justify-evenly"
        >
            <span className="w-full mb-2 text-lg font-bold">
                Skill
            </span>
            
            <span className="flex justify-center items-center">
                <SkillIcon 
                    className="invert-0 dark:invert -scale-x-100"
                    name={ "Power" } 
                    size={ iconSize } 
                    folder="/other"

                ></SkillIcon>
                <span className="mx-2">{skill?.power ?? 0}</span>
            </span>

            <span className="flex justify-center items-center">
                <SkillIcon 
                    name={ skill?.name } 
                    size={ iconSize } 
                ></SkillIcon>
                <span className="mx-2">{skill?.name ?? "[Select Skill]"}</span>
            </span>
        </ButtonLink>
    );
}
 
 
