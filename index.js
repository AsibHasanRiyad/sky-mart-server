const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5001;

//middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2x6r8lz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const productCollection = client.db("skyMart").collection("products");
    const cartCollection = client.db("skyMart").collection("carts");

    app.get("/products", async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(filter);
      res.send(result);
    });

    //cart related api
    app.post("/cart", async (req, res) => {
      const data = req.body;
      const result = await cartCollection.insertOne(data);
      res.send(result);
    });
    app.get("/cart", async (req, res) => {
      const email = req.query.email;
      const filter = {
        buyerEmail: email,
      };
      const result = await cartCollection.find(filter).toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("skyMart server is running");
});

app.listen(port, () => {
  console.log(`Sky Mart server is running on port:${port}`);
});
