<script lang="ts">
    import { getGroup } from "$lib/stores/group.svelte";
    import { getLocale } from "$lib/stores/locale.svelte";
    import { Users, UserPlus, ListOrdered, Settings } from "@lucide/svelte";
    import type { TabId } from "../../types/group.types";

    const group = getGroup();
    const locale = getLocale();

    const tabs: { id: TabId; label: string; icon: typeof Users }[] = [
        { id: "members", label: "members", icon: Users },
        { id: "invite", label: "invite", icon: UserPlus },
        { id: "activity", label: "queue", icon: ListOrdered },
        { id: "settings", label: "settings", icon: Settings },
    ];
</script>

<nav
    class="border-t border-border bg-background/80 backdrop-blur-xl px-4 pt-2.5 pb-6 flex justify-around items-center"
>
    {#each tabs as tab}
        <button
            class="flex flex-col items-center gap-[3px] relative cursor-pointer"
            onclick={() => group.changeTab(tab.id)}
        >
            {#if group.activeTab === tab.id}
                <div
                    class="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full"
                ></div>
            {/if}
            <tab.icon
                class="w-[18px] h-[18px] {group.activeTab === tab.id
                    ? 'text-primary'
                    : 'text-foreground/25'}"
                strokeWidth={2}
            />
            <span
                class="text-[9px] font-medium {group.activeTab === tab.id
                    ? 'text-primary font-semibold'
                    : 'text-foreground/25'}"
            >
                {locale.t(tab.label)}
            </span>
        </button>
    {/each}
</nav>
