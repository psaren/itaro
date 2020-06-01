"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shell = require("shelljs");
const path = require("path");
setTimeout(() => {
    if (process.argv.length > 2) {
        const name = process.argv[2];
        const dest = path.resolve(__dirname, `../../${name}/`);
        shell.mkdir('-p', dest);
        shell.cp('-Rf', path.resolve(__dirname, '../../config/**/*'), dest);
    }
    else {
        console.log('缺少目录名');
    }
}, 4000);
