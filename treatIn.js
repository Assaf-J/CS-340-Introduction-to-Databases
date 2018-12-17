/********************************************************
 * Name:Jennifer Assaf
 * Date:08/12/2018
 * Description: This is the main javascript source code
 * for the treatIn relationship page. It joins the Doctors
 * and ward entities
 ********************************************************/

module.exports = function () {
    var express = require('express');
    var router = express.Router();

    //function that gets all wards in the database
    function getWards(res, mysql, context, complete) {
        mysql.pool.query("SELECT id, wardName FROM Wards", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.ward = results;
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

    //gets all Members in this relationship between doctors and wards
    function getTreatIn(res, mysql, context, complete) {
        mysql.pool.query("SELECT D.dLName, Wards.wardName from Doctors D INNER JOIN treatIn ON D.id= treatIn.DRid INNER JOIN Wards on Wards.id = treatIn.wid", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.treatIn = results;
            complete();
        });
    }

    //displays all the members of this relationship
    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
       
        getWards(res, mysql, context, complete);
        getTreatIn(res, mysql, context, complete);
        getDoctors(res, mysql, context, complete);
        
        function complete() {
            callbackCount++;
            if (callbackCount >= 3) {
                res.render('treatIn', context);
            }

        }
    });

    //creates new members in this relationship
    router.post('/', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO treatIn (DRid, wid) VALUES (?,?)";
        var inserts = [req.body.doctor, req.body.ward];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/treatIn');
            }
        });
    });
    return router;
}();

