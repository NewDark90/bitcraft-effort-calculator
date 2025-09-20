// db.ts
import { ArmorEntity, SettingEntity, SkillEntity } from '@/database/entities';
import { initializeArmor, initializeSettings, initializeSkills } from '@/database/init';
import Dexie, { type EntityTable } from 'dexie';

export type BitcraftCalculatorDatabase = Dexie & {
    skills: EntityTable<SkillEntity, 'id'>;
    armors: EntityTable<ArmorEntity, 'id'>;
    settings: EntityTable<SettingEntity, 'id'>;
};

const calculatorDatabase = new Dexie('BitcraftCalculatorDatabase') as BitcraftCalculatorDatabase;

const skillColumns = (
    [
        'id',
        'name',
        'selected',
        'power',
        'type',
    ] satisfies Array<keyof SkillEntity>
);

const armorColumns = (
    [
        'id',
        'name',
        'selected',
        'stamina',
        'interval',
        'regenPerSecond'
    ] satisfies Array<keyof ArmorEntity>
);
armorColumns[0] = `++${armorColumns[0]}` as any; //autoincrement definition

const settingColumns = (
    [
        'id',
        'value',
    ] satisfies Array<keyof SettingEntity>
);

calculatorDatabase.version(1).stores({
    skills: skillColumns.join(", "),
    armors: armorColumns.join(", "),
    settings: settingColumns.join(", "),
});


// Init data
calculatorDatabase.on("ready", async (vipDb) => {

    await initializeSkills(vipDb as BitcraftCalculatorDatabase);
    await initializeArmor(vipDb as BitcraftCalculatorDatabase);
    await initializeSettings(vipDb as BitcraftCalculatorDatabase);
    
})

export { calculatorDatabase };