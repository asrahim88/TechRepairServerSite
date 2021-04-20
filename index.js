const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
// const { ObjectID } = require('bson');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectID;

const port = process.env.PORT || 8000

app.use(cors());
app.use(bodyParser.json());

// initial api start
app.get('/', (req, res) => {
    res.send('Hello World!')
})
// // initial api end


// mongodb


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6cglq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log('after changing', uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    // addmin collection
    const adminCollection = client.db("techService").collection("service");
    console.log(" database connection successfully");
    // admin collection


    // admin add service post start
    app.post("/addService", (req, res) => {
        const newAddService = req.body;
        console.log('adding new service', newAddService);
        adminCollection.insertOne(newAddService)
            .then(result => {
                console.log('inserted count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })
    // admin add service post end


    // get admin add service from Database start
    app.get("/getService", (req, res) => {
        adminCollection.find()
            .toArray((error, documents) => {
                res.send(documents);
            })
    })
    // get admin add service from Database end


    // get Single service from database start
    app.get("/singleGetService/:id", (req, res) => {
        adminCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((error, documents) => {
                res.send(documents);
            })
    })
    // get Single service from database end




    // review post start
    const reviewCollection = client.db("techService").collection("review");
    app.post("/addReview", (req, res) => {
        const newAddReview = req.body;
        reviewCollection.insertOne(newAddReview)
            .then((result) => {
                res.send(result.insertedCount > 0);
            })
        console.log('adding new service', newAddReview);
    })
    // Review post end 


    // get review from Database start
    app.get("/getReview", (req, res) => {
        reviewCollection.find()
            .toArray((error, documents) => {
                res.send(documents);
            })
    })
    // get review from database end

    // post payment with order start
    const addOrderCollection = client.db("techService").collection("order");
    app.post("/addOrder", (req, res) => {
        const newAddOrder = req.body;
        console.log('adding new order', newAddOrder);
        addOrderCollection.insertOne(newAddOrder)
            .then(result => {
                console.log('inserted count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })
    // post payment with order end
});

// mongodb




app.listen(port, () => {
    console.log(`${port}`)
})