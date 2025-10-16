
import { NotificationStyle } from "@/database/tables/settings";
import { useSettings } from "@/hooks/use-settings";
import { useCallback, useState } from "react";

export type UseNotificationSettingsReturn = { 
    notificationStyle: NotificationStyle; 
    notificationPermission: NotificationPermission; 
    setNotificationStyle: (notificationStyle: NotificationStyle) => Promise<void>; 
};

export const useNotificationSettings = (
    
): UseNotificationSettingsReturn => {

    // Not supported by the browser
    const fauxSetNotificationStyle = useCallback(() => Promise.resolve(), []);
    const { settings: { notificationStyle } } = useSettings();
    const [notificationPermission, _setNotificationPermission] = useState(Notification.permission);

    if (typeof window === "undefined" || !("Notification" in window)) {
        return {
            notificationStyle: "never",
            notificationPermission: "denied",
            setNotificationStyle: fauxSetNotificationStyle
        }
    }

    const setNotificationStyle = async (style: NotificationStyle) => {
        if (style === "when-away") {
            const newPermission = await Notification.requestPermission();
            _setNotificationPermission(newPermission);
        }
        await notificationStyle.save(style);
    }

    return {
        notificationStyle: notificationStyle.value,
        notificationPermission,
        setNotificationStyle
    };
};