import { CraftingType, craftingTypeMap, craftingTypes } from "@/config/crafting-types";
import { tryParseInt } from "@/util/tryParseInt";

export class CraftParameterService {

    readonly effortKey = "effort";
    readonly craftingTypeKey = "crafting-type";

    getEffort(): number {
        const effortStr = localStorage.getItem(this.effortKey);
        const effort = tryParseInt(effortStr, 0);
        return effort;
    }    

    setEffort(effort: number) {
        localStorage.setItem(this.effortKey, `${effort}`);
    }

    getCraftingType(): CraftingType {
        const craftingTypeName = localStorage.getItem(this.craftingTypeKey);
        const craftingType = craftingTypeMap.get(craftingTypeName ?? "");
        return craftingType ?? craftingTypes[0];
    }    

    setCraftingType(craftingType: CraftingType | string) {
        if (typeof craftingType !== 'string') {
            craftingType = craftingType.name;
        }
        localStorage.setItem(this.craftingTypeKey, craftingType);
    }
}

export const craftParameterService = new CraftParameterService();