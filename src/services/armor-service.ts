import { calculatorDatabase } from "@/database/db";
import { ArmorEntity } from "@/database/entities";
import { tryParseJson } from "@/util/tryParseJson";

export interface ArmorDetail {
    name: string;
    energy: number;
    interval: number;
    regenPerSecond: number;
}

export class ArmorService {

    getDefaultArmorDetail(name: string): ArmorDetail {
        return {
            name,
            energy: 100,
            interval: 1.6,
            regenPerSecond: 0
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
            await calculatorDatabase.armors.put(selectedArmor);
        }

        armor.selected = 1;
        await calculatorDatabase.armors.put(armor);
    }
    
}

export const armorService = new ArmorService();