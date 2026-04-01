<script lang="ts">
    import type { Member } from "../../../types/group.types";
    import { getGroup } from "$lib/stores/group.svelte";
    import { getLocale } from "$lib/stores/locale.svelte";
    import { X } from "@lucide/svelte";

    const { member, onKick }: { member: Member; onKick?: (src: number | string) => void } = $props();

    const group = getGroup();
    const locale = getLocale();

    const initials = $derived(
        member.characterName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
    );
</script>

<div
    class="backdrop-blur-lg rounded-xl p-3 flex items-center gap-2.5 {member.isLeader
        ? 'bg-primary/[0.04] border border-primary/[0.08]'
        : 'bg-foreground/[0.02] border border-foreground/[0.05]'} {!member.online
        ? 'opacity-45'
        : ''}"
>
    <div class="relative">
        <div
            class="w-[38px] h-[38px] rounded-xl flex items-center justify-center text-[13px] font-bold {member.isLeader
                ? 'bg-primary/15 text-primary border border-primary/10'
                : 'bg-foreground/[0.04] text-foreground/50'}"
        >
            {initials}
        </div>
        <div
            class="absolute -bottom-px -right-px w-2.5 h-2.5 rounded-full border-2 border-background {member.online
                ? 'bg-primary'
                : 'bg-[#282828]'}"
        ></div>
    </div>

    <div class="flex-1 min-w-0">
        <div class="text-[13px] font-semibold tracking-tight text-foreground/[0.875]">
            {member.characterName}
        </div>
        <div class="text-[10px] font-medium {member.online ? 'text-foreground/35' : 'text-foreground/20'}">
            {member.online ? locale.t("online") : locale.t("offline")}
        </div>
    </div>

    {#if member.isLeader}
        <span class="text-[13px] text-primary/70">👑</span>
    {:else if group.isLeader && onKick}
        <button
            class="w-7 h-7 rounded-lg bg-destructive/[0.06] border border-destructive/10 flex items-center justify-center cursor-pointer hover:bg-destructive/15 transition-colors"
            onclick={() => onKick(member.src)}
        >
            <X class="w-[13px] h-[13px] text-destructive/70" strokeWidth={2} />
        </button>
    {/if}
</div>
