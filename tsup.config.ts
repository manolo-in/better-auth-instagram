import { defineConfig } from "tsup";

export default defineConfig([
    {
        entry: ["src/index.ts", "src/api.ts"],
        format: ["cjs", "esm"],
        dts: true,
    },
]);
