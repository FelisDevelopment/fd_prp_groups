<script lang="ts">
    import { getGroup } from "$lib/stores/group.svelte";
    import { getLocale } from "$lib/stores/locale.svelte";
    import MemberCard from "./MemberCard.svelte";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import Button from "$lib/components/ui/button/button.svelte";
    import { toast } from "svelte-sonner";

    const group = getGroup();
    const locale = getLocale();

    let kickTarget: { src: number | string; name: string } | null = $state(null);
    let isKicking = $state(false);

    const sortedMembers = $derived(
        [...group.members].sort((a, b) => {
            if (a.isLeader) return -1;
            if (b.isLeader) return 1;
            if (a.online && !b.online) return -1;
            if (!a.online && b.online) return 1;
            return 0;
        })
    );

    const handleKickRequest = (src: number | string) => {
        const member = group.members.find((m) => m.src === src);
        if (member) kickTarget = { src, name: member.characterName };
    };

    const confirmKick = async () => {
        if (!kickTarget || isKicking) return;
        isKicking = true;

        const result = await group.kick(kickTarget.src);
        if (result?.success) {
            toast.success(locale.t("member_kicked"));
        } else {
            toast.error(locale.t("error_occurred"));
        }

        kickTarget = null;
        isKicking = false;
    };
</script>

<div class="flex flex-col gap-1.5">
    {#each sortedMembers as member (member.identifier)}
        <MemberCard {member} onKick={handleKickRequest} />
    {/each}
</div>

<AlertDialog.Root open={!!kickTarget} onOpenChange={(open) => { if (!open) kickTarget = null; }}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>{locale.t("kick_confirm_title")}</AlertDialog.Title>
            <AlertDialog.Description>
                {locale.t("kick_confirm_description", kickTarget?.name ?? "")}
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel>{locale.t("cancel")}</AlertDialog.Cancel>
            <Button variant="destructive" onclick={confirmKick} disabled={isKicking}>
                {locale.t("confirm")}
            </Button>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
