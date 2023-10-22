const db = require('../db_credentials');
const dbHelper = require('../db_helper');

const getCarts = (request, response) => {
    db.query('SELECT * FROM carts ORDER BY id ASC', (error, results) => {
        if(error) throw error;

        response.status(200).json(results.rows);
    })
}

const getCartById = (request, response) => {
    const id = parseInt(request.params.id);

    db.query('SELECT * FROM carts WHERE id = $1', [id], (error, results) => {
        if(error) throw error;

        response.status(200).json(results.rows);
    })
}

const addCart = (request, response) => {
    const {name, customer_id, description, price} = request.body;
    console.log(request.body);
    db.query('INSERT INTO carts (name, customer_id, created_at) VALUES ($1, $2, NOW()) RETURNING *', [name, customer_id], 
    (error, results) => {
        if(error) throw error;

        response.status(200).json(results.rows);
    })
}

const updateProduct = (request, response) => {
    const id = parseInt(request.params.id);

    const updateData = request.body;    

    // Start building the SQL query
    const updateQuery = [];
    const values = [];
  
    for (const key in updateData) {
      // Add each key and value to the query
      updateQuery.push(`${key} = $${values.length + 1}`);
      values.push(updateData[key]);
    }

    const updateString = `
    UPDATE products
    SET ${updateQuery.join(', ')}
    WHERE id = $${values.length + 1}
    RETURNING *;`;

    values.push(parseInt(id));


    db.query(updateString, 
    values,
    (error, results) => {
        if(error) throw error;

        response.status(200).json(results.rows);
/*         response.status(200).json([{
            ...results.rows[0],
            price: parseFloat(results.rows[0].price)
        }]); */
    })
}

const deleteCart = (request,response) => {
    const id = parseInt(request.params.id);

    db.query('DELETE * FROM carts_products WHERE cart_id = $1', [id], (error, results) => {
        if(error) throw error;

        db.query('DELETE * FROM carts WHERE id = $1', [id], (error, results) => {
            if(error) throw error;
    
            response.status(200).json(`Cart ${id} succesfully deleted!`);
        })
        
    })


}

const checkout = (request, response) => {
    const id = request.params.id;

    dbHelper.getCartDetailsFromCartID(id, (cartDetails) => {

        if(!cartDetails) response.status(404).json({message: `Cart Not Found`});

        dbHelper.getCartTotal(cartDetails.customer_id, (total) => {
            db.query(`INSERT INTO orders (status, total_amount,customer_id, order_date) VALUES ('Pending', $1,$2, NOW()) RETURNING *;`, [total,cartDetails.customer_id], 
            (error, results) => {
                if(error) throw error;

                const orderDetails = results.rows[0];
                console.log(orderDetails);

                db.query(`INSERT INTO orders_products (order_id, product_id, quantity)
                SELECT $1 AS order_id, product_id, quantity
                FROM carts_products
                WHERE cart_id = $2;`, [orderDetails.id, id], (error, results) => {

                    db.query(`DELETE FROM carts_products
                    WHERE cart_id = $1;`, [id], (error, results) => {
                        if(error) throw error;

                        db.query(`DELETE FROM carts
                        WHERE id = $1;`, [id], (error, results) => {
                            if(error) throw error;
                            response.status(200).json({message:"Order Created Successfully",order_id: orderDetails.id, customer_id: orderDetails.customer_id});
                        })
                       
                    })

                })

            });

        })



    })

}

module.exports = {
    getCarts,
    getCartById,
    checkout,
    deleteCart
};