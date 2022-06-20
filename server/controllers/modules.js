const mods = require('../models/modules');
const fetch = require('node-fetch')

//function to query module subscription level
/*In index*/
const moduleSubscriptions = app.get('/modsearch/:code', (req, res) => {
    modules.find({'Module Code': 'code'}).then(result => {
            if (result.count == 0) {
                return res.send("Not found")
            } else if (result[0]['UG'] == "x") {
                return res.send("Not applicable for undergraduates")
            } else if (result[0]['UG'] == "-") {
                return res.send("Is oversubscribed")
            } else if (int(result[0]['UG']) < 10) {
                return res.send("Is popular")
            } else if (int(result[0]['UG']) < 25) {
                return res.send("Has vacancies")
            } else {
                return res.send("Has more than enough vacancies")
            }
        });
    }
);

//function to query module 'popularity' levels
/* Queries the database for occurences of the module for a particular year
   and returns the number of occurences and a popularity level.
*/

//function for data display in dashboard
/* LINE 1: Module code
   LINE 2: Module name
   LINE 3: Subscription level
   LINE 4: Modreg Recommendation based on line 3
*/

//function for 