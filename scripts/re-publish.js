#!/usr/bin/env zx
const path = require('path');
const fs = require('fs');
const distPath = path.join(__dirname, '../dist/libs');

const TARGET_ORIGIN = '2.x';
const BASE_ORIGIN = 'release';

(async () => {
  const oldPath = process.cwd();
  const dirs = fs.readdirSync(distPath);
  for (let libName of dirs) {
    const url = path.resolve(distPath, libName);
    process.chdir(url);
    try {
      await $`npm publish --access public`;
    } catch {}
  }
  process.chdir(oldPath);

  await $`git add .`;
  await $`git commit -m "Publish"`;
  await $`git push origin ${TARGET_ORIGIN}`;
  await $`git push origin ${TARGET_ORIGIN}:${BASE_ORIGIN}`;
})();
