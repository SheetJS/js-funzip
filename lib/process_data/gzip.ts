/* funzip.js (C) 2018 SheetJS -- http://sheetjs.com */

import CRC32 from "../wrapper/crc32";
import sprintf from "../wrapper/sprintf";
import { InflateRawSync } from "../wrapper/zlib";

import { die, MyBuffer } from "../util";

export default function process_data_gzip(data: MyBuffer): Buffer {
  /* 2.3 Member format (at this point, the ID bytes have been consumed) */
  const header: Buffer = data.slice(data.l, data.l + 8);

  const CM: number = header[0];
  const FLG: number = header[1];
  data.l += 8;
  if (CM !== 8 && CM !== 9) die(sprintf("funzip: gzip not deflated, compression %02hhx", CM), 4);

  /* extra field is length-prefixed */
  if (FLG & 4) data.l += data.read_shift(2);
  /* filename is null-terminated */
  if (FLG & 8) while (data[data.l++] !== 0);
  /* file comment is null-terminated */
  if (FLG & 16) while (data[data.l++] !== 0);
  /* CRC16 */
  if (FLG & 2) data.l += 2;

  /* ...compressed blocks... */
  const out = InflateRawSync(data);

  /* error checking */
  const crc = data.read_shift(4) | 0;
  const len = data.read_shift(4, "u");
  const ncrc = CRC32.buf(out) | 0;
  if (crc !== ncrc) die(sprintf("funzip: gzip crc error expected %#.8x found %#.8x", crc, ncrc), 9);
  if (out.length !== len) die(sprintf("funzip: gzip length mismatch expected %u found %u", len, out.length), 9);

  return out;
}
