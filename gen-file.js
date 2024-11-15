const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(__dirname, "sample.txt");
const FILE_SIZE_MB = 500;
const MB_TO_BYTES = 1024 * 1024;
const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function getRandomText(size) {
  let result = "";
  for (let i = 0; i < size; i++) {
    result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }
  return result;
}

const writeStream = fs.createWriteStream(FILE_PATH);
let bytesWritten = 0;

function writeData() {
  let canWrite = true;

  while (canWrite && bytesWritten < FILE_SIZE_MB * MB_TO_BYTES) {
    const remainingBytes = FILE_SIZE_MB * MB_TO_BYTES - bytesWritten;
    const chunkSize = Math.min(1024 * 1024, remainingBytes);
    const chunk = getRandomText(chunkSize);

    bytesWritten += chunkSize;
    canWrite = writeStream.write(chunk);
  }

  if (bytesWritten < FILE_SIZE_MB * MB_TO_BYTES) {
    writeStream.once("drain", writeData);
  } else {
    writeStream.end(() => {
      console.log(`File created: ${FILE_PATH}`);
    });
  }
}

writeData();
