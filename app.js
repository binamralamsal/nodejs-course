const path = require("path");

// There are few constants added by Node.js when you are using commonjs. Note, these are only available in commonjs
console.log(__filename);
console.log(__dirname);

// It gives details of the path given.
console.log(path.parse(__filename));

// You can join path like this, why is this useful? Because, Windows uses \ for separating path segments
// but linux uses / for separating path segments. It uses the one based on operating system.
const filePath = path.join("folder", "child", "test.txt");

// This helps to get full absolute path based on our project directory.
// Note: It doesn't check whether the file or folder exists.
const resolvedPath = path.resolve(filePath);
const extname = path.extname(filePath);
const basename = path.basename(filePath);
const dirname = path.dirname(filePath);
// This gives most of the details given above in an object.
const parsedPath = path.parse(filePath);

console.log({
  filePath,
  resolvedPath,
  extname,
  basename,
  dirname,
  parsedPath,
  separator: path.sep, // This shows platform specific separator
});
