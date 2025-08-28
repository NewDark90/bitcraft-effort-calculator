import { CraftingType, craftingTypeMap, craftingTypes } from "@/config/crafting-types";
import { tryParseInt } from "@/util/tryParseInt";

export class CraftParameterService {

    readonly effortKey = "effort";
    readonly craftingTypeKey = "crafting-type";

    constructor(
        private storage: Storage | null
    ) {

    }

    getEffort(): number {
        if (this.storage == null) { return 0; }

        const effortStr = this.storage.getItem(this.effortKey);
        const effort = tryParseInt(effortStr, 0);
        return effort;
    }    

    setEffort(effort: number) {
        this.storage?.setItem(this.effortKey, `${effort}`);
    }

    getCraftingType(): CraftingType {
        if (this.storage == null) { return craftingTypes[0]; }

        const craftingTypeName = this.storage.getItem(this.craftingTypeKey);
        const craftingType = craftingTypeMap.get(craftingTypeName ?? "");
        return craftingType ?? craftingTypes[0];
    }    

    setCraftingType(craftingType: CraftingType | string) {
        if (typeof craftingType !== 'string') {
            craftingType = craftingType.name;
        }
        this.storage?.setItem(this.craftingTypeKey, craftingType);
    }
}

export const craftParameterService = new CraftParameterService(typeof localStorage !== "undefined" ? localStorage : null);