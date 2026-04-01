<script lang="ts">
    import { getGroup } from "$lib/stores/group.svelte";
    import { getLocale } from "$lib/stores/locale.svelte";
    import ToggleRow from "./ToggleRow.svelte";
    import DangerZone from "./DangerZone.svelte";
    import { toast } from "svelte-sonner";

    const group = getGroup();
    const locale = getLocale();

    const handleToggleInviting = async () => {
        if (!group.isLeader) {
            toast.error(locale.t("not_leader"));
            return;
        }
        await group.toggleInviting();
    };

    const handleToggleLocked = async () => {
        if (!group.isLeader) {
            toast.error(locale.t("not_leader"));
            return;
        }
        await group.toggleLocked(!group.isLocked);
    };
</script>

<div class="flex flex-col gap-1.5">
    <ToggleRow
        label={locale.t("allow_invites")}
        description={locale.t("allow_invites_description")}
        checked={group.isInviting}
        disabled={!group.isLeader}
        onToggle={handleToggleInviting}
    />

    <ToggleRow
        label={locale.t("lock_group")}
        description={locale.t("lock_group_description")}
        checked={group.isLocked}
        disabled={!group.isLeader}
        onToggle={handleToggleLocked}
    />

    <DangerZone />
</div>
