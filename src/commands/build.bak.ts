import * as path from 'path'
import * as fs from 'fs'
import * as shell from 'shelljs'
import * as chalk from 'chalk'
import { isObject, isTest, sleep } from '../utils'
const rootCwd = process.cwd()
const pkgJson = require(path.resolve(rootCwd, './package.json'))
const numCPUs = require('os').cpus().length
let runningTasks = 0 // 正在运行的任务数量
const tasks:any[] = [] // 任务列表
const restoreTimeout = 2000 // 还原配置的时间

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
]

interface Item {
  name: string;
  command: string;
  output: string;
}

function getBuildOptions (arr: (Item|string)[], output): Item[] {
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
  let buildConfig = pkgJson.taro && isObject(pkgJson.taro.build) ? pkgJson.taro.build : {}

  const defaultConfig = {
    output: './output',
    excludes: [],
    options: VALID_OPTIONS
  }

  buildConfig = Object.assign({}, defaultConfig, buildConfig)
  return buildConfig
}

// 生成新的 build 任务
function genNewTask (name: string, command: string, output: string) {
  return async () => {
    try {
      const outputPath = path.resolve(rootCwd, output)
      // 检查 npm 命令是否存在
      if (pkgJson.scripts[command.replace('npm run ', '')]) {
        const configPath = path.resolve(rootCwd, './config/index.js')
        // const configPath = path.resolve(__dirname, '../../config/index.js')
        // 读取 config
        const config = fs.readFileSync(configPath, { encoding: 'utf8' })
        // 修改 config.outputRoot
        const newConfig = config.replace(/outputRoot:\s('|")(\w+\/?)+('|"),/gm, `outputRoot: '${output}',`)
        // 更新 config
        fs.writeFileSync(configPath, newConfig, { encoding: 'utf8' })

        shell.exec(command, { async: true }, () => {
          runningTasks--
          console.log(chalk.green(`build ${name} succefully!`))
          runNextTasks()
        })
        // 创建项目产出目录
        shell.mkdir('-p', outputPath)
        setTimeout(() => {
          // 还原 config
          fs.writeFileSync(configPath, config, { encoding: 'utf8' })
        }, restoreTimeout)
      } else {
        runningTasks--
        isTest && console.log(chalk.red('缺少scripts >> '), command)
      }
    } catch (err) {
      runningTasks--
      console.log(chalk.red(`build ${name} failure!`))
      console.error(err)
    }
  }
}

// 执行下一个 build 任务
async function runNextTasks () {
  while (tasks.length > 0 && runningTasks < numCPUs) {
    runningTasks++
    const task = tasks.shift()
    await sleep(restoreTimeout + 1000)
    task()
  }
}

export default function build () {
  const config = getBuildConfig()

  shell.exec('chcp 65001')

  const options = getBuildOptions(config.options, config.output)

  for (const option of options) {
    const { name, command, output } = option
    if (config.excludes.includes(name) || !VALID_OPTIONS.includes(name)) continue
    tasks.push(genNewTask(name, command, output))
  }
  runNextTasks()
}
