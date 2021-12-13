let server = require('../../index')
let chai = require('chai')
let chaiHttp = require('chai-http')

chai.should();
chai.use(chaiHttp);
let url = "http://localhost:3000";
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjE4OTk4NjB9.WfYe69xOZ6PXp8JAsyqPIoom-YUU0wnBZJmc-2fkA0w";

describe('CRUD operations: customer', () => {
    describe('Test POST /customers', () => {
        it('Should create a customer in the DB', (done) => {
            chai.request(url)
                .post('/customers')
                .set("Authorization", "Bearer " + token)
                .send({username: 'for test', email: 'test@email.com', password: 'testest'})
                .end((err, response) => {
                    response.should.have.status(201);
                    response.text.should.be.eql('Customer created');
                done();
                });
         });
    });

    describe('Test GET /customer', () => {
        it('Should return all customers', (done) => {
            chai.request(server)
                .get('/customers')
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    response.body.length.should.not.be.eq(0);
                    console.log(response.body)
                done();
                });
         });
    });

    describe('Test GET /customer/:customerid', () => {
        it('Should return a customer by ID', (done) => {
            chai.request(server)
                .get('/customers/1')
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    console.log(response.body)
                done();
                });
         });
    });

    describe('Test PUT /customer/:customerid', () => {
        it('Should update customer info', (done) => {
            chai.request(server)
                .put('/customers/1')
                .set("Authorization", "Bearer " + token)
                .send({email: 'new@email.com', username: 'newusername', password: 'newpassword'})
                .end((err, response) => {
                    response.should.have.status(204);
                done();
                });
         });
    });

    describe('Test DELETE /customer/:customerid', () => {
        it('Should delete a customer in the DB', (done) => {
            chai.request(server)
                .delete('/customers/1')
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(204);
                done();
                });
         });

         it('Should now NOT return a customer by that ID', (done) => {
            chai.request(server)
                .get('/customers/1')
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.body.should.be.eql([])
                done();
                });
         });
    });

    describe('Test POST /developer', () => {
        it('Should create a developer in the DB', (done) => {
            chai.request(server)
                .post('/developers')
                .set("Authorization", "Bearer " + token)
                .send({username: 'fordevtest', email: 'devtest@email.com', password: 'devtestest'})
                .end((err, response) => {
                    response.should.have.status(201);
                    response.text.should.be.eql('Developer created');
                done();
                });
         });
    });

    describe('Test GET /developer/:developerid', () => {
        it('Should return a developer by ID', (done) => {
            chai.request(server)
                .get('/developers/3')
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    console.log(response.body)
                done();
                });
         });
    });

    describe('Test PUT /developer/:developerid', () => {
        it('Should update developer info', (done) => {
            chai.request(server)
                .put('/developers/1')
                .set("Authorization", "Bearer " + token)
                .send({email: 'new@email.com', username: 'newusername', password: 'newpassword'})
                .end((err, response) => {
                    response.should.have.status(204);
                done();
                });
         });
    });

    describe('Test DELETE /developer/:developerid', () => {
        it('Should delete a developer in the DB', (done) => {
            chai.request(server)
                .delete('/developers/1')
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(204);
                done();
                });
         });

         it('Should now NOT return a developer by that ID', (done) => {
            chai.request(server)
                .get('/developers/1')
                .end((err, response) => {
                    response.body.should.be.eql([])
                done();
                });
         });
    });

    describe('Test POST /app', () => {
        it('Should create an app in the DB', (done) => {
            chai.request(server)
                .post('/apps')
                .set("Authorization", "Bearer " + token)
                .send({appname: 'testapp', developerid: 2})
                .end((err, response) => {
                    response.should.have.status(201);
                    response.text.should.be.eql('App created');
                done();
                });
         });
    });

    describe('Test GET /app/:appid', () => {
        it('Should return all apps by appid', (done) => {
            chai.request(server)
                .get('/apps/3')
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    console.log(response.body)
                done();
                });
         });
    });

    describe('Test GET /app', () => {
        it('Should return all apps', (done) => {
            chai.request(server)
                .get('/apps')
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    response.body.length.should.not.be.eq(0);
                    console.log(response.body)
                done();
                });
         });
    });

    describe('Test PUT /app/:appid', () => {
        it('Should update developer info', (done) => {
            chai.request(server)
                .put('/apps/1')
                .set("Authorization", "Bearer " + token)
                .send({logopath: "/this/is/a/path", price: 100, appname: "testname2"})
                .end((err, response) => {
                    response.should.have.status(204);
                done();
                });
         });
    });

    describe('Test DELETE /app/:appid', () => {
        it('Should delete an app in the DB', (done) => {
            chai.request(server)
                .delete('/apps/1')
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(204);
                done();
                });
         });

         it('Should now NOT return an app by that ID', (done) => {
            chai.request(server)
                .get('/apps/1')
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.body.should.be.eql([])
                done();
                });
         });
    });

    describe('Test POST /transaction', () => {
        it('Should create a transaction in the DB', (done) => {
            chai.request(server)
                .post('/transactions')
                .set("Authorization", "Bearer " + token)
                .send({appid: 3, customerid: 3, timeofpurchase: '2021-01-01 01:01:01'})
                .end((err, response) => {
                    response.should.have.status(201);
                    response.text.should.be.eql('Transaction created');
                done();
                });
        });
    });

    describe('Test GET /transaction/:customerid', () => {
        it('Should return all transactions by customerid', (done) => {
            chai.request(server)
                .get('/transactions/3')
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    console.log(response.body)
                done();
                });
         });
    });

    describe('Test POST /options', () => {
        it('Should create an option in the DB', (done) => {
            chai.request(server)
                .post('/options')
                .set("Authorization", "Bearer " + token)
                .send({appid: 3, options: "test"})
                .end((err, response) => {
                    response.should.have.status(201);
                    response.text.should.be.eql('Options created');
                done();
                });
        });
    });

    describe('Test GET /options/:appid', () => {
        it('Should return all options by appid', (done) => {
            chai.request(server)
                .get('/options/3')
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    console.log(response.body)
                done();
                });
         });
    });
});