"use strict";
/* funzip.js (C) 2018 SheetJS -- http://sheetjs.com */
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var zlib_1 = __importStar(require("zlib")), ZLIB = zlib_1;
exports.default = zlib_1.default;
var InflateRaw = ZLIB.InflateRaw;
function InflateRawSync(data) {
    var InflRaw = new InflateRaw();
    var out = InflRaw._processChunk(data.slice(data.l), InflRaw._finishFlushFlag);
    data.l += InflRaw.bytesRead;
    return out;
}
exports.InflateRawSync = InflateRawSync;
