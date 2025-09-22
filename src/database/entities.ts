export type SkillEntityType = 'skill' | 'profession';

export interface SkillEntity {
    id: string;
    name: string;
    selected: 0 | 1;
    power: number;
    type: SkillEntityType;
}

export interface ArmorEntity {
    id: number;
    name: string;
    selected: 0 | 1;
    stamina: number;
    interval: number;
    regenPerSecond: number;
}

export type IDBValidProp = string | number | Date | ArrayBuffer | null | IDBValidProp[];

export interface SettingEntity<
    TId extends string = string, 
    TValue = IDBValidProp
> {
    id: TId;
    value: TValue;
}

// Service worker won't have this context if the variable changes.
export const settingKeys = {
    notificationType: "notification-type",
    calculatorBlurStamp: "blurred-stamp"
} as const