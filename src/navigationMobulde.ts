import path from 'path';
import os from 'os';
import fsPromises from 'node:fs/promises';

const START_PATH = os.homedir();

export async function pathExists(path: string) {
  return fsPromises.access(path).then(() => true, () => false);
};

export function moveUp(currentPath: string, setPath: (path: string) => void) {
  if (currentPath === START_PATH) {
    console.log('Can\'t go upper');
    return
  } else {
    setPath(path.dirname(currentPath));
  }
};

export async function moveTo(currentPath: string, setPath: (path: string) => void, args: string) {
    if (!args) {
      throw new Error('Arguments missing');
    }

    const normalizedPath = path.normalize(args).trim();
    const isAbsolute = path.isAbsolute(normalizedPath);

    const nextPath = isAbsolute ? normalizedPath : path.join(currentPath, normalizedPath);

    const isExistingPath = await pathExists(nextPath);
    if (!isExistingPath) throw new Error('Path doesn\'t exists');

    if (isAbsolute && !nextPath.includes(START_PATH)) {
      throw new Error('Can\'t change home directory');
    }

    setPath(nextPath);
}

export async function listFiles(path: string) {
  const files = await fsPromises.readdir(path, { withFileTypes: true });
  const sortedFiles = files.map(
    (file) => ({ name: file.name, type: file.isFile() ? 'file': 'directory' }))
    .sort((objA, objB) => {
      if (objA.type === objB.type) {
        return objA.name.localeCompare(objB.name);
      } else {
        return objA.type.localeCompare(objB.type);
      }
    });
  console.table(sortedFiles);
};
