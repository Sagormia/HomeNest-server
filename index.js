const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 3000
const uri = "mongodb+srv://ksagorkhan081_db_user:oLOTGl3kBSmSAMFl@cluster0.keyvejn.mongodb.net/?appName=Cluster0"

app.use(cors())
app.use(express.json())


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
            const properties = await propertiesCol.find().toArray();
            res.send(properties);
        });

        app.post('/properties', async(req, res) => {
            const data = req.body;
            const result = await propertiesCol.insertOne(data);
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

// ksagorkhan081_db_user
// oLOTGl3kBSmSAMFl