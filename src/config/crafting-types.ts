
export type CraftingType = {
    name: string;
    staminaCost: number;
    color?: string;
}

export const craftingTypes: CraftingType[] = [
    { name: "T1",  staminaCost: 0.75, color: 'var(--tier1)' },
    { name: "T2",  staminaCost: 0.89, color: 'var(--tier2)' },
    { name: "T3",  staminaCost: 1.03, color: 'var(--tier3)' },
    { name: "T4",  staminaCost: 1.16, color: 'var(--tier4)' },
    { name: "T5",  staminaCost: 1.28, color: 'var(--tier5)' },
    { name: "T6",  staminaCost: 1.41, color: 'var(--tier6)' },
    { name: "T7",  staminaCost: 1.52, color: 'var(--tier7)' },
    { name: "T8",  staminaCost: 1.64, color: 'var(--tier8)' },
    { name: "T9",  staminaCost: 1.75, color: 'var(--tier9)' },
    { name: "T10",  staminaCost: 1.86, color: 'var(--tier10)' },
    { name: "Terraform",  staminaCost: 2 },
];

export const craftingTypeMap = new Map(
    craftingTypes.map(type => [type.name, type])  
);