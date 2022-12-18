import fs from 'node:fs';
import fsPromises from 'node:fs/promises';

// cat path_to_file Read file and print it's content in console (should be done using Readable stream):
export async function readFile(path) {
    const stream = fs.createReadStream(path);

    stream.setEncoding('utf-8');
    stream.on('data', () => {
        console.log(stream.read());
    });
}

// add new_file_name Create empty file in current working directory:
export async function createFile(path) {
    fsPromises.writeFile(path, '');
}
