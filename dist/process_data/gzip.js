"use strict";
/* funzip.js (C) 2018 SheetJS -- http://sheetjs.com */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crc32_1 = __importDefault(require("../wrapper/crc32"));
var sprintf_1 = __importDefault(require("../wrapper/sprintf"));
var zlib_1 = require("../wrapper/zlib");
var util_1 = require("../util");
function process_data_gzip(data) {
    /* 2.3 Member format (at this point, the ID bytes have been consumed) */
    var header = data.slice(data.l, data.l + 8);
    var CM = header[0];
    var FLG = header[1];
    data.l += 8;
    if (CM !== 8 && CM !== 9)
        util_1.die(sprintf_1.default("funzip: gzip not deflated, compression %02hhx", CM), 4);
    /* extra field is length-prefixed */
    if (FLG & 4)
        data.l += data.read_shift(2);
    /* filename is null-terminated */
    if (FLG & 8)
        while (data[data.l++] !== 0)
            ;
    /* file comment is null-terminated */
    if (FLG & 16)
        while (data[data.l++] !== 0)
            ;
    /* CRC16 */
    if (FLG & 2)
        data.l += 2;
    /* ...compressed blocks... */
    var out = zlib_1.InflateRawSync(data);
    /* error checking */
    var crc = data.read_shift(4) | 0;
    var len = data.read_shift(4, "u");
    var ncrc = crc32_1.default.buf(out) | 0;
    if (crc !== ncrc)
        util_1.die(sprintf_1.default("funzip: gzip crc error expected %#.8x found %#.8x", crc, ncrc), 9);
    if (out.length !== len)
        util_1.die(sprintf_1.default("funzip: gzip length mismatch expected %u found %u", len, out.length), 9);
    return out;
}
exports.default = process_data_gzip;
