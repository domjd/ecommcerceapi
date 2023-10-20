const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

const orders = require('./orders');
const products = require('./products');

app.use('/orders', orders);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})
