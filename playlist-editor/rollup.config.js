import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";
import css from "rollup-plugin-css-only";
import livereload from "rollup-plugin-livereload";
import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";

const production = process.env.PRODUCTION;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn(
        "npm",
        ["run", "start", "--", "--dev"],
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      );

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default {
  input: "src/main.ts",
  output: {
    sourcemap: !production,
    format: "es",
    name: "app",
    dir: production ? "../src/editor/" : "public/build/",
    chunkFileNames: "[name].js",
  },
  plugins: [
    replace({
      "globalThis.youtubeServiceURL": JSON.stringify(
        production
          ? "https://www.youtube.com"
          : "http://localhost:4444/www.youtube.com:443"
      ),
      preventAssignment: true,
    }),
    svelte({
      preprocess: sveltePreprocess({ sourceMap: !production }),
      compilerOptions: {
        dev: !production,
      },
      onwarn: (warning, handler) => {
        if (warning.code === "a11y-no-onchange") return;
        handler(warning);
      },
    }),
    css({ output: "bundle.css" }),
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),
    typescript({
      sourceMap: !production,
      inlineSources: !production,
    }),
    !production && serve(),
    !production && livereload("public"),
    production && terser(),
    production &&
      copy({
        targets: [
          {
            src: "public/global.css",
            dest: "../src/editor",
          },
        ],
      }),
  ],
  watch: {
    clearScreen: false,
  },
};
