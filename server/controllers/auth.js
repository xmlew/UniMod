const users = require('../models/users');
// user registration, login
// Primary purpose of login feature is to save module data. Difficult to use cookies so currently trying this out

//CREATE USER: LOGIC
/* Username: Between 3 and 20 chars
   Password: Between 8 and 20 chars
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
};

//LOGIN TO USER:
/* If wrong user/pass: Throw error
   Else: Sign user in
*/