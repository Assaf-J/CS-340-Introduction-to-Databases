/********************************************************
 * Name:Jennifer Assaf
 * Date:08/12/2018
 * Description: This is the main javascript source code
 * for the addDoctors page
 ********************************************************/

module.exports = function () {
    var express = require('express');
    var router = express.Router();

    //function to get id, name, and specialty for all doctors
    function getDoctors(res, mysql, context, complete) {
        mysql.pool.query("SELECT D.id, D.dFName, D.dLName, specialty FROM Doctors D", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.doctor = results;
            complete();
        });
    }

    //Display all doctors in the database

    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getDoctors(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('addDoctor', context);
            }

        }
    });

    //adds new doctors to the database

    router.post('/', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Doctors (dFName, dLName, specialty) VALUES (?,?,?)";
        var inserts = [req.body.dFName, req.body.dLName, req.body.specialty];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/addDoctor');
            }
        });
    });
    return router;
}();