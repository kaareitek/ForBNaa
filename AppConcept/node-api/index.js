require('dotenv').config();
console.log(require('crypto').randomBytes(64).toString('hex'));
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const queryHandler = require('./dbqueries');

console.log(process.env);

const app = express()
const port = 3000

const authenticateJWT = (request, response, next) => {
    const authHeader = request.headers.authorization;

    console.log(authHeader);

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
            if (error) {
                return response.sendStatus(403);
            }

            request.user = user;
            next();
        });
    } else {
        response.sendStatus(401);
    }
}

app.use(cors());
app.use(bodyParser.json({limit: "50mb"}));
app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 50000
    })
);
app.use(express.static(path.join(__dirname, '../www')));

app.get('/', function (request, response) {
    console.log("not toggled");
    response.send("Not toggled");
});

app.get('/toggle', function (request, response) {
    console.log("toggled");
    response.send("Toggled");
})

app.post('/token', queryHandler.loginDeveloper);
app.post('/loginCustomer', queryHandler.loginCustomer);

//#region CRUD DB OPS
app.post('/customers', authenticateJWT, queryHandler.createCustomer);
app.get('/customers', authenticateJWT, queryHandler.getAllCustomers);
app.get('/customers/:id', authenticateJWT, queryHandler.getCustomerByID);
app.put('/customers/:id', authenticateJWT, queryHandler.updateCustomer);
app.delete('/customers/:id', authenticateJWT, queryHandler.deleteCustomer);

app.post('/developers', authenticateJWT, queryHandler.createDeveloper);
app.get('/developers/:id', authenticateJWT, queryHandler.getDeveloperByID);
app.put('/developers/:id', authenticateJWT, queryHandler.updateDeveloper);
app.delete('/developers/:id', authenticateJWT, queryHandler.deleteDeveloper);

app.post('/apps', queryHandler.createApp);
app.get('/apps/', authenticateJWT, queryHandler.getApps);
app.put('/apps/:id', authenticateJWT, queryHandler.updateApp);
app.delete('/apps/:id', authenticateJWT, queryHandler.deleteApp);

app.post('/transactions', authenticateJWT, queryHandler.createTransaction);
app.get('/transactions/:id', authenticateJWT, queryHandler.getTransactionsByID);

app.post('/options', authenticateJWT, queryHandler.createOptions);
app.get('/options/:id', authenticateJWT, queryHandler.getOptionsByID);
//#endregion



const server = app.listen(port, () => {
    console.log('App running on port ${port}')
})

module.exports = server;