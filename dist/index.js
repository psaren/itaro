"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const chalk = require("chalk");
const utils_1 = require("./utils");
commander
    .version(utils_1.getPkgVersion(), '-v, --version');
commander
    .command('build', 'to build multi App in just one command')
    .action((mode) => {
    console.log('mode :>> ', mode);
});
commander
    .command('watch', 'to build multi App in just one command in watch mode');
commander.on('--help', function () {
    console.log('config in your project package.json');
    console.log('Examples:');
    const configExample = {
        taro: {
            build: {
                output: 'build',
                excludes: ['alipay'],
                options: ['alipay', 'tt', 'qq']
            }
        }
    };
    console.log(chalk.blue(JSON.stringify(configExample, null, 2)));
    console.log('');
});
commander.parse(process.argv);
