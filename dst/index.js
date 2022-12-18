import { stdin } from 'node:process';
import { commandRouter, CURRENT_PATH } from './src/commandRouter.js';

function getUsername() {
    let username = '';
    process.argv.forEach((arg) => {
        if (arg.startsWith('--username')) {
            username = arg.split('=')[1];
            return;
        }
    });
    return username || 'Anonymous';
}

function run() {
    const username = getUsername();
    console.log(`Welcome to the File Manager, ${username}!`);
    console.log(`You are currently in ${CURRENT_PATH.getCurrentPath()}`);

    stdin.on('data', async (input) => {
        try {
            await commandRouter(input.toString().trim());
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
