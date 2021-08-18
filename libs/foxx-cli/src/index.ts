#!/usr/bin/env node
import { program } from 'commander';
import { version } from '../package.json';
import * as inquirer from 'inquirer';
import * as download from 'download-git-repo';
import * as chalk from 'chalk';
import * as ora from 'ora';
import * as path from 'path';
import * as fs from 'fs';

const toLowerCaseFilter = (val: string) => val.toLowerCase();

const repos = [
  {
    mod: 'default',
    framework: 'koa',
    url: 'https://github.com/jimizai/foxx-koa-default-example.git#main',
  },
  {
    mod: 'default',
    framework: 'express',
    url: 'https://github.com/jimizai/foxx-express-default-example.git#main',
  },
];

const questions = [
  {
    type: 'list',
    name: 'mod',
    message: 'Choose server development mod',
    choices: [
      {
        name: 'Default',
      },
      {
        name: 'Webpack',
        disabled: 'support later',
      },
    ],
    filter: toLowerCaseFilter,
  },
  {
    type: 'list',
    name: 'framework',
    message: 'Choose a basic framework',
    choices: ['Koa', 'Express'],
    filter: toLowerCaseFilter,
  },
];

const main = () => {
  program
    .version(version, '-v, --version')
    .command('init <name>')
    .action(async (name) => {
      const filePath = path.resolve(process.cwd(), name);
      if (fs.existsSync(filePath)) {
        console.log(chalk.red('Directory already exists :('));
        return;
      }
      const answers = await inquirer.prompt(questions);
      const proce = ora('Downloading...');
      const temp = repos.find(
        (repo) =>
          repo.mod === answers.mod && repo.framework === answers.framework
      );
      proce.start();
      download('direct:' + temp.url, name, { clone: true }, (err) => {
        if (err) {
          console.error(err);
          proce.fail();
          return;
        }
        proce.succeed();
        console.log(chalk.green('Enjoy :)'));
      });
    });

  program.parse(process.argv);
};

main();
