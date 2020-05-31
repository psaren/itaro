import * as path from 'path';
import * as shell from 'shelljs';
import * as chalk from 'chalk';
import { isObject } from '../utils';
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
  'quickapp'
];

interface Item {
  name: string;
  command: string;
  output: string;
}

function getBuildOptions(arr: (Item|string)[], output): Item[] {
  if (!Array.isArray(arr)) return []
  const res: Item[] = []
  arr.forEach(item => {
    if (typeof item === 'string') {
      res.push({
        name: item,
        command: `npm run build:${item}`,
        output: `${output}/${item}`
      })
    } else if (isObject(item)) {
      if (item.name) {
        const resultItem: Item = {
          command: `npm run build:${item.name}`,
          output: `${output}/${item.name}`,
          ...item
        }
        res.push(resultItem)
      }
    }
  })
  return res
}

function getBuildConfig () {
  let buildConfig =  pkgJson.taro && isObject(pkgJson.taro.build) ? pkgJson.taro.build : {}

  const defaultConfig = {
    output: './output',
    excludes: [],
    options: VALID_OPTIONS
  };

  buildConfig = Object.assign({}, defaultConfig, buildConfig)
  return buildConfig
}

export default function build() {
  if (process.env.NODE_ENV === 'dev') {
    console.log('main', );
    return
  }

  const config = getBuildConfig();
  const tempDist = path.resolve(rootCwd, config.dist || './dist');
  shell.exec('chcp 65001');
  
  const options = getBuildOptions(config.options, config.output);
  for (const option of options) {
    const { name, command, output } = option;
    if (config.excludes.includes(name) || !VALID_OPTIONS.includes(name)) continue;
      try {
        const outputPath = path.resolve(rootCwd, output)
        shell.exec(command);
        shell.exec(`mkdir ${outputPath} -p`);
        shell.exec(`\cp ${tempDist}/* ${outputPath}`);
        console.log(chalk.green(`build ${name} succefully!`));
      } catch (err) {
        console.log(chalk.red(`build ${name} failure!`));
        console.error(err);
      }
  }
}
