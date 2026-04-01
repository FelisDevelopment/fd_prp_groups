<script lang="ts">
    const {
        label,
        description,
        checked,
        disabled = false,
        onToggle,
    }: {
        label: string;
        description: string;
        checked: boolean;
        disabled?: boolean;
        onToggle: () => void;
    } = $props();
</script>

<div
    class="bg-foreground/[0.02] backdrop-blur-lg border border-foreground/[0.05] rounded-xl p-3.5 flex items-center justify-between"
>
    <div>
        <div class="text-[13px] font-semibold tracking-tight text-foreground/[0.875]">
            {label}
        </div>
        <div class="text-[10px] text-foreground/35 font-medium mt-0.5">
            {description}
        </div>
    </div>

    <button
        class="w-[42px] h-6 rounded-xl relative cursor-pointer transition-colors {checked
            ? 'bg-primary shadow-[0_0_8px_rgb(var(--primary)/0.15)]'
            : 'bg-foreground/[0.06] border border-foreground/[0.05]'}"
        {disabled}
        onclick={onToggle}
    >
        <div
            class="w-5 h-5 rounded-full absolute top-0.5 transition-all {checked
                ? 'right-0.5 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)]'
                : 'left-0.5 bg-foreground/25'}"
        ></div>
    </button>
</div>
