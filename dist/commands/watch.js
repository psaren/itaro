"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chokidar = require("chokidar");
const path = require("path");
const chalk = require("chalk");
const build_1 = require("./build");
const watch = () => {
    const builder = new build_1.default(true);
    const files = path.resolve(process.cwd(), './src/**/*.{[jt]s?(x),{sc,c,le}ss,json,html,styl,vue}');
    const watcher = chokidar.watch(files, {
        ignored: /(^|[/\\])\../,
        persistent: true
    });
    builder.run();
    watcher.on('change', (file) => {
        console.log(chalk.green('file change :>> '), file);
        builder.run();
    });
};
exports.default = watch;
