import Image from "next/image";
import SquareIcon from '@mui/icons-material/Square';
import { TierNumber } from "@/config/tier";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useId } from "react";
import { craftingTiers } from "@/config/crafting-tiers";
import clsx from "clsx";
import TierLabel from "@/components/tier-label";

export type TierSelectorProps = { 
    tier?: TierNumber;
    onTierChange?: (tier: TierNumber) => void;
    className?: string; 
};

export default function TierSelector(
    { tier, onTierChange, className }: TierSelectorProps
) {
    const id = useId();

    return (
        <FormControl 
            sx={{ minWidth: 140 }}
            className={clsx("mx-4", className)}
            >
            <InputLabel id={`tier-label-${id}`}>
                Tier
            </InputLabel>
            <Select
                labelId={`tier-label-${id}`}
                label={"Tier"}
                value={tier}
                autoWidth={true}
                onChange={(event) => {
                    const tier = event.target.value;
                    onTierChange?.(tier);
                }}
            >
                {
                    craftingTiers.map(tier => (
                        <MenuItem
                            value={tier.tierId}
                            key={tier.tierId}
                        >
                            <TierLabel tierId={tier.tierId}></TierLabel>
                        </MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    );
}


