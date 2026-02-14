import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import alias from "@rollup/plugin-alias";
import copy from "rollup-plugin-copy";
import css from "rollup-plugin-css-only";
import livereload from "rollup-plugin-livereload";
import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import path from "path";

const production = process.env.PRODUCTION;

export default {
  input: "src/main.ts",
  output: {
    sourcemap: !production,
    format: "es",
    name: "app",
    dir: production ? "../extension/editor/build/" : "public/build/",
    chunkFileNames: "[name].js",
  },
  plugins: [
    alias({
      entries: [
        { find: "@yph/core", replacement: path.resolve(__dirname, "../core/index.ts") },
        { find: "@yph/ui-kit", replacement: path.resolve(__dirname, "../ui-kit/index.ts") }
      ]
    }),
    replace({
      globalThis: JSON.stringify({
        youtubeServiceURL: production
          ? "https://www.youtube.com"
          : "http://localhost:4444/www.youtube.com:443",
      }),
      preventAssignment: true,
    }),
    svelte({
      preprocess: sveltePreprocess({ sourceMap: !production }),
      compilerOptions: {
        dev: !production,
      },
    }),
    css({ output: "bundle.css" }),
    resolve({
      browser: true,
      dedupe: ["svelte"],
      extensions: [".mjs", ".js", ".json", ".node", ".ts", ".svelte"]
    }),
    commonjs(),
    typescript({
      sourceMap: !production,
      inlineSources: !production,
      tsconfig: "./tsconfig.json",
      include: [
        "src/**/*",
        "../core/**/*",
        "../ui-kit/**/*"
      ]
    }),

    production && terser(),
    production &&
      copy({
        targets: [
          { src: "public/global.css", dest: "../extension/editor" },
          { src: "public/favicon.png", dest: "../extension/editor" },
          { src: "public/index.html", dest: "../extension/editor" }
        ],
      }),
  ],
  watch: {
    clearScreen: false,
  },
};
