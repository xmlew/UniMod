const express = require("express");
const mongoose = require("mongoose");

const {moduleSubs, dataDisplay, getCourseStudentData, modPopularity} = require("./controllers/modules");

//const Router = require("./routes")

const app = express();
app.use(express.json());
const PORT = 3002;

mongoose.Promise = global.Promise;
const connectToDB = async () => {
    try {
        //await mongoose.connect('mongodb://127.0.0.1:27017/UniMod',
        await mongoose.connect('mongodb+srv://dbUser:Hello12345@cluster0.upmwx.mongodb.net/UniMod',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("MongoDB connected...")
        });
    } catch (error) {
        console.error(`Error while connecting to MongoDB: `, error.message);
    }
};
connectToDB();

//checks if there is an existing user with the same username in the database. If there is, log that a user already exists.

app.get('/', function (req, res) {
    return res.send('UniMod API')
});

//application searches
app.get('/modsearch/:code', moduleSubs);
app.get('/display/:code', dataDisplay);
app.get('/courseData/:course', getCourseStudentData);
app.get('/modtakers/:code', modPopularity);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`)
})

