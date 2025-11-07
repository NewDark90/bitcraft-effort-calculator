import { foodActionSpeedBuffMap, foodActionSpeedDeluxeBuffMap, foodRegenBuffMap } from "@/config/food-buffs";
import { TierNumber } from "@/config/tier";
import { BitcraftCalculatorDatabase } from "@/database/db";
import { slugify } from "@/database/util";

export const foodTypes = ["Basic Food", "Meal", "Fish Meal", "Deluxe Fish Meal", "Pumpkin Pie", "Custom Food"] as const;

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
    activeStaminaRegen: number;
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
        'buildBonus',
        'activeStaminaRegen'
    ] satisfies Array<keyof FoodEntity>
);

const getFoodId = (foodType: FoodType, tier: TierNumber) => `${slugify(foodType)}_${tier}`;

const getDefaultFood = (id: string, tier: TierNumber, foodType: FoodType): FoodEntity => {
    return {
        id: id,
        tier: tier,
        type: foodType,
        selected: 0,
        staminaRegen: 0,
        craftBonus: 0,
        gatherBonus: 0,
        buildBonus: 0,
        activeStaminaRegen: 0,
    }
};

export const foodOverrideId = "override" as const;

export const initializeFood = async (db: BitcraftCalculatorDatabase) => {

    const foodMap = new Map<string, FoodEntity>();
    
    const validFoodTiers = [1,2,3,4,5,6,7,8] as TierNumber[];

    // Set defaults initially.
    for (const tier of validFoodTiers) {
        for(const foodType of foodTypes) {

            if (foodType === "Pumpkin Pie" || foodType === "Custom Food")
                continue;

            const id = getFoodId(foodType, tier);
            const entity = getDefaultFood(id, tier, foodType);

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

    const pumpkinPieId = getFoodId("Pumpkin Pie" satisfies FoodType, 2);
    foodMap.set(
        pumpkinPieId, 
        {
            ...getDefaultFood(pumpkinPieId, 2, "Pumpkin Pie"),
            activeStaminaRegen: 0.15,
            staminaRegen: foodRegenBuffMap.get(2 + 1)?.staminaRegen ?? 0
        }
    )

    // Overwrite the map with real data if exists.
    const allCurrentFoods = await db.foods.toArray();
    const selectedFoodId = allCurrentFoods.find(food => food.selected)?.id;

    for (const currentFood of allCurrentFoods) {
        const mergedFood = {
            ...currentFood,
            ...foodMap.get(currentFood.id),
            selected: selectedFoodId === currentFood.id ? 1 : 0
        } satisfies FoodEntity;
        foodMap.set(mergedFood.id, mergedFood);
    }

    const allFoods = foodMap.values().toArray();

    await db.foods.bulkPut(allFoods);

    // Initialize a special "override" food that the user can manually change the values for.
    const overrideFood = await db.foods.get(foodOverrideId);
    if (overrideFood == null) {
        await db.foods.add(
            getDefaultFood(foodOverrideId, 0, "Custom Food"), 
            foodOverrideId
        );
    }
}
