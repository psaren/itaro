"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const shell = require("shelljs");
const chalk = require("chalk");
const utils_1 = require("../utils");
const rootCwd = process.cwd();
const pkgJson = require(path.resolve(rootCwd, './package.json'));
const numCPUs = require('os').cpus().length;
const itaroBuildTime = 'Itaro Build Time';
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
class Builder {
    constructor(isWatch = false) {
        this.runningTasks = 0; // 正在运行的任务数量
        this.tasks = []; // 任务列表
        this.restoreTimeout = 1500; // 还原配置的时间
        this.isWatch = isWatch;
        this.remainingTasks = 0;
    }
    getBuildOptions(arr, output) {
        if (!utils_1.isArray(arr))
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
    getBuildConfig() {
        let buildConfig = pkgJson.taro && utils_1.isObject(pkgJson.taro.build) ? pkgJson.taro.build : {};
        const defaultConfig = {
            output: './output',
            excludes: [],
            options: VALID_OPTIONS
        };
        buildConfig = Object.assign({}, defaultConfig, buildConfig);
        return buildConfig;
    }
    // 生成新的 build 任务
    genNewTask(name, command, output) {
        return () => new Promise((resolve, reject) => {
            try {
                const outputPath = path.resolve(rootCwd, output);
                // 检查 npm 命令是否存在
                if (pkgJson.scripts[command.replace('npm run ', '')]) {
                    const configPath = path.resolve(rootCwd, './config/index.js');
                    // 读取 config
                    const config = fs.readFileSync(configPath, { encoding: 'utf8' });
                    // 修改 config.outputRoot
                    const newConfig = config.replace(/outputRoot:\s('|")(\w+\/?)+('|"),/gm, `outputRoot: '${output}',`);
                    // 更新 config
                    fs.writeFileSync(configPath, newConfig, { encoding: 'utf8' });
                    shell.exec(command, { async: true }, () => {
                        this.reduceTasksNum();
                        console.log(chalk.green(`build ${name} succefully!`));
                        resolve(true);
                        this.runNextTasks();
                    });
                    // 创建项目产出目录
                    shell.mkdir('-p', outputPath);
                    setTimeout(() => {
                        // 还原 config
                        fs.writeFileSync(configPath, config, { encoding: 'utf8' });
                    }, this.restoreTimeout);
                }
                else {
                    resolve(false);
                    this.reduceTasksNum();
                    utils_1.isTest && console.log(chalk.red('缺少scripts >> '), command);
                }
            }
            catch (err) {
                resolve(err);
                this.reduceTasksNum();
                console.log(chalk.red(`build ${name} failure!`));
                console.error(err);
            }
        });
    }
    reduceTasksNum() {
        this.remainingTasks--;
        if (this.runningTasks > 0) {
            this.runningTasks--;
        }
    }
    // 执行下一个 build 任务
    runNextTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            const { tasks, runningTasks, restoreTimeout } = this;
            while (tasks.length > 0 && runningTasks < numCPUs) {
                this.runningTasks++;
                const task = this.tasks.shift();
                yield utils_1.sleep(restoreTimeout + 1000);
                task().then(() => {
                    if (this.remainingTasks < 1) {
                        console.log('');
                        console.timeEnd(itaroBuildTime);
                        if (this.isWatch) {
                            console.log('');
                            console.log(chalk.green('itaro is watching files change...'));
                        }
                    }
                });
            }
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(chalk.green('itaro build running...'));
            console.time(itaroBuildTime);
            const config = this.getBuildConfig();
            shell.exec('chcp 65001', { silent: true });
            const options = this.getBuildOptions(config.options, config.output);
            for (const option of options) {
                const { name, command, output } = option;
                if (config.excludes.includes(name) || !VALID_OPTIONS.includes(name))
                    continue;
                this.tasks.push(this.genNewTask(name, command, output));
            }
            this.remainingTasks = this.tasks.length;
            this.runNextTasks();
        });
    }
}
exports.default = Builder;
