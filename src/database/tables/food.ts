import { foodActionSpeedBuffMap, foodActionSpeedDeluxeBuffMap, foodRegenBuffMap } from "@/config/food-buffs";
import { TierNumber } from "@/config/tier";
import { BitcraftCalculatorDatabase } from "@/database/db";
import { slugify } from "@/database/util";

export const foodTypes = ["Basic Food", "Meal", "Fish Meal", "Deluxe Fish Meal"] as const;

export type FoodType = typeof foodTypes[number];

export interface FoodEntity {
    id: string;
    type: FoodType;
    tier: TierNumber;
    selected: 0 | 1;
    staminaRegen: number;
    gatherBonus: number;
    craftBonus: number;
    buildBonus: number;
};


export const foodColumns = (
    [
        'id',  //type / tier slug
        'tier',
        'type',
        'selected',
        'staminaRegen',
        'gatherBonus',
        'craftBonus',
        'buildBonus'
    ] satisfies Array<keyof FoodEntity>
);

const getFoodId = (foodType: FoodType, tier: TierNumber) => `${slugify(foodType)}_${tier}`;

export const initializeFood = async (db: BitcraftCalculatorDatabase) => {

    const foodMap = new Map<string, FoodEntity>();
    
    const validFoodTiers = [1,2,3,4,5,6,7,8] as TierNumber[];

    // Set defaults initially.
    for (const tier of validFoodTiers) {
        for(const foodType of foodTypes) {
            const id = getFoodId(foodType, tier);
            const entity: FoodEntity = {
                id: id,
                tier: tier,
                type: foodType,
                selected: 0,
                staminaRegen: 0,
                craftBonus: 0,
                gatherBonus: 0,
                buildBonus: 0,
            };

            const regenBuffLevel = foodType === "Basic Food" ? tier : tier + 1;
            entity.staminaRegen = foodRegenBuffMap.get(regenBuffLevel)?.staminaRegen ?? 0;

            if (foodType == "Fish Meal") {
                const buff = foodActionSpeedBuffMap.get(tier);
                entity.gatherBonus = buff?.gatherBonus ?? 0;
                entity.craftBonus = buff?.craftBonus ?? 0;
            }

            if (foodType == "Deluxe Fish Meal") {
                const buff = foodActionSpeedDeluxeBuffMap.get(tier);
                entity.gatherBonus = buff?.gatherBonus ?? 0;
                entity.craftBonus = buff?.craftBonus ?? 0;
            }
            foodMap.set(id, entity);
        }
    }

    //Overwrite the map with real data if exists.
    const allCurrentFoods = await db.foods.toArray();
    for (const currentFood of allCurrentFoods) {
        foodMap.set(currentFood.id, currentFood);
    }

    const allFoods = foodMap.values().toArray();

    await db.foods.bulkPut(allFoods);
}
