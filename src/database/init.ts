import { professions } from "@/config/professions";
import { skills } from "@/config/skills";
import { BitcraftCalculatorDatabase } from "@/database/db";
import { SkillEntity } from "@/database/entities";
import { skillService } from "@/services/skill-service";

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

    await db.skills.bulkPut(skillMap.values().toArray());
}


export const initializeArmor = async (db: BitcraftCalculatorDatabase) => {

    
    const allCurrentSkills = await db.skills.toArray();

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
    for (const currentSkill of allCurrentSkills) {
        skillMap.set(currentSkill.id, currentSkill);
    }

    await db.skills.bulkPut(skillMap.values().toArray());
}
