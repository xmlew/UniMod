let mongoURI = `mongodb://localhost:27017`
const express = require("express");
const mongoose = require("mongoose");
const { count } = require("./models/modules");
const modules = require("./models/modules");
const users = require("./models/users");
let router = express.Router();
//const Router = require("./routes")

const app = express();
app.use(express.json());

const PORT = 3002;

mongoose.Promise = global.Promise;
//mongoose.set('useNewUrlParser', true);
//mongoose.set('useFindAndModify', false);
//mongoose.set('useCreateIndex', true)

const connectToDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/UniMod',
        {
            useNewUrlParser: true,
            //useFindAndModify: false,
            useUnifiedTopology: true
        }).then(() => {
            console.log("MongoDB connected...")
        });
    } catch (error) {
        console.error(`Error while connecting to MongoDB: `, error.message);
    }
};

connectToDB();

//find a piece of data then log the result. Currently testing with one module.
const findModByCode = (moduleCode) => {
    modules.find({'Module Code': moduleCode}).then(result => {
        console.log(result[0])
        if (result.count == 0) {
            return "Not found"
        } else if (result[0]['UG'] == "x") {
            return "Not applicable for undergraduates"
        } else if (result[0]['UG'] == "-") {
            return "Is oversubscribed"
        } else if (int(result[0]['UG']) < 10) {
            return "Is popular"
        } else if (int(result[0]['UG']) < 25) {
            return "Has vacancies"
        } else {
            return "Has more than enough vacancies"
        }
    });
}

//checks if there is an existing user with the same username in the database. If there is, log that a user already exists.
const registerUser = (name, pass) => {
    let newUser = {
        username: name,
        password: pass
    };
    if (users.find({username: name}).count() != 0) {
        console.log("User already exists");
        return
    } else {
        users.insertMany(newUser);
        console.log("new user added")
    };
};

app.get('/', function (req, res, next) {
    res.send('UniMod API')
});

app.get('/modsearch/:code', (req, res) => {
    modules.find({'Module Code': "HSA1000"}).then(result => {
        console.log(result)
            if (result.count == 0) {
                res.send("Not found")
            } else if (result[0]['UG'] == "x") {
                res.send("Not applicable for undergraduates")
            } else if (result[0]['UG'] == "-") {
                res.send("Is oversubscribed")
            } else if (int(result[0]['UG']) < 10) {
                res.send("Is popular")
            } else if (int(result[0]['UG']) < 25) {
                res.send("Has vacancies")
            } else {
                res.send("Has more than enough vacancies")
            }
        });
    }
);

//router.post('/register', )
//users.insertMany(user);

//users.find().then(result => console.log(result))


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`)
})
