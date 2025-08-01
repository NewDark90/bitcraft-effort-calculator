import Image from "next/image";
import SquareIcon from '@mui/icons-material/Square';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import Link from 'next/link'

export type SkillArmorButtonProps = { interval: number, energy: number };

export default function SkillArmorButton(
    { interval, energy }: SkillArmorButtonProps
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
            href="/armor-select"
            rel="noopener noreferrer"
        >
            <span className="w-full">
                Armor Power
            </span>


            <div className="grow flex justify-center items-center"> 
                <Image
                    aria-hidden
                    className="invert-0 dark:invert"
                    src={`/skills/other/interval.svg`}
                    alt={`Interval icon`}
                    width={ 24 }
                    height={ 24 }
                />
                <span className="mx-2"
                >
                    {interval}
                </span>
            </div>

            <div className="grow flex justify-center items-center">
                <ElectricBoltIcon htmlColor="var(--energy, yellow)"></ElectricBoltIcon>
                {/*<SquareIcon htmlColor="var(--energy, yellow)" className="bg-white" viewBox="2 2 20 20"></SquareIcon>*/}
                <span className="mx-2"
                >
                    {energy}
                </span>
            </div>
           
        </Link>
    );
}
 
 
