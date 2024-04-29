const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
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
    const countriesCollection = database.collection('countries')

    // ## routes
    app.get('/', (req, res) => {
      res.send('Welcome!')
    })
    // homepage tourist spots (max 6)
    app.get('/home-spots', async (req, res) => {
      const query = { userEmail: 'home@mail.com' }
      const cursor = spotsCollection.find(query)
      const data = await cursor.toArray()
      res.send(data)
    })
    // get all tourists spot
    app.get('/all-tourists-spot', async (req, res) => {
      const cursor = spotsCollection.find()
      const data = await cursor.toArray()
      res.send(data)
    })
    // get countries
    app.get('/countries', async (req, res) => {
      const cursor = countriesCollection.find()
      const data = await cursor.toArray()
      res.send(data)
    })
    // get country-spots
    app.get('/country-spots/:countryName', async (req, res) => {
      const countryName = req.params.countryName.toLowerCase() 
      const query = { countryName:countryName }
      const cursor = spotsCollection.find(query)
      const data = await cursor.toArray()
      res.send(data)
    })
    // get spot-details
    app.get('/spot-details/:id', async (req, res) => {
      const id = req.params.id 
      const query = { _id: new ObjectId(id) }
      const data = await spotsCollection.findOne(query)
      res.send(data)
    })
    // get my spots list 
    app.get('/my-spots/:email', async (req, res) => {
      const query = { userEmail: req.params.email }
      const cursor = spotsCollection.find(query)
      const data = await cursor.toArray()
      res.send(data)
    })

    // add new spot
    app.post('/add-spot', async (req, res) => {
      const newSpot = req.body
      const spot = await spotsCollection.insertOne(newSpot)
      res.send(spot)
    })

    // delete my spot
    app.delete('/my-spot/:id', async (req, res) => {
      const id = req.params.id 
      const query = { _id: new ObjectId(id) }
      const result = spotsCollection.deleteOne(query)
      res.send(result)
    })
    
    // update spot
    app.put('/update-spot/:id', async (req, res) => {
      const id = req.params.id 
      const newSpot = req.body

      const filter = { _id: new ObjectId(id) }
      const updateDoc = { $set: newSpot }

      const result = await spotsCollection.updateOne(filter, updateDoc)
      res.send(result)
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