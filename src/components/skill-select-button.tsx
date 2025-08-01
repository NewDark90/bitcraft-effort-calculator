import SkillIcon from "@/components/skill-icon";
import Image from "next/image";
import Link from "next/link";

export type SkillSelectButtonProps = { power: number, skill: string };

export default function SkillSelectButton(
    { power, skill }: SkillSelectButtonProps
) {

    const iconSize = 32;
    
    const flexClasses = "flex flex-wrap items-center justify-evenly";
    const textClasses = "text-center font-medium text-sm sm:text-base";
    const sizeClasses = "h-18 sm:h-22 px-4 py-1 sm:px-5 sm:py-2"; //w-full sm:w-auto md:w-[188px]

    const buttonClasses = "rounded-xl border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent";

    const allClasses = [
        flexClasses,
        textClasses,
        sizeClasses,
        buttonClasses
    ].join(" ");

    return (
        <Link
            className={allClasses}
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
        </Link>
    );
}
 
 
