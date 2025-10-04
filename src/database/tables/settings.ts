import { BitcraftCalculatorDatabase } from "@/database/db";
import { IDBValidProp } from "@/database/util";

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

export const settingColumns = (
    [
        'id',
        'value',
    ] satisfies Array<keyof SettingEntity>
);


export const initializeSettings = async (db: BitcraftCalculatorDatabase) => {

    const currentSettings = await db.settings.toArray();

    const notificationSetting = currentSettings.find(setting => setting.id === settingKeys.notificationType);
    if (!notificationSetting) {
        const setting = {
           id: settingKeys.notificationType,
           value: "when-away"
        } satisfies SettingEntity<typeof settingKeys.notificationType, NotificationStyle>;

        await db.settings.add(setting, settingKeys.notificationType)
    }

}
