<script lang="ts">
    import type { NearbyPlayer } from "../../../types/group.types";
    import { getLocale } from "$lib/stores/locale.svelte";
    import Button from "$lib/components/ui/button/button.svelte";

    const {
        player,
        isPending,
        onInvite,
    }: {
        player: NearbyPlayer;
        isPending: boolean;
        onInvite: (src: number | string) => void;
    } = $props();

    const locale = getLocale();

    const initials = $derived(
        player.characterName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
    );
</script>

<div
    class="bg-foreground/[0.02] backdrop-blur-lg border border-foreground/[0.05] rounded-xl p-3 flex items-center gap-2.5"
>
    <div
        class="w-[38px] h-[38px] rounded-xl bg-foreground/[0.04] flex items-center justify-center text-[13px] font-bold text-foreground/50"
    >
        {initials}
    </div>

    <div class="flex-1 min-w-0">
        <div class="text-[13px] font-semibold tracking-tight text-foreground/[0.875]">
            {player.characterName}
        </div>
        <div class="text-[10px] font-medium text-foreground/35">
            {locale.t("away", player.distance)}
        </div>
    </div>

    {#if player.inGroup}
        <span class="text-[10px] text-foreground/35 font-medium">
            {locale.t("in_group")}
        </span>
    {:else if isPending}
        <div
            class="w-[18px] h-[18px] border-2 border-primary/35 border-t-transparent rounded-full animate-spin"
        ></div>
    {:else}
        <Button
            size="sm"
            class="text-[11px] font-bold px-4 py-1.5 rounded-lg shadow-[0_2px_8px_rgb(var(--primary)/0.2)]"
            onclick={() => onInvite(player.src)}
        >
            {locale.t("invite")}
        </Button>
    {/if}
</div>
