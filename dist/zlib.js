"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var zlib_1 = __importStar(require("zlib")), ZLIB = zlib_1;
exports.ZLIB = ZLIB;
var inflateRawSync = zlib_1.default.inflateRawSync;
exports.inflateRawSync = inflateRawSync;
var InflateRaw = ZLIB.InflateRaw;
exports.InflateRaw = InflateRaw;
exports.default = zlib_1.default;
