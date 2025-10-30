import { defineConfig } from "tsdown";

export default defineConfig([
    {
        entry: ["src/index.ts", "src/api.ts", "src/tools.ts"],
        format: ["cjs", "esm"],
        dts: {
            sourcemap: false
        },
        // exports: true,
    },
]);
