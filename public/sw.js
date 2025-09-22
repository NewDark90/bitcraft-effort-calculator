// @ts-check
/// <reference lib="ES2015" />
/// <reference lib="webworker" />
/// <reference types="../src/service-worker.d.ts" />

class CancellableTimeout {
  constructor(delay, data) {
    this.timeoutId = null;
    this.reject = null;
    this.isCancelled = false;
    
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      
      this.timeoutId = setTimeout(() => {
        resolve(data);
      }, delay);
    });
  }
  
  cancel(rejectData) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.isCancelled = true;
      // @ts-ignore reject is defined immediately in the promise initialization even if it is a callback.
      this.reject(rejectData);
    }
  }
  
  then(onFulfilled, onRejected) {
    return this.promise.then(onFulfilled, onRejected);
  }
  
  catch(onRejected) {
    return this.promise.catch(onRejected);
  }

  finally(onFinally) {
    return this.promise.finally(onFinally);
  }
}


// Using IIFE to provide closure to redefine `self`
(() => {
    // This is a little messy, but necessary to force type assertion
    // prettier-ignore
    const self = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (globalThis.self));


    self.addEventListener('install', (event) => {
        // ...
        
    });

    /** @type {CancellableTimeout | null} */
    let notificationPromise = null; 

    /** 
     * @param {ExtendableMessageEvent} event 
     * @param {ServiceWorkerMessageEventCraftNotificationQueueRequest} eventData 
     * */
    const craftNotificationQueue = async (event, eventData) => {
        
        event.waitUntil((async () => {
            craftNotificationCancel();
            notificationPromise = new CancellableTimeout(eventData.payload.finishMs, eventData);
            notificationPromise.then((eventData) => {
                
                // Notify
                self.registration.showNotification('test');
                /*
                self.registration.showNotification("Vibration Sample", {
                    body: "Buzz! Buzz!",
                    //icon: "../images/touch/chrome-touch-icon-192x192.png",

                    //vibrate: [200, 100, 200, 100, 200, 100, 200],
                    tag: "vibration-sample",
                });
                */
            }).catch((err) => {
                if (err == null) {
                    // Swallow cancellation
                    return;
                }
                console.error("Error in notification", err);                
            })
            .finally(() => {
                notificationPromise = null;
            });

        })());

    };

    const craftNotificationCancel = () => {
        notificationPromise?.cancel(null);
        notificationPromise = null;
    };

    self.addEventListener('message', (event) => {

        
        const eventData =/** @type {ServiceWorkerMessageEventRequest} */  event.data;
        if (eventData.type === "craft-notification.request.queue") {
            craftNotificationQueue(event, eventData);
        } else if (eventData.type === "craft-notification.request.cancel") {
            craftNotificationCancel();
        }
        
    })


})();