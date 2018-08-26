const mongoose = require("mongoose");
const Scheme = mongoose.Schema;

const EventSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Event = mongoose.model("users", EventSchema);
