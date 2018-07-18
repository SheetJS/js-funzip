/* funzip.js (C) 2018 SheetJS -- http://sheetjs.com */

import * as CRC32 from "crc-32";

declare module "crc-32" {
  const table: number[];
}

export default CRC32;

/* one step, equivalent to -1^CRC32.buf([ch], old^-1) */
export function CRC32Step(old: number, ch: number): number {
  return CRC32.table[(old ^ ch) & 0xff] ^ (old >>> 8);
}
