const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

// app.use(bodyParser.urlencoded()) // x-www-form-urlenconded <form>
app.use(bodyParser.json());

//Permitir o acesso de aplicações as requisições de diferentes endereços e dominios
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow_Headers', 'Content-Type, Authorization');
})

app.use('/feed', feedRoutes);

app.listen(8080, () => {
    console.log('Listen to the 8080 port');    
})