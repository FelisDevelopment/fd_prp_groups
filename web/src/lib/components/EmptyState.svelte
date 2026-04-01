<script lang="ts">
    import { getGroup } from "$lib/stores/group.svelte";
    import { getLocale } from "$lib/stores/locale.svelte";
    import { Users } from "@lucide/svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { toast } from "svelte-sonner";

    const group = getGroup();
    const locale = getLocale();

    let isCreating = $state(false);

    const handleCreate = async () => {
        if (isCreating) return;
        isCreating = true;

        const result = await group.createGroup();
        if (!result?.success) {
            toast.error(locale.t(result?.error ?? "error_occurred"));
        } else {
            toast.success(locale.t("group_created"));
        }

        isCreating = false;
    };
</script>

<div class="flex-1 flex flex-col items-center justify-center px-6 relative">
    <div
        class="absolute top-0 left-0 right-0 h-[120px] pointer-events-none"
        style="background: linear-gradient(180deg, rgb(var(--primary) / 0.04) 0%, transparent 100%);"
    ></div>

    <div class="relative z-10 flex flex-col items-center gap-5">
        <div
            class="w-[72px] h-[72px] rounded-2xl flex items-center justify-center border border-primary/15 bg-primary/10"
        >
            <Users class="w-8 h-8 text-primary" strokeWidth={1.5} />
        </div>

        <div class="flex flex-col items-center gap-1.5">
            <h2 class="text-xl font-bold tracking-tight text-foreground">
                {locale.t("no_group_title")}
            </h2>
            <p
                class="text-[13px] text-foreground/35 max-w-[220px] text-center leading-relaxed"
            >
                {locale.t("no_group_description")}
            </p>
        </div>

        <Button
            class="mt-1 px-9 py-2.5 rounded-[10px] font-bold text-[13px] shadow-[0_0_24px_rgb(var(--primary)/0.2),0_4px_12px_rgba(0,0,0,0.4)]"
            disabled={isCreating}
            onclick={handleCreate}
        >
            {locale.t("create_group")}
        </Button>
    </div>
</div>
