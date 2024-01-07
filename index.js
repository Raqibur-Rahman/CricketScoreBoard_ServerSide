const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();



//middleware

app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS);

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5c88qdk.mongodb.net/?retryWrites=true&w=majority`;




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
    // Send a ping to confirm a successful connection


    const scoreboardCollection = client.db('ScoreBoard').collection('ScoreBoard1');

    app.get('/scoreboard', async (req, res) => {
      const cursor = scoreboardCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    const upcomingCollection = client.db('ScoreBoard').collection('upcomings');
    app.get('/upcomings', async (req, res) => {
      const cursor = upcomingCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    const teamCollection = client.db('ScoreBoard').collection('teamdata');
    app.get('/teamdata', async (req, res) => {
      const cursor = teamCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    const rankingCollection = client.db('ScoreBoard').collection('ranking');
    app.get('/ranking', async (req, res) => {
      const cursor = rankingCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })





    app.get('/scoreboard/:matchId', async (req, res) => {
      const matchId = parseInt(req.params.matchId);

      try {
        const result = await scoreboardCollection.findOne({ "matchId": matchId });

        if (!result) {
          res.status(404).send("Match not found");
          return;
        }

        res.send(result);
      } catch (error) {
        console.error('Error fetching match data:', error);
        res.status(500).send("Internal Server Error");
      }
    });




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req, res) => {
  res.send('Running');
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})