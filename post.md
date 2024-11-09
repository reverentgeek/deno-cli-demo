# Build a Command-Line Application using Deno 2.0

Command-line interfaces (CLI) are often used for automating tasks, such as building reports, synchronizing data between
systems, migrating data, deploying applications, and the list goes on and on. Over the years, I have built countless CLI
apps to save time. If I ever find myself doing something more than once, I try to find a way to automate it!

Deno 2.0 is a great solution for writing CLI apps. It supports TypeScript and JavaScript, it's cross-platform (runs on
Windows, macOS, and Linux), has dozens of powerful tools in its [standard library](https://jsr.io/@std), and can also
tap into [most Node.js modules](https://docs.deno.com/examples/npm/). The only limit is your imagination!

In this tutorial, you will learn how to:

- Create a command-line interface with Deno 2.0
- Parse command-line arguments
- Print help and version information
- Prompt for additional information
- Compile your app into a standalone executable

## Set Up Your CLI Project

First, let's make sure you have the tools you need!

- [Install Deno](https://docs.deno.com/runtime/getting_started/installation/)
- A good text editor, such as [Visual Studio Code](https://code.visualstudio.com/)

Open your computer's terminal (or command prompt). Change the current directory to the folder where you normally save
projects.

> **Note:** If you don't already have a folder where you store software projects, I personally like to create a folder
> at the root of my home directory named `projects`. More than likely, when you open your computer's terminal/console
> app, you are automatically placed in your "user home" folder. Use `mkdir projects` (or `md projects` if you're on
> Windows) to create the folder. Then, use `cd projects` to change to that new folder.

Verify you have Deno 2.0 (or higher) installed using the following command.

```sh
deno --version
```

You should see something like:

```sh
deno 2.0.5 (stable, release, aarch64-apple-darwin)
v8 12.9.202.13-rusty
typescript 5.6.2
```

If you receive an error, or if your version of Deno is 1.x, follow the
[installation](https://docs.deno.com/runtime/getting_started/installation/).

Next, enter the following commands to initialize a new Deno project.

```sh
deno init deno-cli-demo
cd deno-cli-demo
```

We're going to use Deno's [@std/cli](https://jsr.io/@std/cli) standard library, so add that to the project using the
following command.

```sh
deno add jsr:@std/cli
```

## Create Your First CLI App

Open up your new project using your preferred editor. Create a new file named `hello.ts` and add the following code.

```js
const now = new Date();
const message = "The current time is: " + now.toTimeString();

console.log("Welcome to Deno 🦕 Land!");
console.log(message);
```

From your terminal, enter the following command to run the script.

```sh
deno run hello.ts
```

You've built your first Deno CLI application! Feel free to play around with writing other things to the console.

## Using Command-Line Arguments

Arguments? No, we're not talking about getting into a heated debate with your command-line. Although that can certainly
happen. Computers can be rather obstinate.

_Command-line arguments_ are options and values you might provide the CLI when you run the app. When you enter
`deno run hello.ts`, `deno` is the CLI, and `run hello.ts` are two _arguments_ you provide to the CLI.

Create a new file in the project named `add.ts` and add the following code.

```typescript
import { parseArgs } from "@std/cli/parse-args";

const args = parseArgs(Deno.args);
console.log("Arguments:", args);
const a = args._[0];
const b = args._[1];
console.log(`${a} + ${b} = ` + (a + b));
```

The idea is to take two numbers and add them together. Try it out!

```sh
deno run add.ts 1 2
```

Experiment with additional arguments. Or, none at all. The `parseArgs` function can also handle arguments traditionally
called _switches_ and _flags_. Try the following and observe the output.

```sh
deno run add.ts 3 4 --what=up -t -y no
```

## Advanced Command-Line Arguments

We've only just scratched the surface of what you can do with command-line arguments. Let's try a more advanced example!

Create a new file named `sum.ts` and add the following code.

```typescript
import { parseArgs, ParseOptions } from "@std/cli/parse-args";
import meta from "./deno.json" with { type: "json" };

function printUsage() {
    console.log("");
    console.log("Usage: sum <number1> <number2> ... <numberN>");
    console.log("Options:");
    console.log("  -h, --help        Show this help message");
    console.log("  -v, --version     Show the version number");
}

const options: ParseOptions = {
    boolean: ["help", "version"],
    alias: { "help": "h", "version": "v" },
};
const args = parseArgs(Deno.args, options);

if (args.help || (args._.length === 0 && !args.version)) {
    printUsage();
    Deno.exit(0);
} else if (args.version) {
    // Pro tip: add a version to your deno.json file
    console.log(meta.version ? meta.version : "1.0.0");
    Deno.exit(0);
}

// validate all arguments are numbers
const numbers: number[] = args._.filter((arg) => typeof arg === "number");
if (numbers.length !== args._.length) {
    console.error("ERROR: All arguments must be numbers");
    printUsage();
    Deno.exit(1);
}
// sum up the number arguments
const sum = numbers.reduce((sum, val) => sum + val);

// print the numbers and the total
console.log(`${numbers.join(" + ")} = ${sum}`);
```

Whoa, there's a lot going on here 😬 Let's try it out, first, and then we'll cover some of highlights. Try the following
commands and see what happens.

```sh
deno run sum.ts 1 2 3 4 5
deno run sum.ts --help
deno run sum.ts --version
deno run sum.ts 1 2 three
```
