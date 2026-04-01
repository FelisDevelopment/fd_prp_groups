import { onDestroy } from "svelte";
import type { EventCallback, NuiEventData } from "../../types/various.types";

const eventRegistry = new Map<string, Set<EventCallback>>();
let isListening = false;

const messageHandler = (payload: MessageEvent<NuiEventData<any>>) => {
    const { action, data } = payload.data;
    if (!action) return;

    const callbacks = eventRegistry.get(action);
    if (!callbacks) return;

    callbacks.forEach((callback) => {
        try {
            callback(data);
        } catch (error) {
            console.error(`Error in NUI event handler for "${action}":`, error);
        }
    });
};

const attach = () => {
    if (isListening) return;
    window.addEventListener("message", messageHandler);
    isListening = true;
};

const detach = () => {
    if (!isListening) return;
    if (eventRegistry.size !== 0) return;
    window.removeEventListener("message", messageHandler);
    isListening = false;
};

export const useNuiEvent = <T>(event: string, callback: (data: T) => void) => {
    attach();

    if (!eventRegistry.has(event)) {
        eventRegistry.set(event, new Set());
    }

    const callbacks = eventRegistry.get(event)!;
    callbacks.add(callback);

    onDestroy(() => {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
            eventRegistry.delete(event);
        }
        detach();
    });
};
