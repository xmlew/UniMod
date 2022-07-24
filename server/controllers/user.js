const tokens = require('../models/tokens');
const users = require('../models/users');
const { subscriptionLevel } = require('./modules')
const { modules } = require("../models/modules");
const cors = require('cors');
const { response } = require('express');

//function to add module into user's data
const addModule = async (req, res) => {
    const course = req.params['code'];
    const token = req.params['token'];
    const stu = await tokens.findOne({'access': token}).exec();
    if (!stu) return res.sendStatus(401);
    const user = stu['username'];
    const student = await users.findOne({'username': user},).exec();
    if (!student) return res.sendStatus(401);
    const mod = await modules.findOne({'Module Code': course}).exec();
    if (!mod) return res.sendStatus(401);
    
    if (!student) return res.sendStatus(401);
    const currentMods = student['modules'];
    let currentModules = [];
    if (currentMods.length != 0) {
      currentModules = student['modules'].toString().split(" ");
    }
    if (currentModules.includes(course)) {
      return res.sendStatus(401);
    } else {
      currentModules.push(course);
      const newModules = currentModules.join(" ");
      users.updateOne({'username': user}, {'modules': newModules}).exec();
      return res.sendStatus(200);
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
  const course = req.params['code'];
  const token = req.params['token'];
  const stu = await tokens.findOne({'access': token}).exec();
  if (!stu) return res.sendStatus(401);
  const user = stu['username'];
  const student = await users.findOne({'username': user},).exec();
  const mod = await modules.findOne({'Module Code': course}).exec();
  if (!mod) return res.sendStatus(401);
  
  if (!student) return res.status(401).send("No such user");
  const currentMods = student['modules'];
  let currentModules = [];
  if (currentMods.length != 0) {
    currentModules = student['modules'].toString().split(" ");
  }
  if (!currentModules.includes(course)) {
    return res.sendStatus(401);
  } else {
    currentModules = currentModules.filter(mod => mod != course);
    console.log(currentModules)
    let courses = "";
    if (currentModules) courses = currentModules.join(" ");
    users.updateOne({'username': user}, {'modules': courses}).exec();
    return res.sendStatus(200);
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
  }).exec();
  d = {}
  const name = query['Module Title'];
  const subscription = subscriptionLevel(query['UG']);
  if (subscription == `The module is oversubscribed.` || subscription == `The module is very popular.`) {
      d[code] = `${name}. ${subscription} Put as 1st or 2nd priority for Modreg`
  } else if (subscription == `The module is moderately popular.` || subscription == `The module is not very popular.`) {
      d[code] = `${name}. ${subscription} Put as 3rd or 4th priority for Modreg`
  } else {
      d[code] = `${name}.${subscription} Put as 20th priority also for Modreg also can`
  } return d;
}

const showModules = async (req, res) => {
  const token = req.params['token'];
  const stu = await tokens.findOne({'access': token}).exec();
  if (!stu) return res.sendStatus(401);
  const user = stu['username'];
  const student = await users.findOne({'username': user},).exec();
  if (!student) return res.sendStatus(401);
  let arr = [];
  if (student['modules'].length != 0) {
    arr = student['modules'].split(" ");
  }
  console.log(arr)
  let moduleDescriptions = [];
  for (i = 0; i < arr.length; i++) {
    let help = await dataDisplay(arr[i]);
    let dict = {};
    if (!help) {
      dict['title'] = `No data for the module.`;
      dict['total'] = arr[i];
      moduleDescriptions.push(dict);
    } else {
      dict['title'] = help[arr[i]];
      dict['total'] = arr[i];
      moduleDescriptions.push(dict);
    }
  };

  return res.json(moduleDescriptions);
}

const coursePage = async (req, res) => {
  const token = req.params['token'];
  const stu = await tokens.findOne({'access': token}).exec();
  const user = stu['username'];
  const student = await users.findOne({'username': user},).exec();
  if (!student) return res.sendStatus(401);
  let arr = [];
  if (student['modules'].length != 0) {
    arr = student['modules'].split(" ");
  }
  let moduleDescriptions = [];
  for (i = 0; i < arr.length; i++) {
    //arr[i] is the module code
    const moduleData = await modules.findOne({
      'Module Code': arr[i]
    }).exec();
    let faculty = "";
    let courseName = "";
    if (!moduleData) {
      courseName = "Not Found"; 
      faculty = "Not Found"; 
    } else {
      courseName = moduleData['Module Title'];
      faculty = moduleData['Department'];
    }

    let dict = {};
    dict['id'] = i + 1;
    dict['faculty'] = faculty;
    dict['name'] = courseName;
    dict['code'] = arr[i];
    moduleDescriptions.push(dict);
  };

  return res.json(moduleDescriptions);
}

module.exports = {coursePage, addModule, removeModule, showModules};
