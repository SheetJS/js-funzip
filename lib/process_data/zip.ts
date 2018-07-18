/* funzip.js (C) 2018 SheetJS -- http://sheetjs.com */

import CRC32 from "../wrapper/crc32";
import sprintf from "../wrapper/sprintf";
import { InflateRawSync } from "../wrapper/zlib";

import decrypt from "../decrypt";
import { die, MyBuffer } from "../util";

export default function process_data_zip(data: MyBuffer, password?: string): Buffer {
  /* 4.3.7 Local file header */
  /* local file header signature (at this point, the first two bytes have been consumed) */
  const sig = data.read_shift(2);
  if (sig !== 0x0403) die(sprintf("funzip: bad zip file sig %#0.4x", sig), 10);

  /* version needed to extract */
  data.l += 2;
  /* general purpose bit flag */
  const flags: number = data.read_shift(2);
  /* compression method */
  const meth: number = data.read_shift(2);

  /* 4.4.5 compression method -- 0 = stored, 8 = deflate, 9 = deflate64 */
  if (meth !== 0 && meth !== 8 && meth !== 9) die(sprintf("funzip: zip not deflated, compression %02hhx", meth), 4);

  /* last mod file date & time */
  data.l += 4;
  /* crc-32 */
  let crc: number = data.read_shift(4) | 0;
  /* compressed size */
  let clen: number = data.read_shift(4, "u");
  /* uncompressed size */
  let len: number = data.read_shift(4, "u");
  /* file name length */
  const fnlen: number = data.read_shift(2);
  /* extra field length */
  const eflen: number = data.read_shift(2);
  /* file name and extra field */
  data.l += fnlen + eflen;

  /* ZIPCryption */
  let d: MyBuffer = data;
  if (flags & 1) {
    /* Bit 6: Strong encryption */
    if (flags & 64) die("funzip: strong encryption not supported", 12);

    const pwbuff = Buffer.from(password || "", "utf-8");
    d = decrypt(data, pwbuff, clen, crc);
  }

  /* file data */
  const out: Buffer = (meth === 0) ? d.slice(d.l, d.l + clen) : InflateRawSync(d);
  const ncrc = CRC32.buf(out);

  /* 4.3.9 Data descriptor */
  if ((flags & 8) && crc === 0) {
    while (d.l <= d.length - 5) {
      const ddd = d.read_shift(4);
      if (ddd === ncrc) break;
      else if (ddd === 0x08074b50) {
        crc = d.read_shift(4) | 0;
        break;
      }
      d.l -= 3;
    }
    if (d.l >= d.length - 12) d.l = d.length - 12;
    clen = d.read_shift(4, "u");
    len = d.read_shift(4, "u");
  }

  /* error checking */
  if ((crc | 0) !== (ncrc | 0)) die(sprintf("funzip: zip crc error expected %#.8x found %#.8x", crc, ncrc), 9);
  if (out.length !== len) die(sprintf("funzip: zip length mismatch expected %u found %u", len, out.length), 9);

  return out;
}
