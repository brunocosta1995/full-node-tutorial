const http = require("http");
const routes = require("./routes.js");

const server = http.createServer(routes.handler);

console.log(routes.someText);


server.listen(8080, () => {
  console.log("Listen to the port 8080");
});
