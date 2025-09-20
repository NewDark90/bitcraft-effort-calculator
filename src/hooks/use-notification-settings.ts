import { useState } from "react";
import { useLocalStorage, useSessionStorage } from "usehooks-ts";

export type NotificationStyle = "always" | "when-away" | "never";

export const useNotificationSettings = (
    
) => {

    const [notificationStyle, _setNotificationStyle] = useLocalStorage<NotificationStyle>("notification-style", "when-away");
    const [notificationPermission, _setNotificationPermission] = useSessionStorage("notification-permission", Notification.permission);

    const setNotificationStyle = async (notificationStyle: NotificationStyle) => {
        if (notificationStyle === "always" || notificationStyle === "when-away") {
            const newPermission = await Notification.requestPermission();
            _setNotificationPermission(newPermission);
        }
        _setNotificationStyle(notificationStyle);
    }

    return {
        notificationStyle,
        notificationPermission,
        setNotificationStyle
    };
};