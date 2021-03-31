const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vdmb9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

client.connect((err) => {
    const booksCollection = client.db(`${process.env.DB_NAME}`).collection("books");
    const ordersCollection = client.db(`${process.env.DB_NAME}`).collection("orders");

    app.get("/books", (req, res) => {
        booksCollection.find().toArray((err, items) => {
            res.send(items);
        });
    });

    app.get("/books/:id", (req, res) => {
        const id = ObjectID(req.params.id);
        booksCollection.find({ _id: id }).toArray((err, items) => {
            res.send(items);
        });
    });

    app.get("/orders/:email", (req, res) => {
        const email = req.params.email;
        ordersCollection.find({ email: email }).toArray((err, items) => {
            res.send(items);
        });
    });

    app.post("/addBook", (req, res) => {
        const newBook = req.body;
        console.log("adding new book: ", newBook);
        booksCollection.insertOne(newBook).then((result) => {
            console.log("inserted count", result.insertedCount);
            res.send(result.insertedCount > 0);
        });
    });

    app.post("/postOrder", (req, res) => {
        const newBook = req.body;
        console.log("adding new book: ", newBook);
        ordersCollection.insertOne(newBook).then((result) => {
            console.log("inserted count", result.insertedCount);
            res.send(result.insertedCount > 0);
        });
    });

    app.delete("/deleteBook/:id", (req, res) => {
        console.log("On dekete");
        const id = ObjectID(req.params.id);
        console.log("delete this", id);
        booksCollection
            .findOneAndDelete({ _id: id })
            .then((documents) => res.send(!!documents.value));
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
