/********************************************************
 * Name:Jennifer Assaf
 * Date:08/12/2018
 * Description: This is the main javascript source code
 * for the addNurses page
 ********************************************************/
module.exports = function () {
    var express = require('express');
    var router = express.Router();

  //function that returns the name and id number of all nurses in the database
    function getNurses(res, mysql, context, complete) {
        mysql.pool.query("SELECT N.id, N.nFName, N.nLName FROM Nurses N", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.nurse = results;
            complete();
        });
    }

    //displays all the nurses 
    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getNurses(res, mysql, context, complete);
       
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('addNurse', context);
            }

        }
    });

    //allows the user to create a new nures in the database
    router.post('/', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Nurses (nFName, nLName) VALUES (?,?)";
        var inserts = [req.body.nFName, req.body.nLName];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/addNurse');
            }
        });
    });
    return router;
}();