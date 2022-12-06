import path from 'node:path';
import fsPromises from 'node:fs/promises';

const pathExists = async (path) => {
  return fsPromises.access(path).then(() => true, () => false);
};

let norm = path.normalize('C:/Users/ivpol/.ssh');
let path1 = path.parse(norm);
console.log(path1)
let res = await pathExists(norm);
console.log(res)

let res2 = path.toNamespacedPath('C:\Users\ivpol');
console.log(res2);
console.log(await pathExists(res2));