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
            const { email } = req.query;
            const {home} = req.query;
            let query = {};
            if (email) {
                query = { uemail: email };
            }

            if (home) {
                const properties = await propertiesCol.find().sort({ _id: -1 }).limit(6).toArray();
                res.send(properties);
            }

            const properties = await propertiesCol.find(query).sort({ _id: -1 }).toArray();
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
        });

        app.put('/properties/:id', async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;

            try {
                const result = await propertiesCol.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedData }
                );
                if (result.matchedCount === 0) {
                    return res.status(404).send({ success: false, message: "Property not found" });
                }
                res.send({ success: true, message: "Property updated successfully" });
            } catch {
                res.status(400).send({ success: false, message: "Invalid property ID" });
            }
        });

        app.delete('/properties/:id', async (req, res) => {
            const id = req.params.id;
            try {
                const result = await propertiesCol.deleteOne({ _id: new ObjectId(id) });
                if (result.deletedCount > 0) {
                    res.status(200).send({ success: true, message: "Property deleted successfully" });
                } else {
                    res.status(404).send({ success: false, message: "Property not found" });
                }
            } catch (error) {
                res.status(500).send({ success: false, message: error.message });
            }
        });

    } finally { }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('HomeNest Server Running')
})

app.listen(port, () => {
    console.log(`HomeNest server listening on port ${port}`)
})