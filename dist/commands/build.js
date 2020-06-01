"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const shell = require("shelljs");
const chalk = require("chalk");
const utils_1 = require("../utils");
const rootCwd = process.cwd();
const pkgJson = require(path.resolve(rootCwd, './package.json'));
const VALID_OPTIONS = [
    'weapp',
    'swan',
    'alipay',
    'tt',
    'h5',
    'rn',
    'qq',
    'quickapp',
    'jd'
];
function getBuildOptions(arr, output) {
    if (!Array.isArray(arr))
        return [];
    const res = [];
    arr.forEach(item => {
        if (typeof item === 'string') {
            res.push({
                name: item,
                command: `npm run build:${item}`,
                output: `${output}/${item}`
            });
        }
        else if (utils_1.isObject(item)) {
            if (item.name) {
                const resultItem = Object.assign({ command: `npm run build:${item.name}`, output: `${output}/${item.name}` }, item);
                res.push(resultItem);
            }
        }
    });
    return res;
}
function getBuildConfig() {
    let buildConfig = pkgJson.taro && utils_1.isObject(pkgJson.taro.build) ? pkgJson.taro.build : {};
    const defaultConfig = {
        output: './output',
        excludes: [],
        options: VALID_OPTIONS
    };
    buildConfig = Object.assign({}, defaultConfig, buildConfig);
    return buildConfig;
}
function build() {
    if (process.env.NODE_ENV === 'dev') {
        console.log('main');
        return;
    }
    const config = getBuildConfig();
    const tempDist = path.resolve(rootCwd, config.dist || './dist');
    // shell.exec('chcp 65001')
    const options = getBuildOptions(config.options, config.output);
    for (const option of options) {
        const { name, command, output } = option;
        if (config.excludes.includes(name) || !VALID_OPTIONS.includes(name))
            continue;
        try {
            const outputPath = path.resolve(rootCwd, output);
            if (pkgJson.scripts[command.replace('npm run ', '')]) {
                shell.exec(command);
                shell.mkdir('-p', outputPath);
                shell.exec(`\\cp ${tempDist}/* ${outputPath}`);
                console.log(chalk.green(`build ${name} succefully!`));
            }
            else {
                console.log(chalk.red('缺少scripts >> '), command);
            }
        }
        catch (err) {
            console.log(chalk.red(`build ${name} failure!`));
            console.error(err);
        }
    }
}
exports.default = build;
