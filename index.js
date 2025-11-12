const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000
const uri = "mongodb+srv://ksagorkhan081_db_user:oLOTGl3kBSmSAMFl@cluster0.keyvejn.mongodb.net/?appName=Cluster0"

app.use(cors())
app.use(express.json())


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const propertiesCol = client.db('HomeNest').collection('properties');
        app.get('/properties', async (req, res) => {
            const properties = await propertiesCol.find().sort({ _id: -1 }).toArray();
            res.send(properties);
        });

        app.post('/properties', async(req, res) => {
            const data = req.body;
            const result = await propertiesCol.insertOne(data);
            res.send(result);
        });

        app.get('/properties/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id : new ObjectId(id) };
            const result = await propertiesCol.findOne(query);
            res.send(result);
        })

    } finally { }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})