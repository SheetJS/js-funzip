/* funzip.js (C) 2018 SheetJS -- http://sheetjs.com */

import { CP$Conv } from "codepage";

/* use the bits rather than the full build */
(global as any).cptable = {};
require("codepage/bits/437");
const cp437dec: CP$Conv["dec"] = (global as any).cptable[437].dec as any;
export default cp437dec;
