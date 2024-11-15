// events module is an important module of Node.js
// many internal modules of Node.js uses it.
// It allows you to handle and emit events

// This returns EventEmitter class, that's why I am using Pascal convention.
const EventEmitter = require("events");

// This is an object based on EventEmitter.
// EventEmitter is a class which defines properties and methods that should be inside an event.
// This is like a blueprint
// You can create different objects using the same class which has different properties and methods.
// we are creating one below.
const emitter = new EventEmitter();

// This defines handler for an event.
// We are defining handler for "greet" event.
// You can think it like having handler for click events in JavaScript.
// this is same as emitter.addListener
// emitter.on("greet", () => {
//   console.log("Hello World");
// });

// This is used to emit an event. It's like signaling the event to do something.
// emitter.emit("greet");

// You can also pass arguments while emitting.
// emitter.on("greet", (age, name) => {
//   console.log("Hello World", age, name);
// });

// emitter.emit("greet", 23, "Binamra");

// but it's best idea to take a single argument as an object.
emitter.on("greet", (arg) => {
  console.log("Hello " + arg.name);
});

emitter.emit("greet", { name: "Binamra" });
