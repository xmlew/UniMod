let mongoURI = `mongodb://localhost:27017`
const express = require("express");
const mongoose = require("mongoose");
//const Router = require("./routes")
const app = express();
app.use(express.json());

mongoose.Promise = global.Promise;
//mongoose.set('useNewUrlParser', true);
//mongoose.set('useFindAndModify', false);
//mongoose.set('useCreateIndex', true)

mongoose.connect('mongodb://127.0.0.1:27017/UniMod',
  {
    useNewUrlParser: true,
    //useFindAndModify: false,
    useUnifiedTopology: true
  }).then(() => {
      console.log("MongoDB connected...")
});
