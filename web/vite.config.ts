import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import path from "path";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig(({ mode }) => {
    return {
        base:
            mode === "development" || process.env.FOR_PREVIEW == "true"
                ? "/"
                : "/web/dist/",

        plugins: [tailwindcss(), svelte()],

        resolve: {
            alias: {
                $lib: path.resolve("./src/lib"),
            },
        },
    };
});
