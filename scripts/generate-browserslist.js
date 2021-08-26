const fs = require("fs");
const b = require("browserslist-generator");

const TARGET = "es2017";

const list = b.browsersWithSupportForEcmaVersion(TARGET);

console.log(`Browserslist for ${TARGET}:`);
for (const item of list) {
  console.log(`- ${item}`);
}

console.log();
console.log("Saving to .browserslistrc");

let output = "";
for (const item of list) {
  output += item + "\n";
}

fs.writeFile("./.browserslistrc", output, (err) => {
  if (err) {
    console.error(err);
  }
});
