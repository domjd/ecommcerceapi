const db = require('../db_credentials');
const dbHelper = require('../db_helper');

const getCustomers = (request, response) => {
    db.query('SELECT * FROM customers ORDER BY id ASC', (error, results) => {
        if(error){
            throw error;
        }

        response.status(200).json(results.rows)
    }); 

}

const getCustomerById = (request, response) => {
    const id = request.params.id;

    db.query('SELECT * FROM customers ORDER BY id ASC WHERE id = $1', (error, results) => {
        if(error){
            throw error;
        }

        response.status(200).json(results.rows)
    }); 

}

const updateCustomer = (request, response) => {
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

const deleteCustomer = (request,response) => {
    const id = parseInt(request.params.id);

    db.query('DELETE * FROM products WHERE id = $1', [id], (error, results) => {
        if(error) throw error;

        response.status(200).json(`Customer ${id} succesfully deleted!`);
    })
}

const getCustomerOrders = (request, response) => {
    const id = request.params.id;

    db.query('SELECT * FROM orders WHERE customer_id = $1 ORDER BY id ASC', [id], (error, results) => {
        if(error) throw error;

        response.status(200).json(results.rows);
    })
}

const getCustomerCart = (request, response) => {
    const id = request.params.id;

    db.query(`SELECT id FROM carts WHERE customer_id = $1;`, [id], (error, results) => {
        if(error) throw error;
        
        const cartId = results.rows[0].id;
        console.log(results.rows[0]);

        if(!cartId) response.status(404).json({message: "Cart Not Found"});
        
        
        db.query(`SELECT products.name,products.id AS product_id, products.price, carts_products.quantity 
        FROM customers 
        INNER JOIN carts ON customers.id = carts.customer_id 
        INNER JOIN carts_products ON carts.id = carts_products.cart_id 
        INNER JOIN products ON carts_products.product_id = products.id 
        WHERE customers.id = $1;`, 
        [id], (error, results) => {
            if(error) throw error;

            dbHelper.getCartTotal(id, (total) => {
                response.status(200).json({
                    customer_id: id,
                    cart_id: cartId,
                    cart_total: total,
                    cart_items: results.rows
                });
            });
        })
    })

}

const addCustomerCart = (request, response) => {
    const id = request.params.id;

    db.query(`INSERT INTO carts (customer_id, created_at)
    VALUES ($1, NOW()) RETURNING *;`, [id], (error, results) => {
        if(error) throw error;
        
        response.status(200).json(results.rows);
    })
}

const updateCustomerCart = (request, response) => {
    const id = request.params.id;
    const {product_id, quantity} = request.body;

    dbHelper.getCartDetailsFromCustomerID(id, (cartDetails) => {

        db.query(`INSERT INTO carts_products (cart_id, product_id, quantity)
        VALUES ($1, $2, $3)
         RETURNING *;`, [cartDetails.id, product_id, quantity], (error, results) => {
            if(error) throw error;
            
            response.status(200).json(results.rows);
        })
    });
}

const deleteCustomerCart = (request, response) => {
    const id = request.params.id;

    db.dbHelper.getCartID(id, (cartDetails) => {
        db.query('DELETE FROM carts_products WHERE cart_id = $1', [cartDetails.id], (error, results) => {
            if(error){
                throw error;
            }
    
            db.query('DELETE FROM carts WHERE id = $1', [cartDetails.id], (error, finalResult) => {
                response.status(200).json(`Order ${id} succesfully deleted!`)
            })
        });
    })
}



module.exports = {
    getCustomers,
    getCustomerById,
    getCustomerOrders,
    getCustomerCart,
    addCustomerCart,
    updateCustomerCart,
    deleteCustomerCart,
    updateCustomer,
    deleteCustomer
};

