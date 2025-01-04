const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");

const cors = require("cors");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dopmx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("BloodDonateDb");
    const bloodDonorCollection = database.collection("DonnerDb");
    const userDataCollection = database.collection("UserData");

    // Input Blood Donors Data in Database
    app.post("/donors", async (req, res) => {
      const donorsData = req.body;
      const result = await bloodDonorCollection.insertOne(donorsData);
      res.send(result);
    });

    // Input User Data When Create Account
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userDataCollection.insertOne(user);
      res.send(result);
    });

    //Update Users Last Login Time
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateLastLogInTime = {
        $set: {
          lastLogInTime: user.lastLogInTime,
        },
      };
      const result = await userDataCollection.updateOne(
        filter,
        updateLastLogInTime
      );
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server number port is ${port}`);
});
