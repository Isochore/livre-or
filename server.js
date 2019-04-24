let express = require('express');
let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('abcd2');

let app = express();
let bodyParser = require('body-parser');
let session = require('express-session');

// Template

app.set('view engine', 'ejs');

// Middleware

app.use('/assets', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'sdiofhdsi',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(require('./middlewares/flash'));

// Routes

app.get('/', (req, res) => {
    console.log(req.session);
    res.render('pages/index');
});

app.post('/', (req, res) => {
    if (req.body.message === '' || req.body.message === undefined) {
        req.flash('error',"Vous n'avez pas rédigé de message");
        res.redirect('/');
    }
});

app.listen(3000);


db.serialize(function() {
    db.run("CREATE TABLE user (id INT, username VARCHAR, message TEXT, date TEXT)");

    let stmt = db.prepare("INSERT into user values(?,?,?,?)");
    let user = ['Rakesh', 'Richard','Sami', 'John', 'Thomas', 'Jean'];
    let saying = ['Nice', 'Wow', 'Hi', 'Bonjour', 'Coucou', 'Cool'];

    for (let i = 0; i < 6; i++) {
        let d = new Date();
        let u = user[i];
        let m = saying[i];
        let n = d.toLocaleTimeString();
        stmt.run(i, u, m, n);
    }
    stmt.finalize();

    db.each("SELECT id, username, message, date FROM user", function(err, row) {
        console.log("User id : "+row.id, row.username, row.message, row.date);
    });
});

db.close();