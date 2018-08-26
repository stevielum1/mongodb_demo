const express = require("express");
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
const bodyParser = require("body-parser");
const passport = require('passport');

const users = require("./routes/api/users");
const events = require("./routes/api/events");

mongoose
  .connect(db, {useNewUrlParser: true})
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch(err => console.log(err));

const app = express();

// Middleware for body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.get("/", (req, res) => {
//   res.send("Hello world");
// });

app.use(passport.initialize());
require('./config/passport')(passport);

app.use("/api/users", users);
app.use("/api/events", events);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
