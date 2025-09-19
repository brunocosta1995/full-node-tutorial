const fs = require("fs");

function requestHandler(req, res) {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>My first node js app</title></head>");
    res.write(
      "<body><form action='/message' method='post'><input type='text' name='message'/><button>Send</button></form></body>"
    );
    res.write("</html>");
    return res.end();
  }

  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunky) => {
      body.push(chunky);
      console.log(chunky);
    });
    return req.on("end", () => {
      const parsedData = Buffer.concat(body).toString();
      console.log(parsedData);
      const message = parsedData.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My first node js app</title></head>");
  res.write("<body><h1>Hello nodejs</h1></body>");
  res.write("</html>");
  res.end();
}

// module.exports = requestHandler;

// module.exports = {
//     requestHandler: requestHandler,
//     someText: 'Hard coded NodeJs'
// }

exports.handler = requestHandler;
exports.someText = 'New Code'
