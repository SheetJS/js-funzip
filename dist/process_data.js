"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var printj_1 = require("printj");
var util_1 = require("./util");
var gzip_1 = __importDefault(require("./gzip"));
var zip_1 = __importDefault(require("./zip"));
function process_data(buf, opts) {
    var data = buf;
    util_1.prep_blob(data);
    var sig = data.read_shift(2);
    switch (sig) {
        case 0x4b50: return zip_1.default(data, opts);
        case 0x8b1f: return gzip_1.default(data, opts);
        default: util_1.die(printj_1.sprintf("funzip: not a valid file, signature %04x", sig), 3);
    }
}
exports.default = process_data;
