"use strict";
/* funzip.js (C) 2018 SheetJS -- http://sheetjs.com */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sprintf_1 = __importDefault(require("../wrapper/sprintf"));
var util_1 = require("../util");
var gzip_1 = __importDefault(require("./gzip"));
var zip_1 = __importDefault(require("./zip"));
function process_data(buf, opts) {
    var data = buf;
    util_1.prep_blob(data);
    var sig = data.read_shift(2);
    var out = Buffer.alloc(0);
    switch (sig) {
        case 0x4b50:
            out = zip_1.default(data, opts.password);
            break;
        case 0x8b1f:
            out = gzip_1.default(data);
            break;
        default: util_1.die(sprintf_1.default("funzip: not a valid file, signature %04x", sig), 3);
    }
    if (out.length && !opts.quiet)
        process.stdout.write(out);
}
exports.default = process_data;
