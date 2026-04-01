export interface NuiEventData<T> {
    action: string;
    data: T;
}

export type EventCallback<T = any> = (data: T) => void;

export interface UseApiReturn<T> {
    data?: T;
    error?: boolean;
}
