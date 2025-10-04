import { TierNumber } from "@/config/tier";

export type CraftingTier = {
    tier: TierNumber;
    color: string;
}

export const craftingTiers: CraftingTier[] = [
    { tier: 1,  color: 'var(--tier1)' },
    { tier: 2,  color: 'var(--tier2)' },
    { tier: 3,  color: 'var(--tier3)' },
    { tier: 4,  color: 'var(--tier4)' },
    { tier: 5,  color: 'var(--tier5)' },
    { tier: 6,  color: 'var(--tier6)' },
    { tier: 7,  color: 'var(--tier7)' },
    { tier: 8,  color: 'var(--tier8)' },
    { tier: 9,  color: 'var(--tier9)' },
    { tier: 10, color: 'var(--tier10)' },
];

export const craftingTierMap = new Map(
    craftingTiers.map(type => [type.tier, type])  
);