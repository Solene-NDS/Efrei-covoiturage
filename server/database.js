const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'covoiturage.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Trajets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conducteur_id INTEGER NOT NULL,
    lieu_depart TEXT NOT NULL,
    destination TEXT NOT NULL,
    date_trajet TEXT NOT NULL,
    heure_depart TEXT NOT NULL,
    places_disponibles INTEGER NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conducteur_id) REFERENCES Users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trajet_id INTEGER NOT NULL,
    passager_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trajet_id) REFERENCES Trajets(id),
    FOREIGN KEY (passager_id) REFERENCES Users(id),
    UNIQUE(trajet_id, passager_id)
  )`);
});

console.log('✅ Base de données initialisée');

module.exports = db;