/********************************************************
 * Name:Jennifer Assaf
 * Date:08/12/2018
 * Description: This is the main javascript source code
 * for the workIn relationship page. It joins the nurses and
 * wards entities
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


    //function that gets all nurses
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

    //function that returns all members in the relationship
    function getWorkIn(res, mysql, context, complete) {
        mysql.pool.query("SELECT N.nLName, Wards.wardName from Nurses N INNER JOIN workIn ON N.id= workIn.nid INNER JOIN Wards on Wards.id = workIn.wid", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.workIn = results;
            complete();
        });
    }

    //displays all members in the relationship
    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');

        getWards(res, mysql, context, complete);
        getWorkIn(res, mysql, context, complete);
        getNurses(res, mysql, context, complete);

        function complete() {
            callbackCount++;
            if (callbackCount >= 3) {
                res.render('workIn', context);
            }

        }
    });

    //create new members in the relationship
    router.post('/', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO workIn (nid, wid) VALUES (?,?)";
        var inserts = [req.body.nurse, req.body.ward];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/workIn');
            }
        });
    });
    return router;
}();