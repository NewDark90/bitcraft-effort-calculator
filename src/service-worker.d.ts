
declare interface ServiceWorkerMessage<TType extends string = string, TPayload = any> {
    type: TType;
    payload: TPayload;
    id?: string; // Optional message ID for request-response tracking
}

declare type ServiceWorkerMessageEventCraftNotificationQueueRequest = ServiceWorkerMessage<'craft-notification.request.queue', {finishMs: number}>;

declare type ServiceWorkerMessageEventCraftNotificationCancelRequest = ServiceWorkerMessage<'craft-notification.request.cancel', void>;

declare type ServiceWorkerMessageEventRequest = ServiceWorkerMessageEventCraftNotificationQueueRequest | ServiceWorkerMessageEventCraftNotificationCancelRequest;



declare type ServiceWorkerMessageEventCraftNotificationCompleteResponse = ServiceWorkerMessage<'craft-notification.response.complete', void>;

declare type ServiceWorkerMessageEventResponse = ServiceWorkerMessageEventCraftNotificationCompleteResponse;
