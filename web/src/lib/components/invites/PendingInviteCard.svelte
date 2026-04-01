<script lang="ts">
    import { getLocale } from "$lib/stores/locale.svelte";

    const { name }: { name: string } = $props();
    const locale = getLocale();

    const initials = $derived(
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
    );
</script>

<div
    class="bg-primary/[0.03] backdrop-blur-lg border border-primary/[0.08] rounded-xl p-3 flex items-center gap-2.5"
>
    <div
        class="w-[38px] h-[38px] rounded-xl bg-primary/[0.06] border border-primary/10 flex items-center justify-center text-[13px] font-bold text-primary"
    >
        {initials}
    </div>

    <div class="flex-1 min-w-0">
        <div class="text-[13px] font-semibold tracking-tight text-foreground/[0.875]">
            {name}
        </div>
        <div class="text-[10px] font-medium text-primary">
            {locale.t("awaiting_response")}
        </div>
    </div>

    <div
        class="w-[18px] h-[18px] border-2 border-primary/35 border-t-transparent rounded-full animate-spin"
    ></div>
</div>
