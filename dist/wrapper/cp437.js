"use strict";
/* funzip.js (C) 2018 SheetJS -- http://sheetjs.com */
Object.defineProperty(exports, "__esModule", { value: true });
/* use the bits rather than the full build */
global.cptable = {};
require("codepage/bits/437");
var cp437dec = global.cptable[437].dec;
exports.default = cp437dec;
