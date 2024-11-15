const crypto = require("crypto");

// To generate cryptographically well-built artificial random data in terms of given bytes.
// You can convert that bytes into a string format with whatever you want.
const randomValue = crypto.randomBytes(32).toString("hex");

// You can create different types of hash using createHash, one of those type available is sha256.
// Hashes are unique for the value that you give, like we are giving "Hello World" for hashing.
// and trying to get that in hex format, you can get in other formats.
// Check documentation for other methods and details
// We will use this function in future projects.
const hash = crypto.createHash("sha256").update("Hello World").digest("hex");

console.log({ randomValue, hash });
