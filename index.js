const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();


app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g42knj4.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const todoCollection = client.db('todoList').collection('todos');

        app.post('/todo', async (req, res) => {
            const todo = req.body;
            const todoQuery = {
                username: req.body.username,
                title: req.body.title,
            }
            const storedTodo = await todoCollection.findOne(todoQuery);
            if (storedTodo) {
                return res.status(403).send({ message: 'This todo already exits' })
            }
            const result = await todoCollection.insertOne(todo);
            res.send(result);
        })

        app.get('/todos', async (req, res) => {
            const email = req.query.email;
            const filter = { user: email };
            const result = await todoCollection.find(filter).toArray();
            res.send(result);
        })

        app.delete('/todo/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await todoCollection.deleteOne(query);
            res.send(result);
        })

        app.put('/todo/update/:id', async (req, res) => {
            const newTodo = req.body;
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: newTodo
            }

            const result = await todoCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })
    }

    finally {

    }
}
run().catch(console.log)






app.get('/', async (req, res) => {
    res.send("Todo list server is running")
})
app.listen(port, () => console.log(`Todo list server is running on ${port}`))

