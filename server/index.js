const bcrypt = require('bcrypt');
const express = require("express");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const cors = require('cors');

const {moduleSubs, dataDisplay, getCourseStudentData, modPopularity, geModPopularity} = require("./controllers/modules");
const {addModule, removeModule, showModules} = require("./controllers/user");
const users = require('./models/users');
const tokens = require('./models/tokens');

//const Router = require("./routes")

const app = express();
app.use(express.json());
const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}
app.use(cors(corsOptions));
const PORT = 4001;

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
    return res.send('Welcome to UniMod API. API Endpoints can be found in Github repository')
});

//application searches
app.get('/modsearch/:code', cors(corsOptions), moduleSubs);
app.get('/display/:code', cors(corsOptions), dataDisplay);
app.get('/courseData/:course', cors(corsOptions),getCourseStudentData);
app.get('/modtakers/:code', cors(corsOptions), modPopularity);
app.get('/geMods', cors(corsOptions), geModPopularity);
app.get('/user/:token', cors(corsOptions), showModules);
app.get('/addMod/:code/:user', cors(corsOptions), addModule);
app.get('/delMod/:code/:user', cors(corsOptions), removeModule)


//login
let refreshTokens = []

const ACCESS_TOKEN_SECRET = 'ed8b8ef103069e067c0970af7e1646eeb91700c4da9a6f5476b4a47ab6bd1082c1c39f51d664e165baa15004387c0dc8a6958dc85f09572cde5441bbacb07cb7';
const REFRESH_TOKEN_SECRET = '7785422c96e77bc96c340389361ac04024e3f9dec829769eceb99049ed711fba950375280c3aa019947a02a528f47aeb92b913cf6dbc7cc595f54f80873dd6fd';

app.get('/token/:tok', cors(corsOptions), (req, res) => {
  const refreshToken = req.params.tok;
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
})

app.post('/logout', cors(corsOptions),(req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  console.log(refreshTokens);
  res.sendStatus(204)
})

app.post('/signup', cors(corsOptions), async (req, res) => {
    const givenName = `${req.body.firstName} ${req.body.lastName}`;
    const username = req.body.user;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const course = req.body.course;

    const verify = await users.findOne({'username': username}).exec();
    //users.updateOne({'username': username}, {'modules': 'CS1010S'}).exec();
    if (!verify) return res.sendStatus(401);

    users.insertMany([{'name': givenName, 'username': username, 'password': hashedPassword, 'course': course, 'modules': ""}]).then(
      res.sendStatus(200));
})

app.get('/login/:user/:pass', cors(corsOptions), async (req, res) => {
  // Authenticate User

  const username = req.params.user
  const hashedPassword = await bcrypt.hash(req.params.pass, 10);
  const existingUser = await users.findOne({'username': username}).exec();
  if (!existingUser) {
    return res.sendStatus(401);
  }
  bcrypt.compare(hashedPassword, existingUser['password'], (err, result) => {
    if (err) return res.sendStatus(401);
  })

  const user = { name: username }
  const accessToken = generateAccessToken(user)
  const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET)
  tokens.insertMany([{'username': username, 'access': accessToken, 'refresh': refreshToken}]);
  return res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

function generateAccessToken(user) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '60m' })
}

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}...`)
})

