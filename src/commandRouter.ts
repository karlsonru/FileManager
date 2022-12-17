import os from 'os';
import path from 'path';
import { stdin } from 'node:process';
import { moveUp, moveTo, listFiles } from './navModule.js';
import { createFile, readFile, renameFile, copyFile, moveFile, deleteFile } from './fsModule.js';
import { showInfoOS } from './osModule.js';
import { constructPath } from './pathModule.js';

function currentPath() {
  let currentPath = path.normalize(os.homedir());

  return {
    setCurrentPath: (path: string) => currentPath = path,
    getCurrentPath: () => currentPath,
  };
}

export const CURRENT_PATH = currentPath(); 

export async function commandRouter(input: string) {
  const inputArr = input.split(' ');
  const [command, args] = [inputArr[0], inputArr.slice(1)];
  const [src, dst] = [args[0], args[1]];

  switch(command) {
    case '.exit':
      stdin.destroy();
      break;

    case 'up': // Go upper from current directory (when you are in the root folder this operation shouldn't change working directory)
      moveUp(CURRENT_PATH.getCurrentPath(), CURRENT_PATH.setCurrentPath);
      break;

    case 'cd': // Go to dedicated folder from current directory (path_to_directory can be relative or absolute)
      await moveTo(CURRENT_PATH.getCurrentPath(), CURRENT_PATH.setCurrentPath, args.join(' '));
      break;

    case 'ls': // Print in console list of all files and folders in current directory. List should contain:
      await listFiles(CURRENT_PATH.getCurrentPath());
      break;

    case 'cat': // Read file and print it's content in console (should be done using Readable stream):
      await readFile(constructPath(CURRENT_PATH.getCurrentPath(), args.join(' ')));
      break;
    
    case 'add': // new_file_name Create empty file in current working directory:
      await createFile(CURRENT_PATH.getCurrentPath() + path.sep + args.join(' '));
      break;

    case 'rn': // Rename file (content should remain unchanged):
      await renameFile(constructPath(CURRENT_PATH.getCurrentPath(), ...args.slice(0, -1)), args.slice(-1).toString());
      break;

    case 'cp': // Copy file (should be done using Readable and Writable streams):
      await copyFile(constructPath(CURRENT_PATH.getCurrentPath(), ...args.slice(0, -1)), constructPath(CURRENT_PATH.getCurrentPath(), ...args.slice(-1)))
      break;

    case 'mv': // Move file (same as copy but initial file is deleted, copying part should be done using Readable and Writable streams):
      await moveFile(constructPath(CURRENT_PATH.getCurrentPath(), args[0]), constructPath(CURRENT_PATH.getCurrentPath(), args[1]));
      break;

    case 'rm': // Delete file:
      await deleteFile(constructPath(CURRENT_PATH.getCurrentPath(), ...args));
      break;

    case 'os':
      showInfoOS(...args);
      break;
      
    default:
      throw new Error('Unknown command');
  }
};
