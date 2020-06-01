import * as chokidar from 'chokidar'
import * as path from 'path'
import * as chalk from 'chalk'
import Builder from './build'

const watch = () => {
  const builder = new Builder(true)
  const files = path.resolve(process.cwd(), './src/**/*.{[jt]s?(x),{sc,c,le}ss,json,html,styl,vue}')
  const watcher = chokidar.watch(files, {
    ignored: /(^|[/\\])\../, // ignore dotfiles
    persistent: true
  })
  builder.run()
  watcher.on('change', (file) => {
    console.log(chalk.green('file change :>> '), file)
    builder.run()
  })
}

export default watch
