const db = require('./db_credentials');

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



module.exports = {
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
};

