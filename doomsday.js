var Doomsday = require("./lib/doomsday.js");
var parseArgs = require("minimist");

var args = parseArgs(process.argv.slice(2));

var date = args._.pop();

if (!date) {
  console.error("Please provide date.");
  process.exit(1);
}

var result = Doomsday(date);

console.log(result);
