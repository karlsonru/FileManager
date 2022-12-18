import path from 'path';
import os from 'os';
import fsPromises from 'node:fs/promises';
import { pathExists } from './pathModule.js';

const START_PATH = os.homedir();

export function moveUp(currentPath, setPath) {
    if (currentPath === START_PATH) {
        console.log('Can\'t go upper');
        return;
    }
    else {
        setPath(path.dirname(currentPath));
    }
};

export async function moveTo(currentPath, setPath, args) {
    if (!args) {
        throw new Error('Arguments missing');
    }

    const normalizedPath = path.normalize(args).trim();
    const isAbsolute = path.isAbsolute(normalizedPath);
    const nextPath = isAbsolute ? normalizedPath : path.join(currentPath, normalizedPath);
    const isExistingPath = await pathExists(nextPath);

    if (!isExistingPath)
        throw new Error('Path doesn\'t exists');

    if (isAbsolute && !nextPath.includes(START_PATH)) {
        throw new Error('Can\'t change home directory');
    }

    setPath(nextPath);
}

export async function listFiles(dirPath) {
    const files = await fsPromises.readdir(dirPath, { withFileTypes: true });
    const sortedFiles = files.map((dirent) => ({ name: dirent.name, type: dirent.isFile() ? 'file' : 'directory' }))
        .sort((objA, objB) => {
        if (objA.type === objB.type) {
            return objA.name.localeCompare(objB.name);
        }
        else {
            return objA.type.localeCompare(objB.type);
        }
    });
    console.table(sortedFiles);
};
