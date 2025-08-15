import Image from "next/image";
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import ButtonLink from "@/components/common/button-link";
import SkillIcon from "@/components/skill-icon";

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
                <SkillIcon 
                    folder="/other" 
                    name="Interval" 
                    size={24}
                    className="invert-0 dark:invert inline-block"
                ></SkillIcon>
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
 
 
