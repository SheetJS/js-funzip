"use strict";
/* funzip.js (C) 2018 SheetJS -- http://sheetjs.com */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crc32_1 = __importDefault(require("../wrapper/crc32"));
var sprintf_1 = __importDefault(require("../wrapper/sprintf"));
var zlib_1 = require("../wrapper/zlib");
var decrypt_1 = __importDefault(require("../decrypt"));
var util_1 = require("../util");
function process_data_zip(data, password) {
    /* 4.3.7 Local file header */
    /* local file header signature (at this point, the first two bytes have been consumed) */
    var sig = data.read_shift(2);
    if (sig !== 0x0403)
        util_1.die(sprintf_1.default("funzip: bad zip file sig %#0.4x", sig), 10);
    /* version needed to extract */
    data.l += 2;
    /* general purpose bit flag */
    var flags = data.read_shift(2);
    /* compression method */
    var meth = data.read_shift(2);
    /* 4.4.5 compression method -- 0 = stored, 8 = deflate, 9 = deflate64 */
    if (meth !== 0 && meth !== 8 && meth !== 9)
        util_1.die(sprintf_1.default("funzip: zip not deflated, compression %02hhx", meth), 4);
    /* last mod file date & time */
    data.l += 4;
    /* crc-32 */
    var crc = data.read_shift(4) | 0;
    /* compressed size */
    var clen = data.read_shift(4, "u");
    /* uncompressed size */
    var len = data.read_shift(4, "u");
    /* file name length */
    var fnlen = data.read_shift(2);
    /* extra field length */
    var eflen = data.read_shift(2);
    /* file name and extra field */
    data.l += fnlen + eflen;
    /* ZIPCryption */
    var d = data;
    if (flags & 1) {
        /* Bit 6: Strong encryption */
        if (flags & 64)
            util_1.die("funzip: strong encryption not supported", 12);
        var pwbuff = Buffer.from(password || "", "utf-8");
        d = decrypt_1.default(data, pwbuff, clen, crc);
    }
    /* file data */
    var out = (meth === 0) ? d.slice(d.l, d.l + clen) : zlib_1.InflateRawSync(d);
    var ncrc = crc32_1.default.buf(out);
    /* 4.3.9 Data descriptor */
    if ((flags & 8) && crc === 0) {
        while (d.l <= d.length - 5) {
            var ddd = d.read_shift(4);
            if (ddd === ncrc)
                break;
            else if (ddd === 0x08074b50) {
                crc = d.read_shift(4) | 0;
                break;
            }
            d.l -= 3;
        }
        if (d.l >= d.length - 12)
            d.l = d.length - 12;
        clen = d.read_shift(4, "u");
        len = d.read_shift(4, "u");
    }
    /* error checking */
    if ((crc | 0) !== (ncrc | 0))
        util_1.die(sprintf_1.default("funzip: zip crc error expected %#.8x found %#.8x", crc, ncrc), 9);
    if (out.length !== len)
        util_1.die(sprintf_1.default("funzip: zip length mismatch expected %u found %u", len, out.length), 9);
    return out;
}
exports.default = process_data_zip;
