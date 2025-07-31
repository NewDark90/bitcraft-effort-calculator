import SkillIcon from "@/components/skill-icon";
import Image from "next/image";
import { TextField } from "@mui/material";

export type SkillSelectButtonProps = { power: number, skill: string };

export default function SkillSelectButton(
    { power, skill }: SkillSelectButtonProps
) {

    const iconSize = 32;
    const flexClasses = "flex items-center justify-evenly ";
    const buttonClass = "rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors " + 
        "hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px] " + 
        flexClasses;

    return (
        <a
            className={buttonClass}
            href="/skill-select"
            rel="noopener noreferrer"
        >
            <Image
                aria-hidden
                className="invert-0 dark:invert"
                src={`/skills/other/power.svg`}
                alt={`Power icon`}
                width={ iconSize }
                height={ iconSize }
            />
            <span 
            >
                {power}
            </span>
            <SkillIcon name={ skill } size={ iconSize }></SkillIcon>
        </a>
    );
}
 
 
