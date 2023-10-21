const db = require('./db_credentials');

const getProducts = (request, response) => {
    db.query('SELECT * FROM products ORDER BY id ASC', (error, results) => {
        if(error) throw error;

        response.status(200).json(results.rows);
    })
}

const getProductById = (request, response) => {
    const id = parseInt(request.params.id);

    db.query('SELECT * FROM products WHERE id = $1', [id], (error, results) => {
        if(error) throw error;

        response.status(200).json(results.rows);
    })
}

const getProductByCategoryId = (request,response) => {
    const categoryId = parseInt(request.params.id);

    db.query('SELECT * FROM products WHERE category_id = $1 ORDER BY id ASC', [categoryId], (error, results) => {
        if(error) throw error;

        response.status(200).json(results.rows);
    })
}

const addProduct = (request, response) => {
    const {name, category_id, description, price} = request.body;
    console.log(request.body);
    db.query('INSERT INTO products (name, category_id, description, price) VALUES ($1, $2, $3, $4) RETURNING *', [name, category_id, description, price], 
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

const deleteProduct = (request,response) => {
    const id = parseInt(request.params.id);

    db.query('DELETE * FROM products WHERE id = $1', [id], (error, results) => {
        if(error) throw error;

        response.status(200).json(`Product ${id} succesfully deleted!`);
    })
}

module.exports = {
    getProducts,
    getProductById,
    getProductByCategoryId,
    addProduct,
    updateProduct,
    deleteProduct
};