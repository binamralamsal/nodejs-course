const os = require("os");

const architecture = os.arch();
const platform = os.platform();
const totalMemory = os.totalmem();
const freeMemory = os.freemem();

console.log({ architecture, platform, totalMemory, freeMemory });
