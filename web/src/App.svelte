<script lang="ts">
    import { Toaster } from "$lib/components/ui/sonner";
    import ThemeProvider from "$lib/components/providers/ThemeProvider.svelte";
    import { useTheme } from "$lib/stores/theme.svelte";
    import { useLocale } from "$lib/stores/locale.svelte";
    import { useApp, getApp } from "$lib/stores/app.svelte";
    import { useGroup } from "$lib/stores/group.svelte";
    import SplashScreen from "$lib/components/SplashScreen.svelte";
    import Wrapper from "$lib/components/Wrapper.svelte";

    useLocale();
    useTheme();
    useApp();
    useGroup();

    const app = getApp();
</script>

<ThemeProvider>
    {#if !app.isReady}
        <SplashScreen />
    {/if}

    <Toaster
        theme="dark"
        position="top-center"
        offset={{ top: "7vh" }}
        mobileOffset={{ top: "7vh" }}
    />
    <Wrapper />
</ThemeProvider>
