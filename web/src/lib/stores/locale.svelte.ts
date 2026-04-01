import { getContext, setContext } from "svelte";
import { MockedLocales } from "../../mocks/group.mock";
import { useApi } from "../composables/useApi";
import { printf } from "fast-printf";
import { isDevelopment } from "../utils/isDevelopment";

export class LocaleStore {
    #strings: Record<string, string> | undefined = $state<Record<string, string>>({});

    constructor() {
        this.fetchLocales();
    }

    set strings(strings: Record<string, string>) {
        this.#strings = strings;
    }

    t(key: string, ...args: any[]) {
        if (!this.#strings) return key;
        if (!args) args = [];
        return this.#strings[key] ? printf(this.#strings[key], ...args) : key;
    }

    private fetchLocales = async () => {
        const { data, error } = await useApi<Record<string, string>>("locales", undefined, {
            mockData: MockedLocales,
        });

        if (error || !data) return;
        this.#strings = data;
    };
}

export const useLocale = () => setContext("locale", new LocaleStore());
export const getLocale = () => getContext<LocaleStore>("locale");
