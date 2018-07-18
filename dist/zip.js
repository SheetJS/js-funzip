"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var zlib_1 = require("./zlib");
var printj_1 = require("printj");
var crc32_1 = __importDefault(require("./crc32"));
var decrypt_1 = __importDefault(require("./decrypt"));
var util_1 = require("./util");
function process_data_zip(data, opts) {
    var sig = data.read_shift(2);
    if (sig !== 0x0403)
        util_1.die(printj_1.sprintf("funzip: bad zip file sig %#0.4x", sig), 10);
    data.l += 2;
    var flags = data.read_shift(2);
    var meth = data.read_shift(2);
    if (meth !== 0 && meth !== 8 && meth !== 9)
        util_1.die(printj_1.sprintf("funzip: zip not deflated, compression %02hhx", meth), 4);
    data.l += 4;
    var crc = data.read_shift(4) | 0;
    var ncrc = 0;
    var clen = data.read_shift(4, "u");
    var len = data.read_shift(4, "u");
    var fnlen = data.read_shift(2);
    var eflen = data.read_shift(2);
    data.l += fnlen + eflen;
    var d = data;
    if (flags & 1) {
        if (flags & 64)
            util_1.die("funzip: strong encryption not supported", 12);
        var pwbuff = Buffer.from(opts.password || "", "utf-8");
        d = decrypt_1.default(data, pwbuff, clen, crc);
    }
    var InflRaw = new zlib_1.InflateRaw();
    function doit(buf) {
        var buffer = InflRaw._processChunk(buf, InflRaw._finishFlushFlag);
        return (InflRaw._opts.info) ? ({ buffer: buffer, InflRaw: InflRaw }) : buffer;
    }
    var out = meth === 0 ? d.slice(d.l, d.l + clen) : doit(d.slice(d.l));
    d.l += InflRaw.bytesRead;
    if ((flags & 8) && crc === 0) {
        ncrc = crc32_1.default.buf(out);
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
    if ((crc | 0) !== (ncrc = crc32_1.default.buf(out)))
        util_1.die(printj_1.sprintf("funzip: zip crc error expected %#.8x found %#.8x", crc, ncrc), 9);
    if (out.length !== len)
        util_1.die(printj_1.sprintf("funzip: zip length mismatch expected %u found %u", len, out.length), 9);
    if (!opts.quiet)
        process.stdout.write(out);
}
exports.default = process_data_zip;
