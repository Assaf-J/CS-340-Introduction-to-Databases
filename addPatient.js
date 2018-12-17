/********************************************************
 * Name:Jennifer Assaf
 * Date:08/12/2018
 * Description: This is the main javascript source code
 * for the addPatients page.
 * 
 *  Code modified from CS340 Lecture material
 ********************************************************/
module.exports = function () {
    var express = require('express');
    var router = express.Router();

    //gets all insurances from the database
    function getInsurance(res, mysql, context, complete) {
        mysql.pool.query("SELECT id, policyName FROM Insurance", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.insurance = results;
            complete();
        });
    }

    //function that returns the name, insurance, and age of all patients
    function getPatients(res, mysql, context, complete) {
        mysql.pool.query("SELECT P.id, P.fName, P.lName, age, Insurance.policyName as insurance FROM Patients P INNER JOIN Insurance ON insurance=Insurance.id", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.patient = results;
            complete();
        });
    }


    //filter function that gets all patients that have a specific kind of insurance policy
    function getPatientsbyInsurance(req, res, mysql, context, complete) {
        var query = "SELECT P.id, P.fName, P.lName, P.age,  Insurance.policyName AS insurance FROM Patients P INNER JOIN Insurance ON insurance = Insurance.id WHERE Insurance.id = ?";
        console.log(req.params)
        var inserts = [req.params.insurance]
        mysql.pool.query(query, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.patient = results;
            complete();
        });
    }

    //function that gets a specific patient from the database that allows the user to update
    function getPerson(res, mysql, context, id, complete) {
        var sql = "SELECT id, fName, lName, insurance, age FROM Patients WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.person = results[0];
            complete();
        });
    }

    //displays all the patients in the database
    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletePatient.js"];
        var mysql = req.app.get('mysql');
        getInsurance(res, mysql, context, complete);
        getPatients(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('addPatient', context);
            }

        }
    });

    //update function that allows the user to update patients in the database
    router.get('/:id', function (req, res) {
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedInsurance.js", "updatePatient.js"];
        var mysql = req.app.get('mysql');
        getPerson(res, mysql, context, req.params.id, complete);
        getInsurance(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('updatePatient', context);
            }

        }
    });

    //filters all the patients based off of which insurance policy they have
    router.get('/filter/:insurance', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["filterPatients.js"];
        var mysql = req.app.get('mysql');
        getPatientsbyInsurance(req, res, mysql, context, complete);
        getInsurance(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('addPatient', context);
            }

        }
    });


    //Allows the user to insert a new patient into the database
    router.post('/', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Patients (fName, lName, age, insurance) VALUES (?,?,?,?)";
        var inserts = [req.body.fName, req.body.lName, req.body.age, req.body.insurance];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/addPatient');
            }
        });
    });


    //update function that lets users update patients
    router.put('/:id', function (req, res) {
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Patients SET fName=?, lName=?, insurance=?, age=? WHERE id=?";
        var inserts = [req.body.fName, req.body.lName, req.body.insurance, req.body.age, req.params.id];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.status(200);
                res.end();
            }
        });
    });

    //delete function that deletes patients out of the database
    router.delete('/:id', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Patients WHERE id = ?";
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

