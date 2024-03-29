const { modules } = require("../models/modules");
const { students }= require("../models/studentdata");
const users = require('../models/users');
const tokens = require('../models/tokens');

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
    const token = req.params['token'];
    const stu = await tokens.findOne({'access': token}).exec();
    if (!stu) return res.status(401).send("error")
    const user = stu['username'];
    const student = await users.findOne({'username': user},).exec();
    const course = student['course'];
    const results = await students.find({'Course': course},);
    let data = {};
    for (i = 0; i < Object.keys(results).length; i++) {
        for (module1 of results[i]["Sem1"].toString().replaceAll("[", "")
                                                     .replaceAll("]", "")
                                                     .replaceAll("'", "")
                                                     .split(", ")) {
            if (!(module1 in data)) {
                data[module1] = 1;
            } else {
                data[module1] += 1;
            }
        }
        
        for (module2 of results[i]["Sem2"].toString().replaceAll("[", "")
                                                      .replaceAll("]", "")
                                                      .replaceAll("'", "")
                                                      .split(", ")) {
            if (!(module2 in data)) {
                data[module2] = 1;
            } else {
                data[module2] += 1;
            }
        }
    }

    let newData = [];
    for (const [key, value] of Object.entries(data)) {
        let newDict = {title: value, total: key};
        newData.push(newDict)
    }

    return res.send(JSON.stringify(newData))
}

const geModPopularity = async (req, res) => {
    const results = await students.find();
    const data = {}
    for (i = 0; i < 5000; i++) {
        for (mod of results[i]['Sem1'].toString().replaceAll("[", "")
                                                .replaceAll("]", "")
                                                .replaceAll("'", "")
                                                .split(", ")) {
            if (!(mod in data) && mod.startsWith("GE")) {
                data[mod] = 1;
            } else if (mod.startsWith("GE")) {
                data[mod] += 1;
            }
        }

        for (mod of results[i]['Sem2'].toString().replaceAll("[", "")
                                                .replaceAll("]", "")
                                                .replaceAll("'", "")
                                                .split(", ")) {
            if (!(mod in data) && mod.startsWith("GE")) {
                data[mod] = 1;
            } else if ((mod.startsWith("GE"))) {
                data[mod] += 1;
            }
        }
    }
    let newData = [];
    for (const [key, value] of Object.entries(data)) {
        let newDict = {title: value, total: key};
        newData.push(newDict)
    }
    // for every item in results, if there is a GE module not in the current dictionary, add it into the dict.
    // if there is, add a count to it.
    return res.send(JSON.stringify(newData))
}

module.exports = {subscriptionLevel, moduleSubs, dataDisplay, getCourseStudentData, modPopularity, geModPopularity};
