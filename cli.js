#!/usr/bin/env node

const chalk = require("chalk");
const dateFormat = require("dateformat");
const yargs = require("yargs");

const { backup, search } = require("./lib");

const args = yargs
  .command(
    "backup",
    "backup Alfred Clipboard History merging with existing items"
  )
  .command("search", "search Alfred Clipboard History")
  .demandCommand(1, "you need to provide a command")
  .help().argv;

const [command] = args._;

if (command === "backup") {
  console.time("backup");

  backup();

  console.timeEnd("backup");
  console.log("done!");
} else if (command === "search") {
  const term = args._[1];

  const source = (d) => {
    const date = dateFormat(new Date(d.ts), "dd-mm-yyyy HH:MM:ss");
    return chalk.gray(`${d.app} at ${date}`);
  };

  search(term)
    .reverse()
    .forEach((d) => {
      console.log(`
${d.item}
${source(d)}`);
    });
} else {
  console.log(`unknown command ${command}`);
}
