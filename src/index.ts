import * as commander from 'commander'
import * as chalk from 'chalk'
import { getPkgVersion } from './utils'

commander
  .version(getPkgVersion(), '-v, --version')

commander
  .command('build', 'to build multi App in just one command')
  .action((mode) => {
    console.log('mode :>> ', mode)
  })

commander
  .command('watch', 'to build multi App in just one command in watch mode')

commander.on('--help', function () {
  console.log('config in your project package.json')
  console.log('Examples:')
  const configExample = {
    taro: {
      build: {
        output: 'build',
        excludes: ['alipay'],
        options: ['alipay', 'tt', 'qq']
      }
    }
  }
  console.log(chalk.blue(JSON.stringify(configExample, null, 2)))
  console.log('')
})

commander.parse(process.argv)
