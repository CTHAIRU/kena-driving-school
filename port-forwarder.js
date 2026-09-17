const http = require("http");

const server = http.createServer((req, res) => {
  const targetUrl = `http://localhost:3000${req.url}`;
  res.writeHead(302, {
    Location: targetUrl,
    "Content-Type": "text/html; charset=utf-8",
  });
  res.end(`<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${targetUrl}"></head><body>Redirecting to <a href="${targetUrl}">${targetUrl}</a></body></html>`);
});

server.listen(3001, "0.0.0.0", () => {
  console.log("Port 3001 forwarder to 3000 active");
});
