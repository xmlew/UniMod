const user = require('../models/users');
// user registration, login
// Primary purpose of login feature is to save module data. Difficult to use cookies so currently trying this out
const loginUser = async (req, res) => {
    const { inputUsername, inputPass } = req.body;
  
    const user = await User.findOne({
      username: inputUsername,
    });
  
    if (!user) {
        return res
        .status(400)
        .send({ message: 'No account with this username has been registered.' });
    }

    if (user.password != inputPass) {
        return res.status(400).send({ message: 'Invalid username or password.' });
        
    } else {
        return res.status(200).json({
        username: user.username
        });
    };
};

//CREATE USER: LOGIC
/* Username: Between 3 and 20 chars
   Password: >8 chars
*/
const registerUser = async (req, res) => {
    const {username, password} = req.body;

    const existingUser = await users.findOne({
        username: { $regex: new RegExp('^' + username + '$', 'i')},
    });

    if (existingUser) {
        return res.status(400).send({
            message: `Username ${username} is already taken. Please choose another one.`
        })
    }

    else if (!username || username.length > 20 || username.length < 3) {
        return res.status(400).send({
            message: `Username length must be in range of 3 to 20.`
        })
    }

    if (!password || password.length < 6) {
        return res
          .status(400)
          .send({ message: 'Password needs to be atleast 8 characters long.' });
    };
    const user = new user({
        username,
        password,
        Array,
    })

    const savedUser = await user.save();
    res.status(200).json({
        username: savedUser.username
    });
}

const homePage = async (req, res) => {
    res.status(200).send({
        message: "UniMod API"
    })
}

module.exports = {registerUser, loginUser, homePage}