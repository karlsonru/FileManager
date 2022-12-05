import { stdin, cwd } from 'node:process';

function printCwd() {
  console.log(`You are currently in ${cwd}`);
}

function getUsername() {
  let username = null;
  process.argv.forEach((arg, idx) => {
    if (arg.startsWith('--username')) {
      username = arg.split('=')[1];
      return;
    }
  });
  return username;
}

function indentifyCommand(command) {
  switch(command) {
    case '.exit':
      return 'exit';
  }
}

function executeCommand(command) {
  const commands = {
    'exit': () => stdin.destroy(),
  }

  commands[command]();
}

function run() {
  const username = getUsername();
  console.log(`Welcome to the File Manager, ${username}!`);

  stdin.on('data', (input) => {
    const command = indentifyCommand(input.toString().trim());

    executeCommand(command);
  })

  process.on('SIGINT', () => {
    stdin.destroy();
  })

  stdin.on('close', () => {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  })
}

run();
