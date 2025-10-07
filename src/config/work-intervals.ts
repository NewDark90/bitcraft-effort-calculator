


// Is labeled as "time_requirement" in bitcraft data.

import { CraftingTypeSlug } from "@/config/crafting-types";
import { CraftBonusEntity } from "@/database";

export type WorkInterval = {
    base: number;
    baseMs: number;
    effective: number;
    effectiveMs: number;
}

export const craftingTypeWorkIntervals = new Map<CraftingTypeSlug, number>([
    ["gather",  1.6],
    ["craft",   1.6],
    ["build",   2],
]) as ReadonlyMap<CraftingTypeSlug, number>;

export function getWorkInterval<TBonus extends CraftBonusEntity>(
    craftTypeSlug: CraftingTypeSlug, 
    bonuses?: Array<TBonus|undefined>
): WorkInterval {
    const base = craftingTypeWorkIntervals.get(craftTypeSlug) ?? 0;
    
    const bonus = (bonuses ?? [])
        .filter(bonus => bonus != null)
        .map((bonus) => {
            switch (craftTypeSlug) {
                case "gather": return bonus.gatherBonus ?? 0;
                case "craft": return bonus.craftBonus ?? 0;
                case "build": return bonus.buildBonus ?? 0;
            }
        })
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    const effective = base - (base * bonus);
    
    return {
        base,
        baseMs: base * 1000,
        effective,
        effectiveMs: effective * 1000
    };
}