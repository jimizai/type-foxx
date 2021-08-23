#!/usr/bin/env node
import { program } from 'commander';
import { version } from '../package.json';
import * as inquirer from 'inquirer';
import * as download from 'download-git-repo';
import * as handlebars from 'handlebars';
import * as chalk from 'chalk';
import * as ora from 'ora';
import * as path from 'path';
import * as fs from 'fs';
import { registerDevCommand } from './dev';

const toLowerCaseFilter = (val: string) => val.toLowerCase();

const repo = 'https://github.com/jimizai/foxx-koa-default-example.git#main';

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
      const PACKAGE_JSON = path.resolve(process.cwd(), name, 'package.json');
      const answers = await inquirer.prompt(questions);
      const proce = ora('Downloading...');
      proce.start();
      download('direct:' + repo, name, { clone: true }, (err) => {
        if (err) {
          console.error(err);
          proce.fail();
          return;
        }
        if (fs.existsSync(PACKAGE_JSON)) {
          const { framework } = answers;
          const content = fs.readFileSync(PACKAGE_JSON, 'utf8');
          const result = handlebars.compile(content)({ framework, name });
          fs.writeFileSync(PACKAGE_JSON, result, 'utf8');
        }
        proce.succeed();
        console.log(chalk.green('Enjoy :)'));
      });
    });

  registerDevCommand(program);

  program.parse(process.argv);
};

main();
