export type FoodRegenBuff = {
    level: number;
    staminaRegen: number;
    healthRegen: number; 
}

export type FoodActionSpeedBuff = {
    level: number;
    gatherBonus: number;
    craftBonus: number;
}

export const foodRegenBuffs = [
    { level: 1, staminaRegen: 5 , healthRegen:0 },
    { level: 2, staminaRegen: 7 , healthRegen:0 },
    { level: 3, staminaRegen: 9 , healthRegen:0 },
    { level: 4, staminaRegen: 11, healthRegen:0 },
    { level: 5, staminaRegen: 13, healthRegen:0 },
    { level: 6, staminaRegen: 15, healthRegen:0 },
    { level: 7, staminaRegen: 17, healthRegen:0 },
    { level: 8, staminaRegen: 19, healthRegen:0 },
    { level: 9, staminaRegen: 20, healthRegen:0 },
] as const satisfies FoodRegenBuff[];


export const foodRegenBuffMap = new Map(
    foodRegenBuffs.map(buff => [buff.level as number, buff])  
);

export const foodActionSpeedBuffs = [
    { level: 1, gatherBonus: 0.041, craftBonus: 0.041 },
    { level: 2, gatherBonus: 0.042, craftBonus: 0.042 },
    { level: 3, gatherBonus: 0.043, craftBonus: 0.043 },
    { level: 4, gatherBonus: 0.044, craftBonus: 0.044 },
    { level: 5, gatherBonus: 0.045, craftBonus: 0.045 },
    { level: 6, gatherBonus: 0.046, craftBonus: 0.046 },
    { level: 7, gatherBonus: 0.047, craftBonus: 0.047 },
    { level: 8, gatherBonus: 0.048, craftBonus: 0.048 },
] as const satisfies FoodActionSpeedBuff[];

export const foodActionSpeedBuffMap = new Map(
    foodActionSpeedBuffs.map(buff => [buff.level as number, buff])  
);

export const foodActionSpeedDeluxeBuffs = [
    { level: 1, gatherBonus: 0.082, craftBonus: 0.082 },
    { level: 2, gatherBonus: 0.084, craftBonus: 0.084 },
    { level: 3, gatherBonus: 0.086, craftBonus: 0.086 },
    { level: 4, gatherBonus: 0.088, craftBonus: 0.088 },
    { level: 5, gatherBonus: 0.090, craftBonus: 0.090 },
    { level: 6, gatherBonus: 0.092, craftBonus: 0.092 },
    { level: 7, gatherBonus: 0.094, craftBonus: 0.094 },
    { level: 8, gatherBonus: 0.096, craftBonus: 0.096 },
] as const satisfies FoodActionSpeedBuff[];

export const foodActionSpeedDeluxeBuffMap = new Map(
    foodActionSpeedDeluxeBuffs.map(buff => [buff.level as number, buff])  
);

