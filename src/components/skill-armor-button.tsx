import Image from "next/image";
import SquareIcon from '@mui/icons-material/Square';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import Link from 'next/link'
import ButtonLink from "@/components/common/button-link";

export type SkillArmorButtonProps = { interval: number, energy: number };

export default function SkillArmorButton(
    { interval, energy }: SkillArmorButtonProps
) {

    const iconSize = 32;

    const buttonClasses = "flex flex-wrap items-center justify-evenly";

    return (
        <ButtonLink
            href="/armor-select"
            rel="noopener noreferrer"
            className={buttonClasses}
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
                <span className="mx-2">
                    {interval}
                </span>
            </div>

            <div className="grow flex justify-center items-center">
                <ElectricBoltIcon htmlColor="var(--energy, yellow)"></ElectricBoltIcon>
                {/*<SquareIcon htmlColor="var(--energy, yellow)" className="bg-white" viewBox="2 2 20 20"></SquareIcon>*/}
                <span className="mx-2">
                    {energy}
                </span>
            </div>
           
        </ButtonLink>
    );
}
 
 
