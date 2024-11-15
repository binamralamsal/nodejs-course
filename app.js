const fs = require("fs");

// We used fs in previous section but you might miss using async/await. This video is for that.
// fs package was introduced when Node.js was released which means, promises or async/await wasn't a feature at that time.
// so, they used callback functions at that time.
// to use promises version of fs. You can use fs.promises

// Since it's a promise version, you can use .then() or .catch()
fs.promises
  .readdir(".")
  .then((files) => console.log(files))
  .catch((err) => console.error(err));

// or you can simply use async/await. async/await is just wrapper around .then() and .catch()
// I am using Immediately Invoked Functions to use async/await as you can't use on top of the file.
// Remember that, it is just a limitation of commonjs.
// When we use es modules in future, you can use async/await on top of file if you have v14.8.0 and later.
(async () => {
  try {
    const content = await fs.promises.readFile("./folder/child/test.txt");
    console.log(content.toString());
  } catch (err) {
    console.error(err);
  }
})();

// Are you tired of using fs.promises everytime?
// You can actually just import with fs/promises
// const fs = require("fs/promises")
// Now, you don't need to use fs.promises everytime.
