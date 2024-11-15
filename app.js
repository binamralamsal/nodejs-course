// You can either get all in a variable
// const math = require("./math");
// and use like

// console.log(math.add(1, 2));

// or destructure them like this
const { add, subtract, PI } = require("./math");

console.log(add(5, 3));
console.log(subtract(10, 4));
console.log(PI);
