import os from 'os';
import path from 'path';
import { stdin } from 'node:process';
import fsPromises from 'node:fs/promises';
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
    let currentPath = path.normalize(os.homedir()); //.toString();
    return {
        setCurrentPath: (path) => currentPath = path,
        getCurrentPath: () => currentPath,
    };
}
const SEP = path.delimiter;
const START_PATH = os.homedir();
const CURRENT_PATH = currentPath();
const pathExists = async (path) => {
    return fsPromises.access(path).then(() => true, () => false);
};
async function executeCommand(input) {
    const inputArr = input.split(' ');
    const [command, args] = [inputArr[0], inputArr.slice(1).join(' ')];
    switch (command) {
        case '.exit':
            stdin.destroy();
            break;
        case 'up': // Go upper from current directory (when you are in the root folder this operation shouldn't change working directory)
            (() => {
                if (CURRENT_PATH.getCurrentPath() === START_PATH) {
                    console.log('Can\'t go upper');
                    return;
                }
                else {
                    CURRENT_PATH.setCurrentPath(path.dirname(CURRENT_PATH.getCurrentPath()));
                }
            })();
            break;
        case 'cd': // Go to dedicated folder from current directory (path_to_directory can be relative or absolute)
            await (async (args) => {
                if (!args) {
                    throw new Error('Arguments missing');
                }
                const normalizedPath = path.normalize(args).trim();
                const isAbsolute = path.isAbsolute(normalizedPath);
                const nextPath = isAbsolute ? normalizedPath : path.join(CURRENT_PATH.getCurrentPath(), normalizedPath);
                const isExistingPath = await pathExists(nextPath);
                if (!isExistingPath)
                    throw new Error('Path doesn\'t exists');
                if (isAbsolute && !nextPath.includes(START_PATH)) {
                    throw new Error('Can\'t change home directory');
                }
                CURRENT_PATH.setCurrentPath(nextPath);
            })(args);
            break;
        case 'ls': // Print in console list of all files and folders in current directory. List should contain:
            await (async () => {
                const files = await fsPromises.readdir(CURRENT_PATH.getCurrentPath(), { withFileTypes: true });
                const sortedFiles = files.map((file) => ({ name: file.name, type: file.isFile() ? 'file' : 'directory' }))
                    .sort((objA, objB) => {
                    if (objA.type === objB.type) {
                        return objA.name.localeCompare(objB.name);
                    }
                    else {
                        return objA.type.localeCompare(objB.type);
                    }
                });
                console.table(sortedFiles);
            })();
        default:
            throw new Error('Unknown command');
    }
}
;
function run() {
    const username = getUsername();
    console.log(`Welcome to the File Manager, ${username}!`);
    console.log(`You are currently in ${CURRENT_PATH.getCurrentPath()}`);
    stdin.on('data', async (input) => {
        try {
            await executeCommand(input.toString().trim());
        }
        catch (e) {
            const err = e;
            console.error(err.message);
        }
        finally {
            console.log(`You are currently in ${CURRENT_PATH.getCurrentPath()}`);
        }
    });
    process.on('SIGINT', () => {
        stdin.destroy();
    });
    stdin.on('close', () => {
        console.log(`Thank you for using File Manager, ${username}, goodbye!`);
    });
}
run();
