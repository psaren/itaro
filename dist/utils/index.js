"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
function getRootPath() {
    return path.resolve(__dirname, '../../');
}
exports.getRootPath = getRootPath;
function getPkgVersion() {
    return require(path.join(getRootPath(), 'package.json')).version;
}
exports.getPkgVersion = getPkgVersion;
function printPkgVersion() {
    const taroVersion = getPkgVersion();
    console.log(`itaro v${taroVersion}`);
    console.log();
}
exports.printPkgVersion = printPkgVersion;
exports.isObject = (arg) => Object.prototype.toString.call(arg) === '[object Object]';
exports.isArray = (arg) => Array.isArray(arg);
exports.isTest = process.env.NODE_ENV === 'dev';
exports.sleep = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));
