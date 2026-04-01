<script lang="ts">
    import { onMount } from "svelte";
    import { getGroup } from "$lib/stores/group.svelte";
    import { getLocale } from "$lib/stores/locale.svelte";
    import ScanIndicator from "./ScanIndicator.svelte";
    import NearbyPlayerCard from "./NearbyPlayerCard.svelte";
    import PendingInviteCard from "./PendingInviteCard.svelte";
    import { toast } from "svelte-sonner";

    const group = getGroup();
    const locale = getLocale();

    let refreshInterval: ReturnType<typeof setInterval>;

    onMount(() => {
        group.refreshNearby();
        refreshInterval = setInterval(() => group.refreshNearby(), 5000);
        return () => clearInterval(refreshInterval);
    });

    const handleInvite = async (src: number | string) => {
        const result = await group.invite(src);
        if (result?.success) {
            toast.success(locale.t("invite_sent"));
        } else {
            toast.error(locale.t(result?.error ?? "error_occurred"));
        }
    };

    const pendingPlayers = $derived(
        group.nearbyPlayers.filter((p) => group.pendingInvites.has(p.src))
    );

    const availablePlayers = $derived(
        group.nearbyPlayers.filter((p) => !group.pendingInvites.has(p.src))
    );
</script>

<div class="flex flex-col gap-1.5">
    <ScanIndicator />

    {#each availablePlayers as player (player.src)}
        <NearbyPlayerCard
            {player}
            isPending={false}
            onInvite={handleInvite}
        />
    {/each}

    {#if availablePlayers.length === 0 && pendingPlayers.length === 0}
        <div class="text-center py-8 text-[12px] text-foreground/25 font-medium">
            {locale.t("no_nearby_players")}
        </div>
    {/if}

    {#if pendingPlayers.length > 0}
        <div class="flex items-center gap-2 my-2">
            <div class="flex-1 h-px bg-foreground/5"></div>
            <span class="text-[10px] font-semibold text-foreground/20 uppercase tracking-wider">
                {locale.t("pending")}
            </span>
            <div class="flex-1 h-px bg-foreground/5"></div>
        </div>

        {#each pendingPlayers as player (player.src)}
            <PendingInviteCard name={player.characterName} />
        {/each}
    {/if}
</div>
