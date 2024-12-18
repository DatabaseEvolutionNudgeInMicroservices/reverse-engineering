// Constants

const express = require('express');
const bodyParser = require('body-parser');
const redis = require("redis");
const app = express();
const applicationPort = 3000;
const {MongoClient, ObjectId} = require("mongodb");

// Settings

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Database : Redis

let redisClient = redis.createClient({
    url: 'redis://' + process.env.REDIS_DATABASE_HOST + ':' + process.env.REDIS_DATABASE_PORT
});

redisClient.on('ready', () => console.log('Redis ready: ok'));
redisClient.on('error', (err) => console.log('Redis error: ' + err));
redisClient.connect();

// Database : Mongo
let mongoClient = new MongoClient('mongodb://' + process.env.MONGO_DATABASE_HOST + ':' + process.env.MONGO_DATABASE_PORT);

// Routes

app.get('/count', async function (request, response) {
    redisClient.get('order_count').then((order_count) => {
        if (!order_count) {
            return response.status(404).json({error: 'Order count not found'});
        }
        response.status(200).json(order_count);
    }).catch(e => {
        response.status(500).json(e.message);
    });
});

app.get('/', async function (request, response) {
    try {
        await mongoClient.connect();
        const db = mongoClient.db('order');
        const collection = db.collection('orders');
        const document = await collection.find({}).toArray();

        if (!document) {
            return response.status(404).json({error: 'Orders not found'});
        }
        response.status(200).json(document);
    } catch (e) {
        response.status(500).json(e.message);
    } finally {
        await mongoClient.close();
    }
});

app.get('/:order_id', async function (request, response) {
    try {
        const orderId = request.params.order_id;
        if (!ObjectId.isValid(orderId)) {
            return response.status(400).json({error: 'OrderID not valid'});
        }

        await mongoClient.connect();
        const db = mongoClient.db('order');
        const collection = db.collection('orders');
        const document = await collection.findOne({_id: new ObjectId(orderId)});

        if (!document) {
            return response.status(404).json({error: 'Order not found'});
        }
        response.status(200).json(document);
    } catch (e) {
        response.status(500).json(e.message);
    } finally {
        await mongoClient.close();
    }
});

app.post('/', async function (request, response) {
    let order = request.body;

    // TODO: Check before post if stock exist and is sufficient.
    try {

        // Redis order counter
        let order_count = await redisClient.get('order_count');
        if (order_count === null) {
            await redisClient.set('order_count', 1);
        } else {
            await redisClient.set('order_count', (Number.parseInt(order_count) + 1));
        }

        // Mongo order collection
        await mongoClient.connect();
        const db = mongoClient.db('order');
        const collection = db.collection('orders');
        const document = await collection.insertOne(order);

        if (!document) {
            return response.status(404).json({error: 'Order not found'});
        }
        response.status(200).json(document);
    } catch (e) {
        response.status(500).json(e.message);
    } finally {
        await mongoClient.close();
    }
});

// Entry point

app.listen(applicationPort);