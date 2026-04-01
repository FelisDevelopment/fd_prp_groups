<script lang="ts">
    import { getLocale } from "$lib/stores/locale.svelte";
    const locale = getLocale();
</script>

<div
    class="flex items-center gap-2 px-3 py-2 bg-primary/[0.04] border border-primary/[0.08] rounded-[10px]"
>
    <div class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
    <span class="text-[11px] text-foreground/35 font-medium">
        {locale.t("scanning")}
    </span>
</div>
