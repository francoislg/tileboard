import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import globals from "rollup-plugin-node-globals";
import postcss from "rollup-plugin-postcss";

const tsPlugin = () => typescript({
    useTsconfigDeclarationDir: true,
    rollupCommonJSResolveHack: true
})

const serverConfig = {
    input: './App/server.tsx',
    output: [{
        file: "./assets/server.js",
        format: 'umd',
        name: 'tipboard-server',
        sourcemap: true,
    }],
    plugins: [
        tsPlugin(),
        commonjs(),
        json(),
        postcss(),
    ]
}

const clientConfig = {
    input: './App/client.tsx',
    output: [{
        file: "./assets/client.js",
        format: 'umd',
        name: 'tipboard-client',
        sourcemap: true,
    }],
    plugins: [
        tsPlugin(),
        commonjs(),
        nodeResolve({
            browser: true,
            preferBuiltins: true
        }),
        globals(),
        postcss(),
    ],
}

export default [serverConfig, clientConfig];
