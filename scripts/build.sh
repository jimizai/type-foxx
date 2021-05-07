#!/bin/bash
set -e

lerna exec -- rm -rf ./lib
lerna run build --concurrency=4
