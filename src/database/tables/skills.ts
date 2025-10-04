import { professions } from "@/config/professions";
import { skills } from "@/config/skills";
import { BitcraftCalculatorDatabase } from "@/database/db";
import { skillService } from "@/services/skill-service";


export type SkillEntityType = 'skill' | 'profession';

export interface SkillEntity {
    id: string;
    name: string;
    selected: 0 | 1;
    power: number;
    type: SkillEntityType;
}

export const skillColumns = (
    [
        'id',
        'name',
        'selected',
        'power',
        'type',
    ] satisfies Array<keyof SkillEntity>
);

export const initializeSkills = async (db: BitcraftCalculatorDatabase) => {
    const skillMap = new Map<string, SkillEntity>();

    // Set defaults initially.
    for (const skill of skills) {
        const defaultSkill = skillService.getDefaultSkill(skill, 'skill');
        skillMap.set(defaultSkill.id, defaultSkill);
    }
    for (const profession of professions) {
        const defaultProfession = skillService.getDefaultSkill(profession, 'profession');
        skillMap.set(defaultProfession.id, defaultProfession);
    }

    //Overwrite the map with real data if exists.
    const allCurrentSkills = await db.skills.toArray();
    for (const currentSkill of allCurrentSkills) {
        skillMap.set(currentSkill.id, currentSkill);
    }

    const allSkills = skillMap.values().toArray();
    if (!allSkills.some(skill => skill.selected === 1)) {
        allSkills[0].selected = 1;
    }

    await db.skills.bulkPut(allSkills);
}