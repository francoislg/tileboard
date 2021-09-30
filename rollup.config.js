import typescript from '@rollup/plugin-typescript';
import autoPreprocess from "svelte-preprocess";
import resolve from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import postcss from "rollup-plugin-postcss";
import svelte from "rollup-plugin-svelte";

const serverConfig = {
    input: './App/server.ts',
    output: [{
        file: "./assets/server.js",
        format: 'umd',
        name: 'tipboard-server',
        sourcemap: true,
    }],
    plugins: [
        svelte({
            preprocess: autoPreprocess(),
        }),
        typescript(),
        postcss(),
        commonjs(),
        json(),
    ]
}

const clientConfig = {
    input: './App/client.ts',
    output: [{
        file: "./assets/client.js",
        format: 'iife',
        name: 'tipboardclient',
        sourcemap: true,
    }],
    plugins: [
        svelte({
            preprocess: autoPreprocess(),
            exclude: ["ws"]
        }),
        typescript({
            sourceMap: true
        }),
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs(),
        postcss(),
        json(),
    ],
}

export default [serverConfig, clientConfig];
