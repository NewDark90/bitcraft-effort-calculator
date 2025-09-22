import { calculatorDatabase } from "@/database/db";
import { settingKeys } from "@/database/entities";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useState } from "react";

export type NotificationStyle = "always" | "when-away" | "never";

export type UseNotificationSettingsReturn = { 
    notificationStyle: NotificationStyle; 
    notificationPermission: NotificationPermission; 
    setNotificationStyle: (notificationStyle: NotificationStyle) => Promise<void>; 
};

export const useNotificationSettings = (
    
): UseNotificationSettingsReturn => {

    if (!("Notification" in window)) {
        const fauxSetNotificationStyle = useCallback((style: string) => Promise.resolve(), []);
        return {
            notificationStyle: "never",
            notificationPermission: "denied",
            setNotificationStyle: fauxSetNotificationStyle
        }
    }

    const notificationStyle = useLiveQuery(
        async () => {
            const style = await calculatorDatabase.settings.get(settingKeys.notificationType)
            return style?.value as NotificationStyle | null;
        }, 
        []
    ) ?? "when-away";

    const [notificationPermission, _setNotificationPermission] = useState(Notification.permission);

    const setNotificationStyle = async (notificationStyle: NotificationStyle) => {
        if (notificationStyle === "always" || notificationStyle === "when-away") {
            const newPermission = await Notification.requestPermission();
            _setNotificationPermission(newPermission);
        }
        await calculatorDatabase.settings.put({
            id: settingKeys.notificationType,
            value: notificationStyle
        });
    }

    return {
        notificationStyle,
        notificationPermission,
        setNotificationStyle
    };
};