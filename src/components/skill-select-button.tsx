import ButtonLink from "@/components/common/button-link";
import SkillIcon from "@/components/skill-icon";
import Image from "next/image";

export type SkillSelectButtonProps = { power: number, skill: string };

export default function SkillSelectButton(
    { power, skill }: SkillSelectButtonProps
) {

    const iconSize = 32;

    return (
        <ButtonLink
            href="/skill-select"
            rel="noopener noreferrer"
        >
            <span className="w-full">
                Tool Power
            </span>
            <Image
                aria-hidden
                className="invert-0 dark:invert -scale-x-100"
                src={`/skills/other/power.svg`}
                alt={`Power icon`}
                width={ 24 }
                height={ 24 }
            />
            <span className="mx-2"
            >
                {power}
            </span>
            <SkillIcon name={ skill } size={ iconSize }></SkillIcon>
        </ButtonLink>
    );
}
 
 
