// There are some features and caveats when using ES Modules.

// After v14.8 onward, you can use top-level await.

const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
const json = await response.json();
console.log(json);

// Some caveats are: module, __dirname, and __filename aren't available with ES Module.
// You most probably don't need module but you might need __dirname, and __filename.
// Fortunately, After Node.js 20.11.0, we have access to __dirname, and __filename via import.meta
console.log(import.meta.dirname);
console.log(import.meta.filename);

// if you are using lower versions then you can use this:
// import path from "path";

// const __filename = new URL(import.meta.url).pathname; // import.meta.url was available in previous versions too.
// const __dirname = path.dirname(__filename);
// console.log({ __dirname, __filename });
