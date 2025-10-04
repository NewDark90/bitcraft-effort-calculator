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
    let buttonTitle = `Armor`;
    if (armor?.name) {
        buttonTitle += ` - ${armor?.name}`
    }

    return (
        <ButtonLink
            href="/armor-select"
            rel="noopener noreferrer"
            className="flex flex-row flex-wrap items-center justify-evenly"
        >
            <span className="w-full mb-2 text-lg font-bold">
                {buttonTitle}
            </span>


            <span className="flex justify-center items-center">
                <ElectricBoltIcon htmlColor="var(--energy, yellow)"></ElectricBoltIcon>
                <span className="mx-2">
                    {armor?.stamina ?? 0}
                </span>
            </span>

            <span className="flex flex-col justify-center items-center"> 
                <span>
                    Gather
                </span>
                <span className="mx-2">
                    {armor?.gatherBonus ?? 0}%
                </span>
            </span>

            <span className="flex flex-col justify-center items-center"> 
                <span>
                    Craft
                </span>
                <span className="mx-2">
                    {armor?.craftBonus ?? 0}%
                </span>
            </span>

            <span className="flex flex-col justify-center items-center"> 
                <span>
                    Build
                </span>
                <span className="mx-2">
                    {armor?.buildBonus ?? 0}%
                </span>
            </span>
           
        </ButtonLink>
    );
}
 
 
