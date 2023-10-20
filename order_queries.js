const db = require('./db_credentials');

const getOrders = (request, response) => {
    db.query('SELECT * FROM orders ORDER BY id ASC', (error, results) => {
        if(error){
            throw error;
        }

        response.status(200).json(results.rows)
    }); 

}

const getOrderById = (request, response) => {
    const id = parseInt(request.params.id);
    db.query(`SELECT * FROM orders WHERE id = $1`, [id], (error, results) => {
        if(error){
            throw error;
        }
        response.status(200).json(results.rows);
    })
}

const getOrderDetails = (request, response) => {
    const id = parseInt(request.params.id);
    db.query(`SELECT product_id,products.name,products.price,quantity
    FROM orders
    JOIN orders_products
    ON orders.id = orders_products.order_id
    JOIN products
    ON products.id = orders_products.product_id
    WHERE orders.id = $1
    ORDER BY orders.id ASC;
    `, [id], (error, results) => {
        if(error){
            throw error;
        }

        let order = {};

        db.query(`SELECT * FROM orders WHERE id = $1`, [id], (error, orderResults) => {
            if(error){
                throw error;
            }
            order = orderResults.rows;

            response.status(200).json(
                {
                    order_id: order[0].id,
                    total_cost: order[0].total_amount,
                    status: order[0].status,
                    order_date: order[0].date,
                    order_items: results.rows 
                }
            );
        })


    }); 
}

const addOrder = (request, response) => {
    console.log(request.body);
    const {total_amount, customer_id, products} = request.body;

    db.query(`INSERT INTO orders (status, total_amount, customer_id, order_date) VALUES ('Pending', $1, $2, NOW()) RETURNING *`, 
    [total_amount, customer_id], 
    (error, results) => {
        if(error){
            throw error;
        }


        products.forEach((product) => {
            db.query(`INSERT INTO orders_products (order_id, product_id, quantity) VALUES ($1, $2, $3)`, 
            [results.rows[0].id, product.product_id, product.quantity], (error, results) => {
                if(error){
                    throw error;
                }
            })
        })

        response.status(200).json(results.rows);
    })
}

const updateOrder = (request, response) => {
    const id = parseInt(request.params.id);
    const {status} = request.body;

    db.query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', [status, id], (error, results) => {
        if(error){
            throw error;
        }

        response.status(200).json(results.rows);
    })
}

const deleteOrder = (request, response) => {
    const id = parseInt(request.params.id);

    db.query('DELETE FROM orders_products WHERE order_id = $1', [id], (error, results) => {
        if(error){
            throw error;
        }

        db.query('DELETE FROM orders WHERE id = $1', [id], (error, finalResult) => {
            response.status(200).json(`Order ${id} succesfully deleted!`)
        })
    });
}

module.exports = {
    getOrders,
    getOrderById,
    getOrderDetails,
    addOrder,
    updateOrder,
    deleteOrder
};