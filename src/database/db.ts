import { armorColumns, ArmorEntity, initializeArmor } from '@/database/tables/armors';
import { foodColumns, FoodEntity, initializeFood } from '@/database/tables/food';
import { settingColumns, SettingEntity, initializeSettings } from '@/database/tables/settings';
import { skillColumns, SkillEntity, initializeSkills } from '@/database/tables/skills';
import Dexie, { type EntityTable } from 'dexie';

export type BitcraftCalculatorDatabase = Dexie & {
    skills: EntityTable<SkillEntity, 'id'>;
    armors: EntityTable<ArmorEntity, 'id'>;
    foods: EntityTable<FoodEntity, 'id'>;
    settings: EntityTable<SettingEntity, 'id'>;
};

const calculatorDatabase = new Dexie('BitcraftCalculatorDatabase') as BitcraftCalculatorDatabase;

calculatorDatabase.version(2).stores({
    skills: skillColumns.join(", "),
    armors: armorColumns.join(", "),
    foods: foodColumns.join(", "),
    settings: settingColumns.join(", "),
});


// Init data
calculatorDatabase.on("ready", async (vipDb) => {

    await initializeSkills(vipDb as BitcraftCalculatorDatabase);
    await initializeArmor(vipDb as BitcraftCalculatorDatabase);
    await initializeFood(vipDb as BitcraftCalculatorDatabase);
    await initializeSettings(vipDb as BitcraftCalculatorDatabase);
    
})

export { calculatorDatabase };