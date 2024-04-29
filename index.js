const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

const mongoUri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.ympa4ek.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// init mongo client instance 
const client = new MongoClient(mongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true    
  }
})

// middlewares
app.use( cors() )
app.use( express.json() )

async function run() {
  try {
    // connect to server 
    await client.connect()

    // ref to db and collection
    const database = client.db('pha10')
    const spotsCollection = database.collection('spots')

    // ## routes
    app.get('/', async (req, res) => {
      const cursor = spotsCollection.find()
      const data = await cursor.toArray()
      res.send(data)
    })

    // Send a ping to confirm a successful connection
    await database.command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!")
  } 
  catch (error) {
    console.log(error);
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server listening to http://localhost:${port}`);
})