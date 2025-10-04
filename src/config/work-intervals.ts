


// Is labeled as "time_requirement" in bitcraft data.

import { CraftingTypeSlug } from "@/config/crafting-types";


export const craftingTypeWorkIntervals = new Map<CraftingTypeSlug, number>([
    ["gather",  1.6],
    ["craft",   1.6],
    ["build",   2],
]) as ReadonlyMap<CraftingTypeSlug, number>;

export function getWorkInterval(craftTypeSlug: CraftingTypeSlug): number {
    return craftingTypeWorkIntervals.get(craftTypeSlug) ?? 0;
}