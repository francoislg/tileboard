import typescript from '@rollup/plugin-typescript';
import autoPreprocess from "svelte-preprocess";
import resolve from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import postcss from "rollup-plugin-postcss";
import svelte from "rollup-plugin-svelte";
import replace from '@rollup/plugin-replace';

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
    context: 'window',
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
            compilerOptions: {
                dev: true,
                sourcemap: true,
            },
            exclude: ["ws"]
        }),
        typescript({
            sourceMap: true
        }),
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        replace({
			preventAssignment: true,
			'process.env.NODE_ENV': JSON.stringify('production'),
		}),
        commonjs(),
        postcss(),
        json(),
    ],
}

export default [serverConfig, clientConfig];
