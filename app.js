const express = require("express");
const JsonDB = require("node-json-db");
const uuidv1 = require("uuid/v1");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Getting Fake DB
const db = new JsonDB("myDB", true, true);

// Enabling cors
app.use(cors());
// Setting Body Parse
app.use(bodyParser.json());

// All ok!
app.get("/", (req, res) => res.send({ status: "up", date: new Date() }));

// Defining main route
const weightRouter = express.Router();

// Listing weight entries
weightRouter.get("/", (req, res) => {
  let data = db.getData("/weight");
  data = Object.keys(data).map(id => data[id]);
  res.send(data);
});

weightRouter.post("/", (req, res) => {
  const newWeight = req.body;
  const weightId = uuidv1();
  newWeight.id = weightId;
  db.push(`/weight/${weightId}`, newWeight);
  res.send(newWeight);
});

weightRouter.put("/:id", (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  try {
    let weightToUpdate = db.getData(`/weight/${id}`);
    weightToUpdate = Object.assign({}, weightToUpdate, payload);
    db.push(`/weight/${id}`, weightToUpdate);
    res.send(weightToUpdate);
  } catch (error) {
    res.status(404).send("Not Found");
  }
});

weightRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  try {
    db.getData(`/weight/${id}`); // Just to throw 404 in case it doesn't exist
    db.delete(`/weight/${id}`);
    res.sendStatus(204);
  } catch (error) {
    res.status(404).send("Not Found");
  }
});

app.use("/weight", weightRouter);
app.listen(3000, () => console.log(`Example app listening on port ${3000}!`));

module.exports = app;
