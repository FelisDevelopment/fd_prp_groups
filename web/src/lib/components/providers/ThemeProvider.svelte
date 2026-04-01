<script lang="ts">
    import { getTheme } from "$lib/stores/theme.svelte";

    const { children } = $props();
    const theme = getTheme();

    const applyVariables = () => {
        for (const [key, value] of Object.entries(theme.variables)) {
            document.documentElement.style.setProperty(`--${key}`, value as string);
        }
    };

    $effect(applyVariables);
</script>

{#if children}
    {@render children()}
{/if}
