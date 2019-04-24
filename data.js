let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('abcd2');

db.serialize(function() {
    db.run("CREATE TABLE user (id INT, dt TEXT)");

    let stmt = db.prepare("INSERT into user values(?,?)");

    for (let i = 0; i < 10; i++) {
        let d = new Date();
        let n = d.toLocaleTimeString();
        stmt.run(i, n);
    }
    stmt.finalize();

    db.each("SELECT id, dt FROM user", function(err, row) {
        console.log("User id : "+row.id, row.dt);
    });
});

db.close();