// db.ts
import { professions } from '@/config/professions';
import { skills } from '@/config/skills';
import { ArmorEntity, SkillEntity } from '@/database/entities';
import { initializeArmor, initializeSkills } from '@/database/init';
import { skillService } from '@/services/skill-service';
import Dexie, { type EntityTable } from 'dexie';

export type BitcraftCalculatorDatabase = Dexie & {
    skills: EntityTable<SkillEntity, 'id'>;
    armors: EntityTable<ArmorEntity, 'id'>;
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
        'energy',
        'interval',
        'regenPerSecond'
    ] satisfies Array<keyof ArmorEntity>
);
armorColumns[0] = `++${armorColumns[0]}` as any; //autoincrement definition

calculatorDatabase.version(1).stores({
    skills: skillColumns.join(", "),
    armors: armorColumns.join(", ")
});


// Init data
calculatorDatabase.on("ready", async (vipDb) => {

    await initializeSkills(vipDb as BitcraftCalculatorDatabase);
    await initializeArmor(vipDb as BitcraftCalculatorDatabase);
    
})

export { calculatorDatabase };