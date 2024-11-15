const fs = require("fs");

// Before running this code, run gen-file.js to generate sample.txt
// If you open task manager and search node there before running this below code
// You can search on windows 11 task manager, you will see that it reaches 2GB memory (at least did for me).
// It is because, it's loading whole file in memory and tries to console it.
fs.readFile("./sample.txt", (err, data) => {
  if (err) console.error(err);
  else console.log(data.toString());
});

// let's optimize it.
// This code is just taking 12.8 MB memory for me.
// const fileStream = fs.createReadStream("./sample.txt");

// fileStream.on("data", (data) => {
//   // console.log(data); // if you log this, you will see data in buffer. We need to convert to string.
//   console.log(data.toString());
// });

// fileStream.on("end", () => {
//   console.log("Read file succeed");
// });

// Now, let's try this with http. We will create a route for downloading the file but with streaming.
// const http = require("http");
// const path = require("path");

// const PORT = 3000;

// const server = http.createServer(async (req, res) => {
//   if (req.method === "GET" && req.url === "/") {
//     res.writeHead(200, { "Content-Type": "text/html" });
//     res.end(`
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Upload File</title>
//       </head>
//       <body>
//         <h1>Upload a File</h1>
//         <form action="/upload" method="POST" enctype="multipart/form-data">
//           <input type="file" name="file" required />
//           <button type="submit">Upload</button>
//         </form>
//       </body>
//       </html>
//     `);
//   } else if (req.method === "GET" && req.url === "/download") {
//     /// inefficient
//     // try {
//     //   const fileContent = await fs.promises.readFile("./sample.txt");
//     //   res.write(fileContent);
//     // } catch {
//     //   res.writeHead(500, { "Content-Type": "text/html" });
//     //   res.end("<h1>Server error occured</h1>");
//     // }

//     // const fileStream = fs.createReadStream("./sample.txt");

//     // fileStream.on("data", (data) => res.write(data));
//     // fileStream.on("error", () => {
//     //   res.writeHead(500, { "Content-Type": "text/html" });
//     //   res.end("<h1>Server error occured</h1>");
//     // });
//     // fileStream.on("end", () => {
//     //   res.end();
//     // });

//     // ALTERNATIVELY

//     const fileStream = fs.createReadStream("./sample.txt");

//     fileStream
//       .on("error", () => {
//         res.writeHead(500, { "Content-Type": "text/html" });
//         res.end("<h1>Server error occurred</h1>");
//       })
//       .pipe(res); // Here, .pipe is used to first read the data and write to another stream. It shortens our code.
//   } else {
//     res.writeHead(404, { "Content-Type": "text/html" });
//     res.end("<h1>404: Not Found</h1>");
//   }
// });

// server.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}`);
// });
