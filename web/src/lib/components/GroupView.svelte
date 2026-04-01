<script lang="ts">
    import { getGroup } from "$lib/stores/group.svelte";
    import { getLocale } from "$lib/stores/locale.svelte";
    import BottomNav from "./BottomNav.svelte";
    import MembersTab from "./members/MembersTab.svelte";
    import InviteTab from "./invites/InviteTab.svelte";
    import ActivityTab from "./activity/ActivityTab.svelte";
    import SettingsTab from "./settings/SettingsTab.svelte";
    import Badge from "$lib/components/ui/badge/badge.svelte";

    const group = getGroup();
    const locale = getLocale();
</script>

<div class="flex-1 flex flex-col overflow-hidden relative">
    <div
        class="absolute top-0 left-0 right-0 h-[120px] pointer-events-none z-0"
        style="background: linear-gradient(180deg, rgb(var(--primary) / 0.04) 0%, transparent 100%);"
    ></div>

    <!-- Header -->
    <div class="relative z-10 px-4 pt-10 pb-3.5">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-lg font-bold tracking-tight">
                    {locale.t("app_name")}
                </h1>
                <p class="text-[11px] text-foreground/35 mt-0.5 font-medium">
                    {locale.t("member_count", group.memberCount, group.onlineCount)}
                </p>
            </div>
            {#if group.isLeader}
                <Badge
                    variant="outline"
                    class="text-[10px] font-semibold bg-primary/10 text-primary border-primary/12 uppercase tracking-wider"
                >
                    {locale.t("leader")}
                </Badge>
            {/if}
        </div>
    </div>

    <!-- Tab Content -->
    <div class="flex-1 overflow-y-auto no-scrollbar px-3 pb-3 relative z-10">
        {#if group.activeTab === "members"}
            <MembersTab />
        {:else if group.activeTab === "invite"}
            <InviteTab />
        {:else if group.activeTab === "activity"}
            <ActivityTab />
        {:else if group.activeTab === "settings"}
            <SettingsTab />
        {/if}
    </div>

    <BottomNav />
</div>
