
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

    //gets all wards in the database
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
    function getTreatedIn(res, mysql, context, complete) {
        mysql.pool.query("SELECT Wards.wardName, P.lName FROM Patients P INNER JOIN treatedIn ON P.id= treatedIn.pid INNER JOIN Wards on Wards.id = treatedIn.wid", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.treatedIn = results;
            complete();
        });
    }

    //displays all the members of the relationship
    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteTreatment.js"];
        var mysql = req.app.get('mysql');

        getPatients(res, mysql, context, complete);
        getWards(res, mysql, context, complete);
        getTreatedIn(res, mysql, context, complete);

        function complete() {
            callbackCount++;
            if (callbackCount >= 3) {
                res.render('treatedIn', context);
            }

        }
    });
    //create newMembers in the relationship
    router.post('/', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO treatedIn (wid, pid) VALUES (?,?)";
        var inserts = [req.body.ward, req.body.patient];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/treatedIn');
            }
        });
    });
    router.delete('/:id', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM treatedIn WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            } else {
                res.status(202).end();
            }
        })
    })
    return router;
}();