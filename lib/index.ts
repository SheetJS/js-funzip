/* funzip.js (C) 2018-present SheetJS -- http://sheetjs.com */

import "exit-on-epipe";
import { existsSync, readFileSync } from "fs";

import program from "commander";
import concat from "concat-stream";
import sprintf from "./wrapper/sprintf";

import process_data from "./process_data/";
import { die } from "./util";
const pjson = require("../package.json");

export default function funzipcli(process: NodeJS.Process): void {
  program
    .version(pjson.version)
    .usage("<file> [options]")
    .option("-P, --password <str>", "decrypt with specified password")
    .option("-q, --quiet", "do not write output");

  program.on("--help", () => {
    process.stdout.write("  Options should mirror behavior of zip/unzip utilities\n");
    process.stdout.write("  Support email: support@sheetjs.com\n");
  });

  program.parse(process.argv);

  let filename: string = program.args[0] || "";
  if (!process.stdin.isTTY) filename = filename || "-";
  if (filename.length === 0) die("funzip: must specify a filename or pipe data to stdin", 1);
  else if (filename !== "-" && !existsSync(filename)) die(sprintf("funzip: %s: No such file or directory", filename), 2);

  if (filename === "-") {
    process.stdin.pipe(concat((data) => { process_data(data, program); }));
  } else {
    process_data(readFileSync(filename), program);
  }
}
