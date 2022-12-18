import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { stdout } from "node:process";

// Calculate hash for file and print it into console
export async function calcHash(path) {
    const hash = createHash('sha256');
    const input = createReadStream(path);
    input.pipe(hash).setEncoding('hex').pipe(stdout);
}
