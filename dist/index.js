"use strict";
/* funzip.js (C) 2018-present SheetJS -- http://sheetjs.com */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("exit-on-epipe");
var fs_1 = require("fs");
var commander_1 = __importDefault(require("commander"));
var concat_stream_1 = __importDefault(require("concat-stream"));
var sprintf_1 = __importDefault(require("./wrapper/sprintf"));
var process_data_1 = __importDefault(require("./process_data/"));
var util_1 = require("./util");
var pjson = require("../package.json");
function funzipcli(process) {
    commander_1.default
        .version(pjson.version)
        .usage("<file> [options]")
        .option("-P, --password <str>", "decrypt with specified password")
        .option("-q, --quiet", "do not write output");
    commander_1.default.on("--help", function () {
        process.stdout.write("  Options should mirror behavior of zip/unzip utilities\n");
        process.stdout.write("  Support email: support@sheetjs.com\n");
    });
    commander_1.default.parse(process.argv);
    var filename = commander_1.default.args[0] || "";
    if (!process.stdin.isTTY)
        filename = filename || "-";
    if (filename.length === 0)
        util_1.die("funzip: must specify a filename or pipe data to stdin", 1);
    else if (filename !== "-" && !fs_1.existsSync(filename))
        util_1.die(sprintf_1.default("funzip: %s: No such file or directory", filename), 2);
    if (filename === "-") {
        process.stdin.pipe(concat_stream_1.default(function (data) { process_data_1.default(data, commander_1.default); }));
    }
    else {
        process_data_1.default(fs_1.readFileSync(filename), commander_1.default);
    }
}
exports.default = funzipcli;
