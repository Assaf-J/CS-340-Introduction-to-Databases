/********************************************************
 * Name:Jennifer Assaf
 * Date:08/12/2018
 * Description: This is the main javascript source code
 * for the database
 ********************************************************/
var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
var path = require('path');
var bodyParser = require('body-parser');

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'handlebars');
app.set('port', 10991);
app.set('mysql', mysql);


app.use('/addWard', require('./addWard.js'));
app.use('/addDoctor', require('./addDoctor.js'));
app.use('/addPatient', require('./addPatient.js'));
app.use('/assignedTo', require('./assignedTo.js'));
app.use('/treatedIn', require('./treatedIn.js'));
app.use('/treatIn', require('./treatIn.js'));
app.use('/treat', require('./treat.js'));
app.use('/workIn', require('./workIn.js'));
app.use('/addNurse', require('./addNurse.js'));
app.use('/addInsurance', require('./addInsurance.js'));


app.use('/static', express.static('public'));
app.use('/', express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.render('home');
});

app.use(function (req, res) {
    res.status(404);    

    res.render('404');
});

app.use(function (err, req, res, next) {
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

