const express = require("express");
const bodyparser = require("body-parser");
const path = require('path');

const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");

const app = express();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/admin', adminRouter); //filtrando as rotas para que todas sejam acessadas com o caminho apresentado
app.use(shopRouter);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000, () => {
  console.log("Listen to the port 3000");
});


