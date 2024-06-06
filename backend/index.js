const express = require('express')
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
// middleware
app.use(cors())
app.use(express.json())
// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASSWORD)

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@yoga-master.bosbsyv.mongodb.net/?retryWrites=true&w=majority&appName=yoga-master`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // create a database and the collections
        const database = client.db("yoga-master")
        const userCollection = database.collection("users")
        const classesCollection = database.collection("classes")
        const cartCollection = database.collection("cart")
        const paymentCollection = database.collection("payment")
        const enrolledCollection = database.collection("enrolled")
        const appliedCollection = database.collection("applied")

        // classes routes here
        app.post("/new-class", async (req, res) => {
            const newClass = req.body;
            const result = await classesCollection.insertOne(newClass)
            res.send(result)
        })

        app.get("/classes",async(req,res)=>{
            const query={status:"approved"};
            const result=await classesCollection.find().toArray();
            res.send(result);
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("hello developers")
})
app.listen(port, () => {
    console.log(`app is running on port number ${port} `)
})

// 6IbdHREBLk0bPg98