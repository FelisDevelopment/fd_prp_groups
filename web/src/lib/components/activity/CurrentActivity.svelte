<script lang="ts">
    import type { Activity } from "../../../types/group.types";
    import { getLocale } from "$lib/stores/locale.svelte";
    import { Compass } from "@lucide/svelte";

    const { activity }: { activity: Activity } = $props();
    const locale = getLocale();
</script>

<div
    class="bg-primary/[0.06] backdrop-blur-lg border border-primary/10 rounded-[14px] p-4 flex items-center gap-2.5"
>
    <div
        class="w-9 h-9 rounded-[10px] bg-primary/15 flex items-center justify-center"
    >
        <Compass class="w-[18px] h-[18px] text-primary" strokeWidth={2} />
    </div>
    <div>
        <div class="text-sm font-bold text-foreground/[0.875] tracking-tight">
            {activity.activityName}
        </div>
        <div
            class="text-[10px] font-medium text-primary flex items-center gap-[5px] mt-0.5"
        >
            <div
                class="w-[5px] h-[5px] rounded-full bg-primary animate-pulse"
            ></div>
            {locale.t("in_progress")}
        </div>
    </div>
</div>
