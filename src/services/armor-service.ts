import { calculatorDatabase } from "@/database/db";
import { ArmorEntity } from "@/database/entities";
import { tryParseJson } from "@/util/tryParseJson";
import { InsertType } from "dexie";

export class ArmorService {

    getDefaultArmorDetail(): Omit<ArmorEntity, "id"> {
        return {
            name: "",
            stamina: 100,
            interval: 1.6,
            regenPerSecond: 0,
            selected: 0
        };
    }

    async getArmors(): Promise<ArmorEntity[]> {
        const armors = await calculatorDatabase.armors.toArray();
        return armors;
    }

    async getArmor(id: number): Promise<ArmorEntity | undefined> {
        const armor = await calculatorDatabase.armors.get(id);
        return armor;
    }

    async createNewArmor(armorDetails?: Partial<ArmorEntity>): Promise<ArmorEntity> {
        const newArmor = {
            ...this.getDefaultArmorDetail(),
            ...armorDetails
        };
        const id = await calculatorDatabase.armors.add(newArmor);
        return {
            ...newArmor,
            id: id
        }
    }

    async createArmor(armor: InsertType<ArmorEntity, "id">) {
        await calculatorDatabase.armors.add(armor);
    }

    async setArmor(armor: ArmorEntity, armorId: number) {
        if (armor == null) {
            return;
        }
        await calculatorDatabase.armors.put(armor, armorId)
    }

    async deleteArmor(armorId: number) {
        await calculatorDatabase.armors.delete(armorId);
    }

    async getSelectedArmor(): Promise<ArmorEntity | undefined> {
        const selectedArmor = await calculatorDatabase.armors.get({selected: 1})   
        return selectedArmor;
    }

    async setSelectedArmor(armor: ArmorEntity) {
        if (armor == null) {
            return;
        }

        const selectedArmors = await calculatorDatabase.armors.where({selected: 1}).toArray();
        for (const selectedArmor of selectedArmors) {
            selectedArmor.selected = 0;
        }

        armor.selected = 1;

        await calculatorDatabase.armors.bulkPut([...selectedArmors, armor]);
    }
    
}

export const armorService = new ArmorService();