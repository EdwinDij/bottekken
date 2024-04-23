const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./config/db.sqlite");

const dbConnect = db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS Questions (id INTEGER PRIMARY KEY, question TEXT)"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS Reponses (id INTEGER PRIMARY KEY, reponse TEXT, question_id INTEGER, FOREIGN KEY(question_id) REFERENCES Questions(id) ON DELETE CASCADE ON UPDATE CASCADE)"
  );
});

module.exports = { dbConnect, db };
