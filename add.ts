import { parseArgs } from "@std/cli/parse-args";

const args = parseArgs(Deno.args);
console.log("Arguments:", args);
const a = args._[0];
const b = args._[1];
console.log(`${a} + ${b} = ` + (a + b));
