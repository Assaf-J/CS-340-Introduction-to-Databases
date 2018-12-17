
/********************************************************
 * Name:Jennifer Assaf
 * Date:08/12/2018
 * Description: This is the main javascript source code
 * for the treatedIn relationship page. This joins the 
 * Patients and Wards Tables
 ********************************************************/
module.exports = function () {
    var express = require('express');
    var router = express.Router();


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

    //get all Patients in the database
    function getPatients(res, mysql, context, complete) {
        mysql.pool.query("SELECT id, lName FROM Patients", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.patient = results;
            complete();
        });
    }
    //function that joins the ward and patient tables
    function getTreatment(res, mysql, context, complete) {
        mysql.pool.query("SELECT D.dLName, P.lName FROM Doctors D INNER JOIN treat ON D.id= treat.DRid INNER JOIN Patients P on P.id = treat.pid", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.treatment = results;
            complete();
        });
    }

    //displays all the members of the relationship
    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');

        getPatients(res, mysql, context, complete);
        getDoctors(res, mysql, context, complete);
        getTreatment(res, mysql, context, complete);

        function complete() {
            callbackCount++;
            if (callbackCount >= 3) {
                res.render('treat', context);
            }

        }
    });
    //create newMembers in the relationship
    router.post('/', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO treat (DRid, pid) VALUES (?,?)";
        var inserts = [req.body.doctor, req.body.patient];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/treat');
            }
        });
    });
    
    return router;
}();