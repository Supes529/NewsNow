const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://127.0.0.1/login");

// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch((err) => {
    console.log("Database cannot be Connected");
    console.log(err);
})

// Create Schema
// Create Schema
const Loginschema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    likedposts: [
      {
        type: mongoose.Schema.Types.Mixed,
        default: []
      }
    ],
    dislikedposts: [
      {
        type: mongoose.Schema.Types.Mixed,
        default: []
      }
    ],
    categoryCounts: {
        science: {
          type: Number,
          default: 0
        },
        sports: {
          type: Number,
          default: 0
        },
        business: {
          type: Number,
          default: 0
        },
        entertainment: {
          type: Number,
          default: 0
        },
        technology: {
          type: Number,
          default: 0
        }
      }
  });


// collection part
const collection = new mongoose.model("project", Loginschema);

module.exports = collection;