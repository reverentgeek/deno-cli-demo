import "@std/dotenv/load";
import { parseArgs, ParseOptions } from "@std/cli/parse-args";
import { promptSecret } from "@std/cli/prompt-secret";
import { Spinner } from "@std/cli/unstable-spinner";

import meta from "./deno.json" with { type: "json" };
import { sleep } from "./utils.ts";

function printUsage() {
	console.log("Usage: ");
	console.log("  updater --input <input file> --output <output file>");
	console.log("Options:");
	console.log("  -h, --help        Show this help message");
	console.log("  -v, --version     Show the version number");
	console.log("  -i, --input       Input file");
	console.log("  -o, --output      Output file");
}

if (import.meta.main) {
	const options: ParseOptions = {
		boolean: ["help", "version"],
		string: ["input", "output"],
		alias: { "help": "h", "version": "v", "input": "i", "output": "o" },
	};
	const args = parseArgs(Deno.args, options);

	if (args.help) {
		printUsage();
		Deno.exit(0);
	} else if (args.version) {
		// Pro tip: add a version to your deno.json file
		console.log(meta.version ? meta.version : "1.0.0");
		Deno.exit(0);
	}

	// validate the input and output arguments
	if (!args.input || !args.output) {
		console.log("You must specify both an input and output file");
		printUsage();
		Deno.exit(1);
	}

	// attempt to get the username and password from environment variables
	let user = Deno.env.get("MY_APP_USER");
	let password = Deno.env.get("MY_APP_PASSWORD");

	if (user === undefined) {
		const userPrompt = prompt("Please enter the username:");
		user = userPrompt ?? "";
	}
	if (password === undefined) {
		const passPrompt = promptSecret("Please enter the password:");
		password = passPrompt ?? "";
	}

	const spinner = new Spinner({ message: "Loading...", color: "yellow" });
	console.log(`Reading input file [${args.input}]...`);
	spinner.start();
	await sleep(2000);
	spinner.stop();
	console.log(`Connecting with user [${user}]...`);
	spinner.start();
	await sleep(2000);
	spinner.stop();
	console.log(`Writing output file [${args.output}]...`);
	spinner.start();
	await sleep(2000);
	spinner.stop();
	console.log("Done!");
}
