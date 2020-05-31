import * as chokidar from 'chokidar';
import * as path from 'path';
import build from './build';
import * as chalk from 'chalk';

const watch = () => {
  const files = path.resolve(process.cwd(), './src/**/*.[j,t]s?(x)')
  const watcher = chokidar.watch(files, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
  });
  build()
  watcher.on('change', (file) => {
    console.log(chalk.green('file change:>> '), file);
    build();
  })
}

export default watch
