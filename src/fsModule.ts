import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

// cat path_to_file Read file and print it's content in console (should be done using Readable stream):
export async function readFile(path: string) { 
  const stream = fs.createReadStream(path, {encoding: 'utf-8'} );

  stream.on('data', (data) => {
    console.log(data);
  });

  stream.on('error', (err) => {
    if (err.message.includes('no such file or directory')) {
      console.error('No such file or directory');
    } else {
      console.error('Error occured while reading from stream');
    };
  })
}

// add new_file_name Create empty file in current working directory:
export async function createFile(path: string) {
  const write = fs.createWriteStream(path, {
    encoding: 'utf-8',
  });

  write.on('error', () => {
    console.error('Error occured while writing file');
  });
}

export async function renameFile(oldPath: string, newFilename: string) {
  const nextPath = path.dirname(oldPath) + path.sep + newFilename;
  await fsPromises.rename(oldPath, nextPath);
}

export async function copyFile(src: string, dst: string) {
  const readable = fs.createReadStream(src);
  const writeable = fs.createWriteStream(dst);

  readable.pipe(writeable);
}

// Move file (same as copy but initial file is deleted, copying part should be done using Readable and Writable streams):
export async function moveFile(src: string, dst: string) {
  await copyFile(src, dst);
  await deleteFile(src);
}

// Delete file:
export async function deleteFile(src: string) {
  await fsPromises.rm(src);
}
