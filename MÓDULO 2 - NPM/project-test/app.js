const http = require("http");
const routes = require("./routes");

const server = http.createServer(routes.handler);

console.log(routes.someText);


server.listen(3000, () => {
  console.log("Listen to the port 3000");
});
