import { CraftingTypeSlug } from "@/config/crafting-types";
import { TierNumber } from "@/config/tier";


// Is labeled as "stamina_requirement" in bitcraft data.

export const staminaCostTiers = new Map<TierNumber, number>([
    [1,  0.75],
    [2,  0.89],
    [3,  1.03],
    [4,  1.16],
    [5,  1.28],
    [6,  1.41],
    [7,  1.52],
    [8,  1.64],
    [9,  1.75],
    [10, 1.86],
]) as ReadonlyMap<TierNumber, number>;

export const staminaCostBuild = 2;


export function getStaminaCost(craftType: CraftingTypeSlug, tier: TierNumber): number {

    if (craftType == "build")
        return staminaCostBuild;

    return staminaCostTiers.get(tier) ?? 0;
}