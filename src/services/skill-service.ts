import { tryParseJson } from "@/util/tryParseJson";

export interface SkillDetail {
    name: string;
    power: number;
}

export class SkillService {

    private getSkillPowerKey = (name: string): string => `skill.${name?.toLocaleLowerCase()}.power`;

    getSkillPower(name: string): number {
        const storageKey = this.getSkillPowerKey(name);
        const powerStr = localStorage.getItem(storageKey);
        const power = parseInt(powerStr ?? "");
        if (isNaN(power)) {
            return 8;
        }
        return power;
    }

    setSkillPower(name: string, power?: number) {
        const storageKey = this.getSkillPowerKey(name);
        if(power == null) {
            localStorage.removeItem(storageKey);
        }

        localStorage.setItem(storageKey, `${power}`);
    }
    
}