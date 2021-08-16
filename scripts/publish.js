#!/usr/bin/env zx
const path = require('path');
const libPath = path.resolve(__dirname, '../libs');
const distPath = path.join(__dirname, '../dist/libs');

(async () => {
  const TARGET_ORIGIN = '2.x';
  const BASE_ORIGIN = 'release';

  const versionArgs = ['patch', 'minor', 'major'];
  let type = process.argv.pop().toLowerCase();
  if (!versionArgs.includes(type)) {
    type = 'patch';
  }

  const result =
    await $`nx affected:libs --base=${BASE_ORIGIN} --exclude simple express --plain`;
  const stdout = result.stdout?.replace(/[\r\n]/g, '') || '';
  const affected = stdout?.split(' ').filter(Boolean);
  if (!affected.length) {
    return;
  }

  const oldPath = process.cwd();

  for (let libName of affected) {
    const url = path.resolve(libPath, libName);
    process.chdir(url);
    await $`npm version ${type}`;
  }

  process.chdir(oldPath);
  await $`nx affected:build --with-deps --base=${BASE_ORIGIN} --prod --parallel --exclude simple express`;

  for (let libName of affected) {
    const distUrl = path.resolve(distPath, libName);
    process.chdir(distUrl);
    await $`npm publish --access public`;
  }
  process.chdir(oldPath);

  await $`git add .`;
  await $`git commit -m "Publish"`;
  await $`git push origin ${TARGET_ORIGIN}`;
  await $`git checkout ${BASE_ORIGIN}`;
  await $`git merge ${TARGET_ORIGIN}`;
  await $`git push origin ${BASE_ORIGIN}`;
  await $`git checkout ${TARGET_ORIGIN}`;
})();
