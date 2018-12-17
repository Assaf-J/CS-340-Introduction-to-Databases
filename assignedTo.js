/********************************************************
 * Name:Jennifer Assaf
 * Date:08/12/2018
 * Description: This is the main javascript source code
 * for the assignedTo relationship page.
 ********************************************************/

module.exports = function () {
    var express = require('express');
    var router = express.Router();

    //function that gets all the nurses from the database
    function getNurses(res, mysql, context, complete) {
        mysql.pool.query("SELECT id, nLName FROM Nurses", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.nurse = results;
            complete();
        });
    }

    //function that gets all doctors in the database
    function getDoctors(res, mysql, context, complete) {
        mysql.pool.query("SELECT id, dLName FROM Doctors", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.doctor = results;
            complete();
        });
    }

    //function that joins together the doctors and nurses tables
    function getAssignedTo(res, mysql, context, complete) {
        mysql.pool.query("SELECT  Doctors.dLName , N.nLName from Nurses N INNER JOIN assignedTo ON N.id= assignedTo.nid INNER JOIN Doctors on Doctors.id = assignedTo.DRid", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.assignedTo = results;
            complete();
        });
    }
    //displays all members of the relationship
    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getNurses(res, mysql, context, complete);
        getDoctors(res, mysql, context, complete);
        getAssignedTo(res, mysql, context, complete);

        function complete() {
            callbackCount++;
            if (callbackCount >= 3) {
                res.render('assignedTo', context);
            }

        }
    });

    //create new members in the relationship
    router.post('/', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO assignedTo (DRid,nid) VALUES (?,?)";
        var inserts = [req.body.doctor, req.body.nurse];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/assignedTo');
            }
        });
    });
    return router;
}();