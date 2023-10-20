const db = require('./db_credentials');

const getOrders = (request, response) => {
    db.query('SELECT * FROM customers ORDER BY id ASC', (error, results) => {
        if(error){
            throw error;
        }

        response.status(200).json(results.rows)
    }); 

}