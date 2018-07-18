/* funzip.js (C) 2018 SheetJS -- http://sheetjs.com */

import zlib, * as ZLIB from "zlib";

import { MyBuffer } from "../util";

export default zlib;

const { InflateRaw } = (ZLIB as any);
export function InflateRawSync(data: MyBuffer): Buffer {
  const InflRaw = new InflateRaw();
  const out = InflRaw._processChunk(data.slice(data.l), InflRaw._finishFlushFlag);
  data.l += InflRaw.bytesRead;
  return out;
}
