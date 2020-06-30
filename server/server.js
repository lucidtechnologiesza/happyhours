var path = require('path');
var express =  require('express');
var bodyParser = require('body-parser');

const app = express();

/** --- middleware ---- */

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

/** --- middleware ---- */

app.all('*', (req, res) => {
    res.render('home');
});

module.exports = app;
