/********************************************************
 * Name:Jennifer Assaf
 * Date:08/12/2018
 * Description: This is the main javascript source code
 * for the addInsurance page
 ********************************************************/
module.exports = function () {
    var express = require('express');
    var router = express.Router();

    //gets id and policy name of all insurances
    function getIns(res, mysql, context, complete) {
        mysql.pool.query("SELECT id, policyName FROM Insurance", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.policy = results;
            complete();
        });
    }

    //displays all the insurances
    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getIns(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('addInsurance', context);
            }

        }
    });

    //lets user add a new insurance to the database
    router.post('/', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Insurance (policyName) VALUES (?)";
        var inserts = [req.body.policyName];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/addInsurance');
            }
        });
    });
    return router;
}();