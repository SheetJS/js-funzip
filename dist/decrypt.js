"use strict";
/* funzip.js (C) 2018 SheetJS -- http://sheetjs.com */
Object.defineProperty(exports, "__esModule", { value: true });
var crc32_1 = require("./wrapper/crc32");
var util_1 = require("./util");
/* 6.1 Traditional PKWARE Decryption */
function decrypt(data, password, len, crc) {
    /* 6.1.5 Initializing the encryption keys */
    var st = [0x12345678, 0x23456789, 0x34567890];
    init_keys(password, st);
    var C = 0;
    /* 6.1.6 Decrypting the encryption header */
    var Hdr = Buffer.alloc(12);
    for (var j = 0; j < 12; ++j) {
        C = (data.read_shift(1) ^ decrypt_byte(st)) & 0xFF;
        update_keys(C, st);
        Hdr[j] = C;
    }
    var crcbyte = ((crc >> 24) & 0xFF);
    if (crcbyte !== Hdr[11] && crcbyte !== Hdr[10])
        throw new Error("incorrect password");
    /* 6.1.7 Decrypting the compressed data stream */
    var L = len - 12;
    var out = Buffer.alloc(L);
    util_1.prep_blob(out);
    for (var j = 0; j < L; ++j) {
        C = (data.read_shift(1) ^ decrypt_byte(st)) & 0xFF;
        update_keys(C, st);
        out[j] = C;
    }
    return out;
}
exports.default = decrypt;
function update_keys(ch, st) {
    st[0] = crc32_1.CRC32Step(st[0], ch);
    st[1] += (st[0] & 0xFF);
    st[1] = ((st[1] & 0xFFFF) * 0x8088405 + (st[1] & 0xFFFF0000) * 0x8405 + 1) | 0;
    st[2] = crc32_1.CRC32Step(st[2], st[1] >> 24);
}
function init_keys(password, st) {
    for (var i = 0; i < password.length; ++i)
        update_keys(password[i], st);
}
function decrypt_byte(st) {
    var temp = (st[2] & 0xffff) | 2;
    return ((temp * (temp ^ 1)) >> 8) & 0xFF;
}
