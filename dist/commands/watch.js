"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chokidar = require("chokidar");
const path = require("path");
const build_1 = require("./build");
const chalk = require("chalk");
const watch = () => {
    const files = path.resolve(process.cwd(), './src/**/*.{[jt]s?(x),{sc,c,le}ss,json,html,styl}');
    const watcher = chokidar.watch(files, {
        ignored: /(^|[/\\])\../,
        persistent: true
    });
    build_1.default();
    watcher.on('change', (file) => {
        console.log(chalk.green('file change :>> '), file);
        build_1.default();
    });
};
exports.default = watch;
