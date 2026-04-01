import { getContext, setContext } from "svelte";
import { isDevelopment } from "../utils/isDevelopment";
import { useNuiEvent } from "../composables/useNuiEvent";

class AppStore {
    isReady: boolean = $state(isDevelopment);

    constructor() {
        this.setupEvents();
    }

    private setupEvents = () => {
        useNuiEvent("app:ready", () => {
            this.isReady = true;
        });
    };
}

export const useApp = () => setContext("app", new AppStore());
export const getApp = () => getContext<AppStore>("app");
