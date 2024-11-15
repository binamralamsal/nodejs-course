const fs = require("fs");

// When you press Ctrl + Space after this below, you will see list of methods.
// You will see some functions with and without Sync at the end.
// Functions with Sync at the end are as named mentioned, synchronous: use it only for testing
// don't use sync functions in real-world projects.
// You must use functions without Sync.
// fs.

// I am using Sync only for learning purposes.
// This shows list of files in the given directory
// const files = fs.readdirSync(".");
// console.log(files);

// Time for asynchronous
// Every asynchronous functions in fs module takes a callback like this.
fs.readdir(".", (err, files) => {
  // Change the path to gibberish above to test error
  if (err) console.error(err);
  else console.log(err, files);
});

fs.readFile("./folder/child/test.txt", (err, content) => {
  if (err) console.error(err);
  // By default, you will get data in buffer, we need to convert it into string to get actual value
  else console.log(content.toString());
});

// This re-writes the file
// fs.writeFile("./folder/child/test.txt", "Hello World", (err) => {
//   if (err) console.error(err);
//   else console.log("File has been saved");
// });

// This appends into the file
// fs.appendFile("./folder/child/test.txt", "\nHello World", (err) => {
//   if (err) console.error(err);
//   else console.log("Content has been appended");
// });

// there are other functions like
// fs.exists() to check whether file or folder exists
// fs.rename() to rename file
// fs.unlink() to delete file
// fs.mkdir() to create folder
// You can check them out yourself in documentation, it's easy to use.
