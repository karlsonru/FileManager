import path from 'path';
import fsPromises from 'node:fs/promises';

export function constructPath(currentPath, ...args) {
    const nextPath = path.join(...args);

    /*
    console.log('join: ', path.join(...args));
    console.log('normalize: ', path.normalize(args.join(' ')));
    console.log('nextPath: ', nextPath);
    console.log('isAbs: ', path.isAbsolute(nextPath));
    */

    if (path.isAbsolute(nextPath)) {
        return nextPath;
    };

    return path.resolve(path.join(currentPath, ...args));
}

export async function pathExists(path) {
    return fsPromises.access(path).then(() => true, () => false);
};

export async function verifyPath(...args) {
    const absolutePath = path.resolve(...args);
    return await pathExists(absolutePath);
}
