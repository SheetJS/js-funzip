/* funzip.js (C) 2018 SheetJS -- http://sheetjs.com */

import { CRC32Step } from "./wrapper/crc32";

import { MyBuffer, prep_blob } from "./util";

type IKeyState = [number, number, number];

/* 6.1 Traditional PKWARE Decryption */
export default function decrypt(data: MyBuffer, password: Buffer, len: number, crc: number): MyBuffer {
  /* 6.1.5 Initializing the encryption keys */
  const st: IKeyState = [ 0x12345678, 0x23456789, 0x34567890 ];
  init_keys(password, st);

  let C = 0;

  /* 6.1.6 Decrypting the encryption header */
  const Hdr = Buffer.alloc(12);
  for (let j = 0; j < 12; ++j) {
    C = (data.read_shift(1) ^ decrypt_byte(st)) & 0xFF;
    update_keys(C, st);
    Hdr[j] = C;
  }

  const crcbyte = ((crc >> 24) & 0xFF);
  if (crcbyte !== Hdr[11] && crcbyte !== Hdr[10]) throw new Error("incorrect password");

  /* 6.1.7 Decrypting the compressed data stream */
  const L: number = len - 12;
  const out: MyBuffer = (Buffer.alloc(L) as any);
  prep_blob(out);
  for (let j = 0; j < L; ++j) {
    C = (data.read_shift(1) ^ decrypt_byte(st)) & 0xFF;
    update_keys(C, st);
    out[j] = C;
  }
  return out;
}

function update_keys(ch: number, st: IKeyState): void {
  st[0] = CRC32Step(st[0], ch);
  st[1] += (st[0] & 0xFF);
  st[1] = ((st[1] & 0xFFFF) * 0x8088405 + (st[1] & 0xFFFF0000) * 0x8405 + 1) | 0;
  st[2] = CRC32Step(st[2], st[1] >> 24);
}

function init_keys(password: Buffer, st: IKeyState): void {
  for (let i = 0; i < password.length; ++i) update_keys(password[i], st);
}

function decrypt_byte(st: IKeyState): number {
  const temp = (st[2] & 0xffff) | 2;
  return ((temp * (temp ^ 1)) >> 8) & 0xFF;
}
