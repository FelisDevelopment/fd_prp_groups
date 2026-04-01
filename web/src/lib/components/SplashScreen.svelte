<script lang="ts">
    import { onMount } from "svelte";
    import { fly, scale } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import { getLocale } from "$lib/stores/locale.svelte";
    import { Users } from "@lucide/svelte";

    const locale = getLocale();
    let isLoaded = $state(false);

    onMount(() => {
        setTimeout(() => (isLoaded = true), 300);
    });
</script>

<div
    class="fixed inset-0 flex items-center justify-center overflow-hidden bg-background z-[999]"
    out:fly={{ y: -1000, duration: 800, easing: cubicOut }}
>
    <div
        class="relative z-10 flex flex-col items-center gap-6 px-6"
        out:scale={{ duration: 600, start: 1.2, opacity: 0, easing: cubicOut }}
    >
        <div
            class="transition-all duration-700 {isLoaded
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'}"
        >
            <div
                class="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/15 border border-primary/15"
            >
                <Users class="h-10 w-10 text-primary" strokeWidth={1.5} />
            </div>
        </div>
        <div
            class="flex flex-col items-center gap-2 text-center transition-all duration-700 delay-200 {isLoaded
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'}"
        >
            <h1 class="text-3xl font-bold tracking-tight text-foreground">
                {locale.t("app_name")}
            </h1>
        </div>
    </div>
</div>
