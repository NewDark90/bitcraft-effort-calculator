import SquareIcon from '@mui/icons-material/Square';
import { TierNumber } from "@/config/tier";
import { CraftingTier, craftingTierMap } from "@/config/crafting-tiers";

export type TierSelectorProps = { 
    tierId: TierNumber;
    className?: string; 
};

export default function TierLabel(
    { tierId, className }: TierSelectorProps
) {
    const tier = craftingTierMap.get(tierId) as CraftingTier;

    return (
        <span className={className}>
            <SquareIcon htmlColor={tier.color}></SquareIcon>
            &nbsp;
            Tier { tier.tierId }
        </span>
    );
}


