import { getContext, setContext } from "svelte";
import { useNuiEvent } from "../composables/useNuiEvent";
import { defaultThemeVariables } from "../../constants/theme";

export class ThemeStore {
    #variables: Record<string, string> | undefined = $state<Record<string, string>>();

    constructor() {
        this.setupEvents();
    }

    set variables(variables: Record<string, string>) {
        this.#variables = variables;
    }

    get variables() {
        if (!this.#variables) return defaultThemeVariables;
        return this.#variables;
    }

    private setupEvents = () => {
        useNuiEvent<Record<string, string>>("config:theme", (payload) => {
            this.#variables = payload;
        });
    };
}

export const useTheme = () => setContext("theme", new ThemeStore());
export const getTheme = () => getContext<ThemeStore>("theme");
