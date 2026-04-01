<script lang="ts">
    import type { PartyStatus } from "../../../types/group.types";
    import { getGroup } from "$lib/stores/group.svelte";
    import { getLocale } from "$lib/stores/locale.svelte";

    const { partyStatus }: { partyStatus: PartyStatus | null } = $props();
    const group = getGroup();
    const locale = getLocale();
</script>

<div
    class="bg-foreground/[0.02] backdrop-blur-lg border border-foreground/[0.05] rounded-[14px] p-4 flex flex-col gap-3"
>
    <div class="flex justify-between items-center">
        <span class="text-[12px] font-semibold text-foreground/50">
            {locale.t("party_status")}
        </span>
        <span
            class="text-[10px] py-[3px] px-2.5 rounded-md font-semibold border bg-primary/[0.08] text-primary border-primary/12"
        >
            {locale.t("in_queue")}
        </span>
    </div>

    {#if partyStatus?.queueName}
        <div class="h-px bg-foreground/[0.04]"></div>
        <div class="flex justify-between items-center">
            <span class="text-[12px] text-foreground/35 font-medium">
                {locale.t("queue_name")}
            </span>
            <span class="text-[13px] font-bold text-foreground/[0.875]">
                {partyStatus.queueName}
            </span>
        </div>
    {/if}

    {#if partyStatus?.position != null}
        <div class="flex justify-between items-center">
            <span class="text-[12px] text-foreground/35 font-medium">
                {locale.t("queue_position")}
            </span>
            <span class="text-[15px] font-extrabold text-foreground/[0.875] tracking-tight">
                #{partyStatus.position}
            </span>
        </div>
    {/if}

    <div class="flex justify-between items-center">
        <span class="text-[12px] text-foreground/35 font-medium">
            {locale.t("party_members")}
        </span>
        <span class="text-[13px] font-bold text-foreground/[0.875]">
            {group.memberCount}
        </span>
    </div>
</div>
