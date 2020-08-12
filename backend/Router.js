const bcrypt = require('bcryptjs');

class Router {

    constructor(app, db) {
        this.login(app, db);
        this.signup(app, db);
        this.logout(app, db);
        this.isLoggedIn(app, db);
        this.userExists(app, db);
    }

    login(app, db) {

        app.post('/login', (req, res) => {
            let username = req.body.username;
            let password = req.body.password;

            username = username.toLowerCase();

            if (username.length > 12 || password.length > 12) {
                res.json({
                    success: false,
                    msg: 'An error occured, please try again'
                })
                return;
            }

            let cols = [username];
            db.query('SELECT * FROM user WHERE username = ? LIMIT 1', cols, (err, data, fields) => {

                // db query failed
                if (err) {
                    res.json({
                        success: false,
                        msg: 'An error occured, please try again'
                    })
                    return false;
                }
                
                // found 1 user with this username
                if (data && data.length === 1) {
                    bcrypt.compare(password, data[0].password, (bcryptErr, verified) => {
                        if (verified) {
                            req.session.userID = data[0].id;
                            res.json({
                                success: true,
                                username: data[0].username
                            })
                            return true;
                        }

                        // password wrong
                        else {
                            res.json({
                                success: false,
                                msg: 'invalid password'
                            })
                        }
                    });
                }
                // user does not exist
                else {
                    res.json({
                        success: false,
                        msg: 'User not found, please try again'
                    })
                }

            })

        })

    }

    userExists (app, db) {
        app.post('/userexists', (req, res) => {
            let username = req.body.username;

            username = username.toLowerCase();

            if (username.length > 12) {
                res.json({
                    success: false,
                    msg: 'An error occured, please try again'
                })
                return;
            }

            let queryStatement = `SELECT * FROM user WHERE username = '${username}'`
            db.query(queryStatement, (err, result) => {
                if (err) throw err;
                if (result && result.length === 1) {
                    res.json({
                        success: true
                    })
                }
                else
                {
                    res.json({
                        success: false
                    })  
                }
            })
        })

        // app.post('/userexists', (req, res) => {
        //     let username = req.body.username;

        //     username = username.toLowerCase();

        //     let thisquery = `SELECT * FROM user WHERE username = '${username}'`
        //     db.query(`SELECT * FROM user WHERE username = ` (err, result) => {


        //     })

        // })

    }

    signup(app, db) {


        app.post('/signup', (req, res) => {
            let username = req.body.username;
            let password = req.body.password;

            username = username.toLowerCase();

            if (username.length > 12 || password.length > 12) {
                res.json({
                    success: false,
                    msg: 'An error occured, please try again'
                })
                return;
            }

            let insertStatement = `INSERT INTO user VALUES (null, '${username}', '${bcrypt.hashSync(password, 9)}')`;
            db.query(insertStatement, (err, result) => {
                if (err)
                {
                    res.json({
                        success: false,
                        msg: `There was a problem signing ${username} up`
                    })
                }
                console.log(`${username} has signed up!`);
                res.json({
                    success: true,
                    msg: `${username} successfully signed up!`
                })
            })

        })

    }

    logout(app, db) {

        app.post('/logout', (req, res) => {
            if (req.session.userID) {
                req.session.destroy();
                res.json({
                    success: true
                })

                return true;
            }
            else {
                res.json({
                    success: false
                })
                return false;
            }
        })

    }

    isLoggedIn(app, db) {

        app.post('/isLoggedIn', (req, res) => {

            if (req.session.userID) {
                let cols = [req.session.userID];
                db.query('SELECT * FROM user WHERE id = ? LIMIT 1', cols, (err, data, fields) => {

                    if (data && data.length === 1) {
                        res.json({
                            success: true,
                            username: data[0].username
                        })
                        return true;
                    }

                    else {
                        res.json({
                            success: false
                        })
                    }

                })
            }

            else {
                res.json({
                    success: false
                })
            }

        });

    }

}

module.exports = Router;