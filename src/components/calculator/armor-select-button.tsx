import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import ButtonLink from "@/components/common/button-link";
import { ArmorEntity } from "@/database/tables";
import { CraftingTypeSlug } from '@/config/crafting-types';
import { useTheme } from '@mui/material/styles';

export type ArmorSelectButtonProps = { 
    armor?: ArmorEntity,
    craftType?: CraftingTypeSlug;
};

export default function ArmorSelectButton(
    { armor, craftType }: ArmorSelectButtonProps
) {

    const theme = useTheme();
    
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

            <span className="flex flex-col justify-center items-center">
                <ElectricBoltIcon htmlColor="var(--energy, yellow)"></ElectricBoltIcon>
                <span className="mx-2">
                    {armor?.stamina ?? 0}
                </span>
            </span>

            <span className="flex flex-col justify-center items-center"
                style={{
                    color: craftType === "gather" ? theme.palette.success.main : ""
                }}> 
                <span>
                    Gather
                </span>
                <span className="mx-2">
                    {((armor?.gatherBonus ?? 0) * 100).toFixed(2)}%
                </span>
            </span>

            <span className="flex flex-col justify-center items-center"
                style={{
                    color: craftType === "craft" ? theme.palette.success.main : ""
                }}> 
                <span>
                    Craft
                </span>
                <span className="mx-2">
                    {((armor?.craftBonus ?? 0) * 100).toFixed(2)}%
                </span>
            </span>

            <span className="flex flex-col justify-center items-center"
                style={{
                    color: craftType === "build" ? theme.palette.success.main : ""
                }}> 
                <span>
                    Build
                </span>
                <span className="mx-2">
                    {((armor?.buildBonus ?? 0) * 100).toFixed(2)}%
                </span>
            </span>
           
        </ButtonLink>
    );
}
 
 
