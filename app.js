var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoUrl = "mongodb://localhost:27017/business-department"
var cors = require('cors');


// configure app to use bodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '100mb'}));

app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: mongoUrl,
    ttl: 60 * 60 * 24 * 7
  })
}));

app.use(cors({
  origin: true,
  credentials: true
}))

//port
var port = process.env.PORT || 3000;

//server
var server = app.listen(port, function() {
  console.log('express server has started on port ' + port);
});

// configure mongodb
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
  console.log('connected to mongod server');
});


mongoose.Promise = global.Promise;
// db server connect
mongoose.connect('mongodb://localhost/business-department', {useMongoClient: true});

//define models
var Categories = require('./models/category');
var Auths = require('./models/auths');

//configure router
var categoriesRouter = require('./routes/category')(app, Categories);
var authsRouter = require('./routes/auths')(app, Auths);