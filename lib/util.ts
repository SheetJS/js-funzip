/* funzip.js (C) 2018 SheetJS -- http://sheetjs.com */

import cp437dec from "./wrapper/cp437";

interface IBuffer extends Buffer {
  l: number;
  read_shift: any;
}
export { IBuffer as MyBuffer };

export function prep_blob(out: Buffer, pos?: number): void {
  const buf: IBuffer = out as IBuffer;
  buf.l = pos || 0;
  buf.read_shift = ReadShift;
}

export function die(msg: string, ec?: number): void {
  process.stderr.write(msg + "\n");
  process.exit(ec || 1);
}

function ReadShift(this: IBuffer, size: number, t?: string) {
  let o: number|string = "";
  let i = 0;
  let loc = 0;
  if (t === "dbcs") {
    loc = this.l;
    if (typeof Buffer !== "undefined" && Buffer.isBuffer(this)) o = this.slice(this.l, this.l + 2 * size).toString("utf16le");
    else for (i = 0; i !== size; ++i) {
      o += String.fromCharCode(this.readUInt16LE(loc));
      loc += 2;
    }
    size *= 2;
  } else if (t === "str") {
    loc = this.l;
    if (typeof Buffer !== "undefined" && this instanceof Buffer) o = this.slice(this.l, this.l + size).toString("utf8");
    else for (i = 0; i !== size; ++i) {
      o += String.fromCharCode(this.readUInt8(loc));
      loc++;
    }
  } else if (t === "cp437") {
    loc = this.l;
    for (i = 0; i !== size; ++i) {
      const k = this.readUInt8(loc);
      if (k <= 0x80) o += String.fromCharCode(k);
      else o += cp437dec[k];
      loc++;
    }
    o = o.replace(/\r\n/g, "\n");
  } else switch (size) {
    case 1: o = this.readUInt8(this.l); break;
    case 2: o = t === "i" ? this.readInt16LE(this.l) : this.readUInt16LE(this.l); break;
    case 4: o = this.readUInt32LE(this.l); break;
    /* falls through */
    case 16: o = this.toString("hex", this.l, this.l + 16); break;
  }
  this.l += size; return o;
}
