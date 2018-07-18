#!/usr/bin/env node
/* funzip.js (C) 2018 SheetJS -- http://sheetjs.com */

var mod = require('../');
if (typeof mod == 'function') mod(process);
else if (typeof mod.default == 'function') mod.default(process);
