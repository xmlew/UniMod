//let mongoURI = `mongodb://localhost:27017`
const express = require("express");
const mongoose = require("mongoose");
//const help = require("./controllers/modules")
const { modules } = require("./models/modules");
const users = require("./models/users");
let router = express.Router();
//const Router = require("./routes")

const app = express();
app.use(express.json());

const PORT = 3002;

mongoose.Promise = global.Promise;

const connectToDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/UniMod',
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
const registerUser = async (name, pass) => {
    let newUser = {
        username: name,
        password: pass
    };

    const existingUser = await users.findOne({
        username: { $regex: new RegExp('^' + username + '$', 'i')},
    });

    if (users.find({username: name}).count() != 0) {
        console.log("User already exists");
        return

    } else {
        users.insertMany(newUser);
        console.log("new user added")
    };
};

app.get('/', function (req, res, next) {
    return res.send('UniMod API')
});

const subscriptionLevel = (subscription) => {
    if (subscription == "-") {
        return `The module is oversubscribed.`
    } else if (Number((subscription)) < 10) {
        return `The module is very popular.`
    } else if (Number((subscription)) < 25) {
        return `The module is moderately popular.`
    } else if (Number((subscription)) < 50) {
        return `The module is not very popular.`
    } else {
        return `The module is unpopular.`
    }
}

const moduleSubs = async (req, res) => {
    const modCode = req.params['code']
    const subscription = await modules.findOne({
        'Module Code': modCode
    }).exec();
    //const popularity = subscriptionLevel(subscription['UG']);
    return res.status(200).send(subscriptionLevel(subscription['UG']));
}

app.get('/modsearch/:code', moduleSubs) 


//router.post('/register', )
//users.insertMany(user);

//users.find().then(result => console.log(result))


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`)
})
