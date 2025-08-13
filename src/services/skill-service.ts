import { calculatorDatabase } from "@/database/db";
import { SkillEntity, SkillEntityType } from "@/database/entities";

export class SkillService {

    getDefaultSkill(name: string, type: SkillEntityType): SkillEntity {
        return {
            id: name.toLocaleLowerCase(),
            name,
            power: 8,
            selected: 1,
            type: type
        };
    }

    async getSkills(): Promise<SkillEntity[]> {
        const skills = await calculatorDatabase.skills.toArray();
        return skills;
    }

    async getSkill(name: string): Promise<SkillEntity | undefined> {
        const skill = await calculatorDatabase.skills.get(name.toLocaleLowerCase());
        return skill;
    }

    async setSkill(skill: SkillEntity, skillId: string) {
        if (skill == null) {
            return;
        }
        await calculatorDatabase.skills.put(skill, skillId)
    }

    async deleteSkill(skillId: string) {
        await calculatorDatabase.skills.delete(skillId);
    }

    async getSelectedSkill(): Promise<SkillEntity | undefined> {
        const selectedSkill = await calculatorDatabase.skills.get({selected: 1})   
        return selectedSkill;
    }

    async setSelectedSkill(skill: SkillEntity) {
        if (skill == null) {
            return;
        }

        const selectedSkills = await calculatorDatabase.skills.where({selected: 1}).toArray();
        for (const selectedSkill of selectedSkills) {
            selectedSkill.selected = 0;
            await calculatorDatabase.skills.put(selectedSkill);
        }

        skill.selected = 1;
        await calculatorDatabase.skills.put(skill);
    }
    
}

export const skillService = new SkillService();