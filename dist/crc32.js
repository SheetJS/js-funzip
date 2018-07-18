"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var CRC32 = __importStar(require("crc-32"));
exports.default = CRC32;
/* one step, equivalent to -1^CRC32.buf([ch], old^-1) */
function CRC32Step(old, ch) {
    return CRC32.table[(old ^ ch) & 0xff] ^ (old >>> 8);
}
exports.CRC32Step = CRC32Step;
