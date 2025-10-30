import { calculatorDatabase } from "@/database/db";
import { NotificationStyle, SettingEntity, SettingKeyType } from "@/database/tables/settings";
import { IDBValidProp } from "@/database/util";
import { useLiveQuery } from "dexie-react-hooks";

export const useSettings = (
    
) => {

    const rawSettings = useLiveQuery(
        async () => {
            return calculatorDatabase.settings.toArray()
        }, 
        []
    );

    const saveSetting = async <TVal extends IDBValidProp>(id: string, value: TVal) => {
        return await calculatorDatabase.settings.put({
            id, value
        }, id)
    }

    const settingWrapper = <TValue extends IDBValidProp>(
        settings: SettingEntity<string, IDBValidProp>[] | null | undefined,
        id: SettingKeyType,
        defaultValue: TValue
    ) => {
        const value = settings?.find(s => s.id === id)?.value as TValue
            ?? defaultValue;

        return {
            id,
            value,
            defaultValue,
            save: (value: TValue) => saveSetting(id, value)
        }
    }

    return {
        isLoadingSettings: rawSettings == null,
        rawSettings,
        settings: {
            notificationStyle: settingWrapper<NotificationStyle>(rawSettings, "notification-type", "when-away"),
            playAlarmAudio: settingWrapper<1 | 0>(rawSettings, "play-alarm-audio", 1),
            networkDelay: settingWrapper<number>(rawSettings, "network-delay", 100),
            alarmVolume: settingWrapper<number>(rawSettings, "alarm-volume", 1),
            alarmFile: settingWrapper<string>(rawSettings, "alarm-file", "/sounds/jobs-done.mp3"),
            alarmName: settingWrapper<string>(rawSettings, "alarm-name", "Job's Done"),
        },
        saveSetting
    };
};