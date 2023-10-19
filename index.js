const express = require('express');
const app = express();
const PORT = 3000;

const orders = require('./orders');
const products = require('./products');

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})
