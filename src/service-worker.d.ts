declare type MessageEventData = MessageEventCraftNotficiationQueueData | MessageEventCraftNotficiationCancelData;

declare type MessageEventCraftNotficiationQueueData = {
    type: 'craft-notification.queue';
    finishMs: number;
}

declare type MessageEventCraftNotficiationCancelData = {
    type: 'craft-notification.cancel';
}

declare type MessageEventCraftNotficiationQueueResolver = (result: null | MessageEventCraftNotficiationQueueData) => void