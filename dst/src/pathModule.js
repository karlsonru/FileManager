import path from 'path';
import fsPromises from 'node:fs/promises';
export function constructPath(...args) {
    return path.resolve(...args);
}
export async function pathExists(path) {
    return fsPromises.access(path).then(() => true, () => false);
}
;
export async function verifyPath(...args) {
    const absolutePath = path.resolve(...args);
    return await pathExists(absolutePath);
}
