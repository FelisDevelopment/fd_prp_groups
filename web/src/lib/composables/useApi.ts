import type { UseApiReturn } from "../../types/various.types";
import { getParentResource } from "../utils/getParentResource";
import { isDevelopment } from "../utils/isDevelopment";

export const useApi = async <T>(
    url: string,
    body?: any,
    other?: {
        options?: RequestInit;
        mockData?: T;
    },
): Promise<UseApiReturn<T>> => {
    const parentResource = getParentResource();

    if (other?.mockData && isDevelopment) {
        return new Promise<UseApiReturn<T>>((resolve) => {
            setTimeout(() => {
                resolve({ data: other.mockData });
            }, 500);
        });
    }

    const resolvedUrl = `https://${parentResource}/${url}`;

    try {
        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=UTF-8" },
            body: body ? JSON.stringify(body) : undefined,
            ...other?.options,
        };

        const rawResponse = await fetch(resolvedUrl, options);
        if (!rawResponse.ok) return { error: true };

        const formattedResponse = await rawResponse.json();
        return { data: formattedResponse as unknown as T };
    } catch (error) {
        return { error: true };
    }
};
