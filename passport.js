const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt");
const helper = require('./user_queries');
const db = require('./db_credentials');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},(email, password, done) => {
    console.log("TEST");
    db.query('SELECT * FROM customers WHERE email = $1', [email], async (error, results) => {

        if(error) return done(error);

        const user = results.rows[0];
        console.log("USER:" + user);

        if(!user) return done(null, false);

        const matchedPassword = await bcrypt.compare(password, user.hashed_pass);

        if(!matchedPassword) return done(null, false);

        return done(null, user);
    })
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM customers WHERE id = $1', [id], async (error, results) => {
        const user = results.rows[0];

        if(error) return done(error);

        return done(null, user);
    })

})

module.exports = passport;