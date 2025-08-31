
export type CraftingType = {
    name: string;
    staminaCost: number;
}

export const craftingTypes: CraftingType[] = [
    { name: "T1",  staminaCost: 0.75 },
    { name: "T2",  staminaCost: 0.89 },
    { name: "T3",  staminaCost: 1.03 },
    { name: "T4",  staminaCost: 1.16 },
    { name: "T5",  staminaCost: 1.28 },
    { name: "T6",  staminaCost: 1.41 },
    { name: "T7",  staminaCost: 1.52 },
    { name: "T8",  staminaCost: 1.64 },
    { name: "T9",  staminaCost: 1.75 },
    { name: "T10",  staminaCost: 1.86 },
    { name: "Terraform",  staminaCost: 2 },
];

export const craftingTypeMap = new Map(
    craftingTypes.map(type => [type.name, type])  
);