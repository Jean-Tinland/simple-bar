const WebSocket = require("ws");

process.title = "simple-bar-server";

const wss = new WebSocket.Server({ port: 7777 });
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  console.log(wss.clients);
  for (const ws of wss.clients) {
    ws.send({ url: req.url });
  }
  res.end("Hello World!\n");
});

server.listen(7776, "127.0.0.1");

wss.on("connection", (ws) => {
  console.log("New client connected!");

  ws.on("close", () => {
    console.log("Client disconnected!");
  });
});

wss.on("listening", () => {
  console.log("Server started...");
});
