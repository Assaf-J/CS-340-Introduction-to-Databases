/********************************************************
 * Name:Jennifer Assaf
 * Date:08/12/2018
 * Description: This is the main javascript source code
 * for the addWard page.
 ********************************************************/
module.exports = function () {
    var express = require('express');
    var router = express.Router();

    //function that gets all the wards in the hospital database
    function getWards(res, mysql, context, complete) {
        mysql.pool.query("SELECT id, wardName, rooms FROM Wards", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.ward = results;
            complete();
        });
    }

    //displays all the wards
    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getWards(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('addWard', context);
            }

        }
    });

    //allows the user to create new wards 
    router.post('/', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Wards (wardName, rooms) VALUES (?,?)";
        var inserts = [req.body.wardName, req.body.rooms];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/addWard');
            }
        });
    });
    return router;
}();