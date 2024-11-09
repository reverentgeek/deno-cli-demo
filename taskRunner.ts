import { Spinner } from "@std/cli/unstable-spinner";

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function simulateTask(ms: number, message: string) {
    const spinner = new Spinner({
        message: `Running: ${message}...`,
        color: "yellow",
    });
    spinner.start();
    await sleep(ms);
    spinner.stop();
    console.log("Finished: " + message + ".");
}
