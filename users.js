const express = require('express');
const passport = require("passport");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require('./db_credentials');



router.post('/register', async(request, response) => {
    const {email, password} = request.body;

    try{
        db.query('SELECT * FROM customers WHERE email = $1', [email], async (error, results) => {
            const user = results.rows[0];

            if(user){
                console.log("user already exits");
                return response.status(400).json("User already Exisits");
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            db.query(`INSERT INTO customers (first_name, last_name, email, hashed_pass, created_at) VALUES ('Tom', 'Smith', $1, $2, NOW()) RETURNING *`,
            [email, hashedPassword], (error, finalResults) => {
                if(error) throw error;
                response.status(200).json(finalResults.rows)
            })
        })

    }catch(error){
        response.status(500).json({message: error.message})
    }
});

router.post("/login", 
passport.authenticate("local"), 
(request, response) => {
    response.json({ message: 'Login successful' });
});

// Log out user:
router.get("/logout", (request, response) => {
    request.logout(function(err) {
        if (err) { return next(err); }
        //response.redirect('/');
        response.json("Logout Successfull");
      });

});

router.get('/success', (response, request) => {
    if(request.isAuthenticated()){
        response.json("User Authenticated");
    }
})


module.exports = router;