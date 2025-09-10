// @ts-check
/// <reference lib="ES2015" />
/// <reference lib="webworker" />

// Using IIFE to provide closure to redefine `self`
(() => {
    // This is a little messy, but necessary to force type assertion
    // prettier-ignore
    const self = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (globalThis.self));




    self.addEventListener('install', (event) => {
        // ...

    });

    self.addEventListener('fetch', (event) => {
        const requestUrl = new URL(event.request.url);
        if (event.request.method === 'POST' && requestUrl.pathname.startsWith('/webworker')) {

        }

        return fetch(event.request);
    })
})();