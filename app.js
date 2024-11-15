// http is based on EventEmitter internally. It is for creating web server.
const http = require("http");

// It takes a handler as an input with req, and res object
const server = http.createServer((req, res) => {
  //   console.log(req);

  if (req.method === "GET" && req.url === "/") {
    // res.write("Hello World");
    res.setHeader("Content-Type", "text/html");
    res.write("<h1>Hello World</h1>");
  }

  if (req.method === "GET" && req.url === "/api/users") {
    res.setHeader("Content-Type", "application/json");
    res.write(
      JSON.stringify([
        { name: "Binamra", id: 1 },
        { name: "Thapa", id: 2 },
      ])
    );
  }

  res.end();
});

// It takes port number as input. It must not be taken by any other program in your device.
const PORT = 3000;
server.listen(PORT);

console.log(`🔥 Listening on PORT ${PORT}`);

// You will notice that the application doesn't close.
// This is because, your application must be running to get and respond to requests.
// it won't close unless you get an error or you press Ctrl + C / Ctrl + D.
