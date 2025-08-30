import Image from "next/image";
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import ButtonLink from "@/components/common/button-link";
import SkillIcon from "@/components/skill-icon";
import { ArmorEntity } from "@/database/entities";
import AutorenewIcon from '@mui/icons-material/Autorenew';

export type ArmorSelectButtonProps = { 
    armor?: ArmorEntity,
};

export default function ArmorSelectButton(
    { armor }: ArmorSelectButtonProps
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

            <span className="w-full">
                { armor?.name }
            </span>


            <div className="grow flex justify-center items-center">
                <ElectricBoltIcon htmlColor="var(--energy, yellow)"></ElectricBoltIcon>
                <span className="mx-2">
                    {armor?.stamina ?? 0}
                </span>
            </div>

            <div className="grow flex justify-center items-center"> 
                <SkillIcon 
                    folder="/other" 
                    name="Interval" 
                    size={24}
                    className="invert-0 dark:invert inline-block"
                ></SkillIcon>
                <span className="mx-2">
                    {armor?.interval ?? 0}
                </span>
            </div>

            <div className="grow flex justify-center items-center">
                <AutorenewIcon htmlColor="var(--energy, yellow)"></AutorenewIcon>
                <span className="mx-2">
                    {armor?.regenPerSecond ?? 0}
                </span>
            </div>
           
        </ButtonLink>
    );
}
 
 
