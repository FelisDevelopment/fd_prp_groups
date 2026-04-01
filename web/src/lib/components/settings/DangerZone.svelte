<script lang="ts">
    import { getGroup } from "$lib/stores/group.svelte";
    import { getLocale } from "$lib/stores/locale.svelte";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import Button from "$lib/components/ui/button/button.svelte";
    import { toast } from "svelte-sonner";

    const group = getGroup();
    const locale = getLocale();

    let isOpen = $state(false);
    let isLeaving = $state(false);

    const handleConfirm = async () => {
        if (isLeaving) return;
        isLeaving = true;

        const wasLeader = group.isLeader;
        const result = await group.leave();
        if (result?.success) {
            toast.success(
                wasLeader
                    ? locale.t("group_disbanded")
                    : locale.t("left_group")
            );
        } else {
            toast.error(locale.t("error_occurred"));
        }

        isOpen = false;
        isLeaving = false;
    };

    const title = $derived(
        group.isLeader
            ? locale.t("disband_confirm_title")
            : locale.t("leave_confirm_title")
    );

    const description = $derived(
        group.isLeader
            ? locale.t("disband_confirm_description")
            : locale.t("leave_confirm_description")
    );

    const buttonLabel = $derived(
        group.isLeader
            ? locale.t("disband_group")
            : locale.t("leave_group")
    );
</script>

<div class="flex items-center gap-2 my-2">
    <div class="flex-1 h-px bg-destructive/12"></div>
    <span class="text-[10px] font-semibold text-destructive/40 uppercase tracking-wider">
        {locale.t("danger_zone")}
    </span>
    <div class="flex-1 h-px bg-destructive/12"></div>
</div>

<button
    class="w-full py-3.5 rounded-xl text-[13px] font-semibold cursor-pointer transition-colors bg-destructive/[0.05] border border-destructive/12 text-destructive/80 hover:bg-destructive/10"
    onclick={() => (isOpen = true)}
>
    {buttonLabel}
</button>

<AlertDialog.Root open={isOpen} onOpenChange={(open) => (isOpen = open)}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>{title}</AlertDialog.Title>
            <AlertDialog.Description>{description}</AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel>{locale.t("cancel")}</AlertDialog.Cancel>
            <Button variant="destructive" onclick={handleConfirm} disabled={isLeaving}>
                {locale.t("confirm")}
            </Button>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
