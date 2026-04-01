<script lang="ts">
    import { getGroup } from "$lib/stores/group.svelte";
    import EmptyState from "./EmptyState.svelte";
    import GroupView from "./GroupView.svelte";

    const group = getGroup();
</script>

<div class="fixed inset-0 bg-background overflow-hidden flex flex-col">
    {#if group.inGroup}
        <GroupView />
    {:else}
        <EmptyState />
    {/if}
</div>
