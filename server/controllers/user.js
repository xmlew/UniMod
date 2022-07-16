const users = require('../models/users');

//function to add module into user's data
const addModule = async (req, res) => {
    const course = req.params.code;
    const user = req.user.name;
    const student = await users.findOne({'username': user},);
    
    if (student.length == 0) return res.status(401);
    const currentModules = student['modules'].toString().split(" ");
    if (course in currentModules) {
      return res.status(401);
    } else {
      const newModules = currentModules.push(course).join(' ');
      users.updateOne({'username': user}, {'modules': newModules});
    }
}
//LOGIC:

/*if module is not in database: Throw error
  else if module is already in user's database: throw error
  else add into module's database and put in frontend
  use UPDATE from CRUD
*/

//function to delete module from user's data
const removeModule = async (req, res) => {
  const course = req.params.code;
  const user = req.user.name;
  const student = await users.findOne({'username': user},);
  
  if (student.length == 0) return res.status(401);
  const currentModules = student['modules'].toString().split(" ");
  if (!course in currentModules) {
    return res.status(401);
  } else {
    const newModules = currentModules.filter(mod => mod != course).join(' ');
    users.updateOne({'username': user}, {'modules': newModules});
  }
}
//LOGIC:

/*if module is not in database: Throw error
  else if module is not in user's database: throw error
  else delete from module's database, reflect on frontend
  use DELETE from CRUD
*/

// function to display data for each module in user's database
// LOGIC: 
// for every module in the user's profile, generate a DataDisplay. Otherwise, put course not available.
const dataDisplay = async (code) => {
  const query = await modules.findOne({
      "Module Code": code,
  });
  const name = query['Module Title'];
  const subscription = subscriptionLevel(query['UG']);
  if (subscription == `The module is oversubscribed.` || subscription == `The module is very popular.`) {
      return  `${code}: ${name}. ${subscription} Put as 1st or 2nd priority for Modreg`   
  } else if (subscription == `The module is moderately popular.` || subscription == `The module is not very popular.`) {
          `${code}: ${name}. ${subscription} Put as 3rd or 4th priority for Modreg`   
  } else {
          `${code}: ${name}.${subscription} Put as 20th priority also for Modreg also can`  
  }
}

const showModules = async (req, res) => {
  const user = req.user.name;
  const student = await users.findOne({'username': user},);
  const modules = student['modules'].toString().split(" ");
  let moduleDescriptions = [];

  for (i = 0; i < student.length; i++) {
    moduleDescriptions.push(dataDisplay(modules[i]));
  };

  return res.status(200).send(JSON.stringify(moduleDescriptions));
}

module.exports = {addModule, removeModule, showModules};