const { modules } = require("../models/modules");
const { students }= require("../models/studentdata")

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
    if (!subscription) {
        return res.status(400).send("No such module in database.")
    }
    return res.status(200).send(subscriptionLevel(subscription['UG']));
}

//function to query module 'popularity' levels
/* Queries the database for occurences of the module for a particular year
   and returns the number of occurences and a popularity level.
*/
const modulePopularity = async (req, res) => {
    const code = req.body;
    const query = await modules.find();//code in sem1 or sem2
    const count = query.length();
    return res.status(200).send({
        message: `This module had ${count} students taking it.`
    })
}

//function for data display in dashboard
/* LINE 1: Module code
   LINE 2: Module name
   LINE 3: Subscription level
   LINE 4: Modreg Recommendation based on line 3
*/
const dataDisplay = async (req, res) => {
    const code = req.params['code'];
    const query = await modules.findOne({
        "Module Code": code,
    });
    const name = query['Module Title'];
    const subscription = subscriptionLevel(query['UG']);
    if (subscription == `The module is oversubscribed.` || subscription == `The module is very popular.`) {
        return res.status(200).send(
            `${code}: ${name}. ${subscription} Put as 1st or 2nd priority for Modreg`   
        )
    } else if (subscription == `The module is moderately popular.` || subscription == `The module is not very popular.`) {
        return res.status(200).send(
            `${code}: ${name}. ${subscription} Put as 3rd or 4th priority for Modreg`   
        )
    } else {
        return res.status(200).send(
            `${code}: ${name}.${subscription} Put as 20th priority also for Modreg also can`  
        )
    }
}

//function for popularity of Modules
const modPopularity= async (req, res) => {
    const code = req.params['code']
    const query1 = await students.find({
        'Sem1': {$regex: code},
    })
    const query2 = await students.find({
        'Sem2': {$regex: code},
    })
    res.send(`There are ${Object.keys(query1).length} students taking this module in Sem1, ${Object.keys(query2).length} in Sem2.`)
}

/* Queries through GE Mods and ensures they're g*/

//function for student data
/* for a particular course, shows the modules that were taken in year 1 sem1 and sem2*/
const getCourseStudentData = async (req, res) => {
    const course = req.params['course'].replaceAll("-", " ");
    const results = await students.find({'Course': course},);
    let sem1 = {}
    let sem2 = {}
    console.log(Object.keys(results[0]["Sem1"]));
    for (i = 0; i < Object.keys(results).length; i++) {
        for (module1 of results[i]["Sem1"].toString().replaceAll("[", "")
                                                     .replaceAll("]", "")
                                                     .replaceAll("'", "")
                                                     .split(", ")) {
            if (!(module1 in sem1)) {
                sem1[module1] = 1;
            } else {
                sem1[module1] += 1;
            }
        }
        
        for (module2 of results[i]["Sem2"].toString().replaceAll("[", "")
                                                      .replaceAll("]", "")
                                                      .replaceAll("'", "")
                                                      .split(", ")) {
            if (!(module2 in sem2)) {
                sem2[module2] = 1;
            } else {
                sem2[module2] += 1;
            }
        }
    }
    console.log(sem1)
    console.log(sem2)
    return res.send({message: `Sem1: ${sem1.toString()}, Sem2: ${sem2.toString()}`})
}

module.exports = {subscriptionLevel, moduleSubs, dataDisplay, getCourseStudentData, modPopularity};