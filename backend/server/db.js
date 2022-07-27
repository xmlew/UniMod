const { moduleSearch } = require('./models/modsearch')
const { modules } = require('./models/modules')

// moduleSearch.findOne({moduleCode: "AC5001"}, (err, data) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(data);
//     }
// });

modules.findOne({moduleCode: "HSI1000"}, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
});


// const moduleSubs = async (req, res) => {
//     const modCode = req.params['code']
//     const subscription = await modules.findOne({
//         'Module Code': modCode
//     }).exec();
//     //const popularity = subscriptionLevel(subscription['UG']);
//     if (!subscription) {
//         return res.status(400).send("No such module in database.")
//     }
//     return res.status(200).send(subscriptionLevel(subscription['UG']));
// }
