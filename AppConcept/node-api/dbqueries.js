const config = require('./config');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Pool = require('pg').Pool

const pool = new Pool({
    user: config.db.user,
    host: config.db.host,
    database: config.db.database,
    password: config.db.password,
    port: config.db.port,
})

const loginDeveloper = (request, response) => {
    console.log("Login Developer");

    const {username, password} = request.body;

    console.log(username, password);

    pool.query('SELECT username, id FROM developers WHERE username = $1 AND password = $2', [username, password], (error, result) => {
        if (error) {
            response.status(400).send("Invalid login");
        };

        const developer = result.rows;

        console.log(developer);

        if(developer) {
            const access_token = jwt.sign({ username: developer.username, id: developer.id }, process.env.TOKEN_SECRET);

            response.status(200).json({
                access_token, id: developer[0].id
            });
        } else {
            response.send('Incorrect login');
        }
    });
}

const loginCustomer = (request, response) => {
    const {username, password} = request.body;
    
    console.log("Login customer:" + username, password);

    pool.query('SELECT username, id FROM customers WHERE username = $1 AND password = $2', [username, password], (error, result) => {
        if (error) {
            response.status(400).send("Invalid login");
        };

        const customer = result.rows;

        if(customer) {
            const accessToken = jwt.sign({ username: customer.username, id: customer.id }, process.env.TOKEN_SECRET);

            response.status(200).json({
                accessToken, id: customer[0].id
            });
        } else {
            response.send('Incorrect login');
        }
    });
}

const createCustomer = (request, response) => {
    const {username, password, email} = request.body;

    pool.query('INSERT INTO customers (username, password, email) VALUES ($1, $2, $3)', [username, password, email], (error, result) => {
        if (error) {
            response.status(400).send("Account could not be created")
        }

        response.status(201).send("Customer created")
    })
}

const getAllCustomers = (request, response) => {
    console.log("/getAllCustomers - returning all customers");

    pool.query('SELECT * FROM customers', (error, result) => {
        if (error) {
            response.status(400).send("Error fetching customers")
        }

        console.log(result.rows);

        response.status(200).json(result.rows);
    })
}

const getCustomerByID = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM customers WHERE id = $1', [id], (error, result) => {
        if (error) {
            response.status(400).send("Error fetching customer with id" + id)
        }

        response.status(200).json(result.rows)
    })
}

const updateCustomer = (request, response) => {
    const id = parseInt(request.params.id)
    const {email, username, password} = request.body

    pool.query('UPDATE customers SET email = $1, username = $2, password = $3 WHERE id = $4', [email, username, password, id], (error, result) => {
        if (error) {
            response.status(400).send("Error updating customer with id " + id)
        }

        response.status(204).send()
    })
}

const deleteCustomer = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM customers WHERE id = $1', [id], (error, result) => {
        if (error) {
            response.status(400).send("Error deleting customer with id " + id)
        }

        response.status(204).send()
    })
}

const createDeveloper = (request, response) => {
    const {username, password, email} = request.body

    pool.query('INSERT INTO developers (username, password, email) VALUES ($1, $2, $3)', [username, password, email], (error, result) => {
        if (error) {
            response.status(400).send("Error creating developer")
        }

        response.status(201).send("Developer created")
    })
}

const getDeveloperByID = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM customers WHERE id = $1', [id], (error, result) => {
        if (error) {    
            response.status(400).send("Error getting developer with id " + id)
        }

        response.status(200).json(result.rows)
    })
}

const updateDeveloper = (request, response) => {
    const id = parseInt(request.params.id)
    const {email, username, password} = request.body

    pool.query('UPDATE developers SET email = $1, username = $2, password = $3 WHERE id = $4', [email, username, password, id], (error, result) => {
        if (error) {
            response.status(400).send("Error updating developer with id " + id)
        }

        response.status(204).send()
    })
}

