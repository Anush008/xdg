#!/usr/bin/env node

const { spawnSync } = require("child_process");
const path = require("path");
const { name } = require("../package.json");
const binPath = path.join(__dirname, name);

const command_args = process.argv.slice(2);
const child = spawnSync(binPath, command_args, { stdio: "inherit" });
process.exit(child.status);
