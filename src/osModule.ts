import os from 'os';

export function showInfoOS(...commands: string[]) {
  const args = commands.join(',');
  switch(true) {
    case args.includes('--EOL'):
      console.log(os.EOL);
      break;

    // Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz) for each of them) and print it to console
    case args.includes('--cpus'):
      console.table(os.cpus());
      break;

    // Get home directory and print it to console
    case args.includes('--homedir'):
      console.log(`Homedir is: ${os.homedir()}`);
      break;

    // Get current system user name (Do not confuse with the username that is set when the application starts) and print it to console
    case args.includes('--username'):
      console.log(os.userInfo().username);
      break;
    
    // Get CPU architecture for which Node.js binary has compiled and print it to console
    case args.includes('--architecture'):
      console.log(os.arch());
      break;

    default:
      console.log('No valid args passed');
  }
}
