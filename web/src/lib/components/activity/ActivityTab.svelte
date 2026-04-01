<script lang="ts">
    import { onMount } from "svelte";
    import { getGroup } from "$lib/stores/group.svelte";
    import { getLocale } from "$lib/stores/locale.svelte";
    import CurrentActivity from "./CurrentActivity.svelte";
    import QueueStatus from "./QueueStatus.svelte";

    const group = getGroup();
    const locale = getLocale();

    const hasContent = $derived(group.activity || group.partyStatus?.active);

    onMount(() => {
        group.refreshPartyStatus();
    });
</script>

<div class="flex flex-col gap-2.5">
    {#if group.activity}
        <CurrentActivity activity={group.activity} />
    {/if}

    {#if group.partyStatus?.active}
        {#if group.activity}
            <div class="flex items-center gap-2 my-1">
                <div class="flex-1 h-px bg-foreground/5"></div>
                <span class="text-[10px] font-semibold text-foreground/20 uppercase tracking-wider">
                    {locale.t("queue")}
                </span>
                <div class="flex-1 h-px bg-foreground/5"></div>
            </div>
        {/if}

        <QueueStatus partyStatus={group.partyStatus} />
    {/if}

    {#if !hasContent}
        <div class="flex-1 flex items-center justify-center py-12">
            <p class="text-[12px] text-foreground/20 font-medium">
                {locale.t("not_in_queue")}
            </p>
        </div>
    {/if}
</div>
