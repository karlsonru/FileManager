import path from 'path';
import fsPromises from 'node:fs/promises';

/* 
TODO: Вот в чём проблема:
нужно определять какой путь передан - это путь абсолютный или относительный? 
исходя из этого конструировать путь из аргументов
*/

export function constructPath(currentPath: string, ...args: string[]) {  
  const nextPath = path.join(...args);

  console.log('join: ', path.join(...args));
  console.log('normalize: ', path.normalize(args.join(' ')));
  console.log('nextPath: ', nextPath);
  console.log('isAbs: ', path.isAbsolute(nextPath));

  if (path.isAbsolute(nextPath)) {
    return nextPath;
  };

  // console.log('return: ', path.resolve(path.join(currentPath, ...args)));
  return path.resolve(path.join(currentPath, ...args));
}

export async function pathExists(path: string) {
  return fsPromises.access(path).then(() => true, () => false);
};

export async function verifyPath(...args: string[]) {
  const absolutePath = path.resolve(...args);
  return await pathExists(absolutePath);
}
