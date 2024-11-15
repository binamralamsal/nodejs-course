// In Node.js all these functions are available in global object.
console.log("Hello World");
// setTimeout();
// clearTimeout();
// setInterval();
// clearInterval();

// In client-side JavaScript all of those global objects were part of window object
// but window object doesn't exist in Node.js
// console.log(window); // This will throw an error
// console.log(document); // This will throw an error

// but instead we have global object.
global.console.log("Thapa Technical"); // global is a Node.js specific global object. It's not available in browsers.
globalThis.console.log("Thapa Technical"); // globalThis was standardize in ES11 and also works on browsers.

// You can log global object like this
console.log(globalThis);
console.log(globalThis.process); // or you can just log process

console.log(module); // This is a constant which you can use only when you are using commonjs.
// module looks like global object but it's not. If you try to access via globalThis.module, it won't work.
// In Node.js, every file is a module and variables and functions aren't available outside that file unless you export
// explicitly. You can see more details while logging module constant.