const deleteDeveloper = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM developers WHERE id = $1', [id], (error, result) => {
        if (error) { 
            response.status(400).send("Error deleting developer with id " + id)
        }

        response.status(204).send()
    })
}

const createApp = (request, response) => {
    console.log("creating app");

    const {developerid, appname, appurl, logo} = request.body

    // console.log(logo);

    pool.query('INSERT INTO apps (developerid, appname, appurl, logo) VALUES ($1, $2, $3, $4)', [developerid, appname, appurl, logo], (error, result) => {
        if (error) {
            response.status(400).send("Error creating app")
        }

        response.status(201).send('App created')
    })
}

// const getAppsByID = (request, response) => {
//     const id = parseInt(request.params.id)

//     console.log("GET /apps/id");

//     pool.query('SELECT * FROM apps WHERE developerid = $1', [id], (error, result) => {
//         if (error) {
//             throw error
//         }

//         console.log(result.rows);

//         response.status(200).json(result.rows)
//     })
// }

const getApps = (request, response) => {
    if(request.query.developerid){
        const id = parseInt(request.query.developerid)

        pool.query('SELECT * FROM apps WHERE developerid = $1', [id], (error, result) => {
            if (error) {
                response.status(400).send("Developerid not found")
            }
    
            console.log("Getting apps for devid " + id);

            response.status(200).json(result.rows)
        })
    } else {
        pool.query('SELECT * FROM apps', (error, result) => {
            if (error) {
                response.status(400).send("Error getting apps")
            }
    
            console.log("Getting all apps");
    
            response.status(200).json(result.rows)
        })
    }
}

const updateApp = (request, response) => {
    const id = parseInt(request.params.id)
    const {logopath, price, appname} = request.body

    pool.query('UPDATE apps SET logopath = $1, price = $2, appname = $3 WHERE id = $4', [logopath, price, appname, id], (error, result) => {
        if (error) {
            response.status(400).send("App could not be updated")
        }

        response.status(204).send()
    })
}

const deleteApp = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM apps WHERE id = $1', [id], (error, result) => {
        if (error) {
            response.status(400).send("App could not be deleted")
        }

        response.status(204).send()
    })
}

const createTransaction = (request, response) => {
    const {appid, appname, customerid, timeofpurchase} = request.body
    console.log(request.body);

    pool.query('INSERT INTO transactions (appid, appname, customerid, timeofpurchase) VALUES ($1, $2, $3, $4)', [appid, appname, customerid, timeofpurchase], (error, result) => {
        if (error) {
            response.status(400).send("Error creating transaction")
        }

        response.status(201).send('Transaction created')
    })
}

const getTransactionsByID = (request, response) => {
    console.log(request.params.id);

    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM transactions WHERE customerid = $1', [id], (error, result) => {
        if (error) {
            response.status(400).send("Error fetching transactions")
        }
        console.log(result.rows);

        response.status(200).json(result.rows)
    })
}

const createOptions = (request, response) => {
    const {appid, options} = request.body
    console.log(request.body);

    pool.query('INSERT INTO appoptions (appid, options) VALUES ($1, $2)', [appid, options], (error, result) => {
        if (error) {
            response.status(400).send("Error creating options")
        }

        response.status(201).send('Options created')
    })
}

const getOptionsByID = (request, response) => {
    console.log(request.params.id);

    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM appoptions WHERE appid = $1', [id], (error, result) => {
        if (error) {
            response.status(400).send("Error fetching options")
        }
        console.log(result.rows);

        response.status(200).json(result.rows)
    })
}

module.exports = {
    loginDeveloper,
    loginCustomer,
    createCustomer, 
    getAllCustomers, 
    getCustomerByID,
    updateCustomer,
    deleteCustomer,
    createDeveloper,
    getDeveloperByID,
    updateDeveloper,
    deleteDeveloper,
    createApp,
    getApps,
    updateApp,
    deleteApp,
    createTransaction,
    getTransactionsByID,
    createOptions,
    getOptionsByID
    }
