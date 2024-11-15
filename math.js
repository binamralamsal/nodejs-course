const add = (a, b) => a + b;
const subtract = (a, b) => a - b;

const PI = 3.14;

// You can either use named export individually.

// module.exports.add = (a, b) => a + b;
// module.exports.subtract = (a, b) => a - b;

// or you can just export them directly at the end of file.

module.exports = {
  add,
  subtract,
  PI,
};
