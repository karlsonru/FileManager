import os from 'os';
import path from 'path';
import { stdin } from 'node:process';
import fsPromises from 'node:fs/promises';
import { moveUp, moveTo, listFiles } from './src/navigationMobulde';

function getUsername() {
  let username = '';
  process.argv.forEach((arg, idx) => {
    if (arg.startsWith('--username')) {
      username = arg.split('=')[1];
      return;
    }
  });
  return username || 'Anonymous';
}

function currentPath() {
  let currentPath = path.normalize(os.homedir()) //.toString();
  return {
    setCurrentPath: (path: string) => currentPath = path,
    getCurrentPath: () => currentPath,
  };
}

const SEP = path.delimiter;
const START_PATH = os.homedir();
const CURRENT_PATH = currentPath(); 

const pathExists = async (path: string) => {
  return fsPromises.access(path).then(() => true, () => false);
};

async function executeCommand(input: string) {
  const inputArr = input.split(' ');
  const [command, args] = [inputArr[0], inputArr.slice(1).join(' ')];

  switch(command) {
    case '.exit':
      stdin.destroy();
      break;

    case 'up': // Go upper from current directory (when you are in the root folder this operation shouldn't change working directory)
      moveUp(CURRENT_PATH.getCurrentPath(), CURRENT_PATH.setCurrentPath);
      break;

    case 'cd': // Go to dedicated folder from current directory (path_to_directory can be relative or absolute)
      await moveTo(CURRENT_PATH.getCurrentPath(), CURRENT_PATH.setCurrentPath, args);
      break;

    case 'ls': // Print in console list of all files and folders in current directory. List should contain:
      await listFiles(CURRENT_PATH.getCurrentPath());

    default:
      throw new Error('Unknown command');
  }
};

function run() {
  const username = getUsername();
  console.log(`Welcome to the File Manager, ${username}!`);
  console.log(`You are currently in ${CURRENT_PATH.getCurrentPath()}`);

  stdin.on('data', async (input) => {
    try {
      await executeCommand(input.toString().trim());
    } catch (e) {
      const err = e as Error;
      console.error(err.message);
    } finally {
      console.log(`You are currently in ${CURRENT_PATH.getCurrentPath()}`);
    }
  })

  process.on('SIGINT', () => {
    stdin.destroy();
  })

  stdin.on('close', () => {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  })
}

run();
