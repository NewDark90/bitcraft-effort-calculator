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

export type NotificationStyle = "always" | "when-away" | "never";

// Service worker won't have this context if the variable changes.
export const settingKeys = {
    notificationType: "notification-type",
    calculatorBlurStamp: "blurred-stamp",
    playAlarmAudio: "play-alarm-audio" 
} as const;

export type SettingKeyType = typeof settingKeys[keyof typeof settingKeys];