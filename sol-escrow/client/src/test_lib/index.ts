const BN = require("bn.js");

// Prefixes/postfixes are put in parens at the end of the line. endian - could be either le (little-endian) or be (big-endian).
console.log("toArray: ", new BN(2).toArray("le", 8)); // toArray: [2, 0, 0, 0, 0, 0, 0, 0];

// run at command line ts-node src/test_lib/index.ts
