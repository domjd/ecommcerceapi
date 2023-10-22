const db = require('./db_credentials');


const getCartDetailsFromCustomerID = (id, cb) => {
    db.query(`SELECT id, customer_id FROM carts WHERE customer_id = $1;`,[id], (error, results) => {
        if(error) throw error;
        console.log(results.rows)
        return (cb(results.rows[0]));
    })
}

const getCartDetailsFromCartID = (id, cb) => {
    db.query(`SELECT id, customer_id FROM carts WHERE id = $1;`,[id], (error, results) => {
        if(error) throw error;
        console.log(results.rows)
        return (cb(results.rows[0]));
    })
}

const getCartTotal = (id, cb) => {
    db.query(`SELECT SUM(products.price * carts_products.quantity) AS total
    FROM carts_products
    JOIN products ON products.id = carts_products.product_id
    JOIN carts ON carts.id = carts_products.cart_id
    WHERE carts.customer_id = $1;`,[id], (error, results) => {
        if(error) throw error;
        return (cb(results.rows[0].total));
    })
}

module.exports = {
    getCartDetailsFromCartID,
    getCartDetailsFromCustomerID,
    getCartTotal
};