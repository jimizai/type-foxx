import { Command } from 'commander';
import * as path from 'path';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as chokidar from 'chokidar';
import { generateWebpackConfig } from './webpack.config';
import * as webpack from 'webpack';

const PROJECT_DIR = process.cwd();
const SRC_DIR = path.resolve(PROJECT_DIR, 'src');
const OUTPUT_DIR = path.resolve(PROJECT_DIR, 'dist');
const ENTRY_PATH = path.resolve(SRC_DIR, 'bootstrap.ts');
const OUTPUT_FILENAME = 'bundle.js';
const OUTPUT_FILE_PATH = path.resolve(OUTPUT_DIR, OUTPUT_FILENAME);
const TS_CONFIG_PATH = path.resolve(PROJECT_DIR, 'tsconfig.json');

export function registerDevCommand(program: Command) {
  program
    .command('dev')
    .option('--webpack', 'webpack mod')
    .action((args) => {
      if (!fs.existsSync(SRC_DIR)) {
        console.log('Cannot find src dir ' + SRC_DIR);
        return;
      }
      if (!fs.existsSync(ENTRY_PATH)) {
        console.log('Cannot find entry file ' + ENTRY_PATH);
        return;
      }

      if (args.webpack) {
        startWebpackCompiler();
      } else {
        chokidar.watch(SRC_DIR).on('all', () => {
          restartChild(ENTRY_PATH);
        });
        restartChild(ENTRY_PATH);
      }
    });
}

let timer = null;
function restartChild(entry: string) {
  if (timer) {
    return;
  }
  timer = setTimeout(() => {
    generateChildProgress(entry, { execArgv: ['-r', 'ts-node/register'] });
  }, 13);
}

let child = null;
let watching = null;
function killChild() {
  if (child) {
    child.kill();
    child = null;
  }
}

function generateChildProgress(filePath: string, opts: any = {}) {
  killChild();

  const options = {
    cwd: process.cwd(),
    env: process.env,
    ...opts,
  };
  child = child_process.fork(filePath, options);
  child.on('message', () => {
    timer = null;
  });

  child.on('error', () => {
    killChild();
    timer = null;
  });
}

function startWebpackCompiler() {
  const webpackConfig: any = generateWebpackConfig({
    entry: ENTRY_PATH,
    outputPath: OUTPUT_DIR,
    filename: OUTPUT_FILENAME,
    tsconfig: TS_CONFIG_PATH,
  });
  const webpackCompiler = webpack(webpackConfig);
  const watchOptions = {};
  watching = webpackCompiler.watch(watchOptions, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    generateChildProgress(OUTPUT_FILE_PATH);
  });
}

process.on('beforExit', () => {
  killChild();
  if (watching) {
    watching.close();
  }
});
