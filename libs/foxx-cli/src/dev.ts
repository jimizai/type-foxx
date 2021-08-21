import { Command } from 'commander';
import * as path from 'path';
import * as child_process from 'child_process';
import * as ora from 'ora';
import * as fs from 'fs';
import * as chokidar from 'chokidar';

export function registerDevCommand(program: Command) {
  program.command('dev').action(() => {
    const srcDir = path.resolve(process.cwd(), './src');
    const entry = path.resolve(srcDir, './bootstrap.ts');
    if (!fs.existsSync(entry)) {
      throw new Error('Cannot find entry file ' + entry);
    }
    chokidar.watch(srcDir).on('all', () => {
      restartChild(entry);
    });
    restartChild(entry);
  });
}

let child = null;

let timer = null;
function restartChild(entry: string) {
  if (timer) {
    return;
  }
  timer = setTimeout(() => {
    const proce = ora('starting...');
    proce.start();
    if (child) {
      child.kill();
      child = null;
    }
    child = child_process.fork(entry, {
      cwd: process.cwd(),
      env: process.env,
      execArgv: ['-r', 'ts-node/register'],
    });

    child.on('message', () => {
      proce.succeed('foxx server started successfully');
      timer = null;
    });

    child.on('error', () => {
      proce.fail('foxx server started error');
      child.kill();
      child = null;
      timer = null;
    });
  }, 13);
}
