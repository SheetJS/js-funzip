/* funzip.js (C) 2018 SheetJS -- http://sheetjs.com */

import sprintf from "../wrapper/sprintf";

import { die, MyBuffer, prep_blob } from "../util";

import process_data_gzip from "./gzip";
import process_data_zip from "./zip";

export default function process_data(buf: Buffer, opts: any): void {
  const data: MyBuffer = buf as MyBuffer;
  prep_blob(data);
  const sig: number = data.read_shift(2);

  let out: Buffer = Buffer.alloc(0);
  switch (sig) {
    case 0x4b50: out = process_data_zip(data, opts.password); break;
    case 0x8b1f: out = process_data_gzip(data); break;
    default: die(sprintf("funzip: not a valid file, signature %04x", sig), 3);
  }

  if (out.length && !opts.quiet) process.stdout.write(out);
}
