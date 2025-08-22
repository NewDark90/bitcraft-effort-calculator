
export type CraftingType = {
    name: string;
    stamina: number;
}

export const craftingTypes: CraftingType[] = [
    { name: "T1",  stamina: 0.75 },
    { name: "T2",  stamina: 0.89 },
    { name: "T3",  stamina: 1.03 },
    { name: "T4",  stamina: 1.16 },
    { name: "T5",  stamina: 1.28 },
    { name: "T6",  stamina: 1.41 },
    { name: "T7",  stamina: 1.52 },
    { name: "T8",  stamina: 1.64 },
    { name: "T9",  stamina: 1.75 },
    { name: "T10",  stamina: 1.86 },
    { name: "Terraform",  stamina: 2 },
];

export const craftingTypeMap = new Map(
    craftingTypes.map(type => [type.name, type])  
);