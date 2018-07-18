"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var printj_1 = require("printj");
var crc32_1 = __importDefault(require("./crc32"));
var util_1 = require("./util");
var zlib_1 = require("./zlib");
function process_data_gzip(data, opts) {
    var header = data.slice(data.l, data.l + 8);
    var meth = header[0];
    var flags = header[1];
    data.l += 8;
    if (meth !== 8 && meth !== 9)
        util_1.die(printj_1.sprintf("funzip: gzip not deflated, compression %02hhx", meth), 4);
    if (flags & 2)
        util_1.die("funzip: multi-part archives not supported", 5);
    /* extra field is length-prefixed */
    if (flags & 4)
        data.l += data.read_shift(2);
    /* filename -- scan for 0 */
    if (flags & 8)
        while (data[data.l++] !== 0)
            ;
    /* file comment */
    if (flags & 16)
        while (data[data.l++] !== 0)
            ;
    var out = zlib_1.inflateRawSync(data.slice(data.l));
    data.l = data.length - 8;
    var crc = data.read_shift(4);
    var ncrc = 0;
    var len = data.read_shift(4, "u");
    if (crc !== (ncrc = crc32_1.default.buf(out)))
        util_1.die(printj_1.sprintf("funzip: gzip crc error expected %#.8x found %#.8x", crc, ncrc), 9);
    if (out.length !== len)
        util_1.die(printj_1.sprintf("funzip: gzip length mismatch expected %u found %u", len, out.length), 9);
    if (!opts.quiet)
        process.stdout.write(out);
}
exports.default = process_data_gzip;
