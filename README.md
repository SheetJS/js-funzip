# funzip

NodeJS implementation of the `funzip` utility to extract the first entry of a
ZIP or GZIP archive.

## Installation

With [npm](https://www.npmjs.org/package/funzip):

```bash
$ npm install -g funzip
```

## CLI Tool

The NodeJS module ships with a binary `funzip.njs` which has a help message:

```
$ funzip.njs -h

  Usage: funzip.njs <file> [options]

  Options:

    -V, --version         output the version number
    -P, --password <str>  decrypt with specified password
    -q, --quiet           do not write output
    -h, --help            output usage information
```

The tool will read from standard input if `filename` is `"-"` (single dash).
Contents are written to standard output.

## Notes

- Supported Methods: Method 8 (Deflate) and Method 0 (Stored)
- Strong Encryption is not supported
- NodeJS `zlib.InflateRaw` exposes the number of bytes read in versions after
  `8.11.0`. See https://github.com/nodejs/node/issues/8874 for more info.

## References

- ZIP `APPNOTE.TXT`: https://pkware.cachefly.net/webdocs/APPNOTE/APPNOTE-6.3.4.TXT
- GZIP RFC1952: https://tools.ietf.org/rfc/rfc1952.txt

## License

Please consult the attached LICENSE file for details.  All rights not explicitly
granted by the Apache 2.0 License are reserved by the Original Author.

[![Analytics](https://ga-beacon.appspot.com/UA-36810333-1/SheetJS/js-funzip?pixel)](https://github.com/SheetJS/js-funzip)