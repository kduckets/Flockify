const http = require("http");

http.createServer((req, res) => {
  res.writeHead(301, { Location: "https://flockify.vercel.app" + (req.url || "") });
  res.end();
}).listen(process.env.PORT || 3000, () => {
  console.log("Redirecting to https://flockify.vercel.app");
});
