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

export type IDBValidKey = string | number | Date | ArrayBuffer | IDBValidKey[];

export interface SettingEntity<
    TId extends string = string, 
    TValue = IDBValidKey
> {
    id: TId;
    value: TValue;
}

export const settingKeys = {
    notificationType: "notification-type" // Service worker won't have this context if the variable changes.
} as const