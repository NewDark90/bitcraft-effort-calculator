import ButtonLink from "@/components/common/button-link";
import TierLabel from "@/components/tier-label";
import { FoodEntity } from "@/database/tables";
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { CraftingTypeSlug } from "@/config/crafting-types";
import { useTheme } from "@mui/material/styles";

export type FoodSelectButtonProps = { 
    food?: FoodEntity;
    craftType?: CraftingTypeSlug;
};

export default function FoodSelectButton(
    { food, craftType }: FoodSelectButtonProps
) {

    const theme = useTheme();

    return (
        <ButtonLink
            href="/food-select"
            rel="noopener noreferrer"
            className="flex flex-wrap items-center justify-evenly"
        >
            <span className="w-full mb-2 text-lg font-bold">
                {
                    food != null 
                        ? <>
                            <span className="m-2">{food.type}</span> 
                            &nbsp;
                            <TierLabel tierId={food.tier}></TierLabel> 
                        </>
                        : <>
                            <span>No food selected.</span>
                        </>
                }
            </span>

            <div className={"w-full text-center flex flex-row justify-evenly"}>
                <div>
                    <span className="w-full block">
                        <ElectricBoltIcon htmlColor="var(--energy, yellow)"></ElectricBoltIcon>
                        <AutorenewIcon></AutorenewIcon>
                    </span>
                    <span>
                        {(food?.staminaRegen ?? 0).toFixed(0)}
                    </span>
                </div>
                <div style={{
                    color: craftType === "gather" ? theme.palette.success.main : ""
                }}>
                    <span className="w-full block"
                    
                    >
                        Gather
                    </span>
                    <span>
                        {((food?.gatherBonus ?? 0) * 100).toFixed(2)}%
                    </span>
                </div>
                <div style={{
                    color: craftType === "craft" ? theme.palette.success.main : ""
                }}>
                    <span className="w-full block">
                        Craft
                    </span>
                    <span>
                        {((food?.craftBonus ?? 0) * 100).toFixed(2)}%
                    </span>
                </div>
            </div>
            
        </ButtonLink>
    );
}
 
 
