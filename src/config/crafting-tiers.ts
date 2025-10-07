import { TierNumber } from "@/config/tier";

export type CraftingTier = {
    tierId: TierNumber;
    color: string;
}

export const craftingTiers: CraftingTier[] = [
    { tierId: 1,  color: 'var(--tier1)' },
    { tierId: 2,  color: 'var(--tier2)' },
    { tierId: 3,  color: 'var(--tier3)' },
    { tierId: 4,  color: 'var(--tier4)' },
    { tierId: 5,  color: 'var(--tier5)' },
    { tierId: 6,  color: 'var(--tier6)' },
    { tierId: 7,  color: 'var(--tier7)' },
    { tierId: 8,  color: 'var(--tier8)' },
    { tierId: 9,  color: 'var(--tier9)' },
    { tierId: 10, color: 'var(--tier10)' },
];

export const craftingTierMap = new Map(
    craftingTiers.map(type => [type.tierId, type])  
);