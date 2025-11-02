import { BitcraftCalculatorDatabase } from "@/database/db";
import { IDBValidProp } from "@/database/util";

export interface SettingEntity<
    TId extends string = string, 
    TValue = IDBValidProp
> {
    id: TId;
    value: TValue;
}

export const notificationStyles = [
    //{ name: "Always", value: "always" },
    { name: "When Away", value: "when-away" },
    { name: "Never", value: "never" },
] as const

export type NotificationStyle = typeof notificationStyles[number]['value'];

// Service worker won't have this context if the variable changes.
export const settingKeys = {
    notificationType: "notification-type",
    calculatorBlurStamp: "blurred-stamp",
    playAlarmAudio: "play-alarm-audio",
    networkDelay: "network-delay",
    audioVolume: "alarm-volume",
    alarmFile: "alarm-file",
    alarmName: "alarm-name",
} as const;

export type SettingKeyType = typeof settingKeys[keyof typeof settingKeys];

export const settingColumns = (
    [
        'id',
        'value',
    ] satisfies Array<keyof SettingEntity>
);

export const alarmRules = [
    { name: "Out of Stamina", value: "out-of-stamina" },
    { name: "Stamina Full", value: "stamina-full" },
    { name: "Never", value: "never" },
] as const

export type AlarmRulesKey = typeof alarmRules[number]['value'];

export const initializeSettings = async (db: BitcraftCalculatorDatabase) => {

    const currentSettings = await db.settings.toArray();

    const missingSettings: SettingEntity[] = [];

    const notificationSetting = currentSettings.find(setting => setting.id === settingKeys.notificationType);
    if (!notificationSetting) {
        missingSettings.push({
           id: settingKeys.notificationType,
           value: "never"
        } satisfies SettingEntity<typeof settingKeys.notificationType, NotificationStyle>);
    }

    const playAlarmAudioSetting = currentSettings.find(setting => setting.id === settingKeys.playAlarmAudio);
    if (!playAlarmAudioSetting) {
        missingSettings.push({
           id: settingKeys.playAlarmAudio,
           value: "out-of-stamina"
        } satisfies SettingEntity<typeof settingKeys.playAlarmAudio, AlarmRulesKey>);
    }
    else if (typeof playAlarmAudioSetting?.value === "number") {
        // Converting the on/off bit to a slug for previous version of this property.
        await db.settings.put({
           id: settingKeys.playAlarmAudio,
           value: playAlarmAudioSetting?.value === 0 ? "never" : "out-of-stamina"
        } satisfies SettingEntity<typeof settingKeys.playAlarmAudio, AlarmRulesKey>);
    }

    const networkDelaySetting = currentSettings.find(setting => setting.id === settingKeys.networkDelay);
    if (!networkDelaySetting) {
        missingSettings.push({
           id: settingKeys.networkDelay,
           value: 100
        } satisfies SettingEntity<typeof settingKeys.networkDelay, number>);
    }

    await db.settings.bulkAdd(missingSettings);
}
