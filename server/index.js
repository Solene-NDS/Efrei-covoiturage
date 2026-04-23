const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const db = require('./database');
const { authMiddleware, SECRET } = require('./middleware');

const app = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

const run = (sql, params = []) => new Promise((res, rej) =>
  db.run(sql, params, function(err) { err ? rej(err) : res(this); }));

const get = (sql, params = []) => new Promise((res, rej) =>
  db.get(sql, params, (err, row) => err ? rej(err) : res(row)));

const all = (sql, params = []) => new Promise((res, rej) =>
  db.all(sql, params, (err, rows) => err ? rej(err) : res(rows)));

app.post('/api/register', async (req, res) => {
  const { nom, prenom, email, password } = req.body;
  if (!nom || !prenom || !email || !password)
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  try {
    const existing = await get('SELECT id FROM Users WHERE email = ?', [email]);
    if (existing) return res.status(409).json({ error: 'Un compte existe déjà avec cet email' });
    const hashed = await bcrypt.hash(password, 10);
    const result = await run('INSERT INTO Users (nom, prenom, email, password) VALUES (?, ?, ?, ?)', [nom, prenom, email, hashed]);
    const token = jwt.sign({ id: result.lastID, nom, prenom, email }, SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ message: 'Inscription réussie', user: { id: result.lastID, nom, prenom, email } });
  } catch (e) { res.status(500).json({ error: 'Erreur serveur' }); }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await get('SELECT * FROM Users WHERE email = ?', [email]);
    if (!user) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    const token = jwt.sign({ id: user.id, nom: user.nom, prenom: user.prenom, email: user.email }, SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ message: 'Connexion réussie', user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email } });
  } catch (e) { res.status(500).json({ error: 'Erreur serveur' }); }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Déconnexion réussie' });
});

app.get('/api/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.get('/api/trajets', async (req, res) => {
  try {
    const trajets = await all(`
      SELECT t.*, u.nom, u.prenom, u.email,
        (SELECT COUNT(*) FROM Reservations r WHERE r.trajet_id = t.id) as nb_reservations
      FROM Trajets t JOIN Users u ON t.conducteur_id = u.id
      WHERE t.date_trajet >= date('now')
      ORDER BY t.date_trajet ASC, t.heure_depart ASC`);
    res.json(trajets);
  } catch (e) { res.status(500).json({ error: 'Erreur serveur' }); }
});

app.get('/api/trajets/mes-trajets', authMiddleware, async (req, res) => {
  try {
    const trajets = await all(`
      SELECT t.*, (SELECT COUNT(*) FROM Reservations r WHERE r.trajet_id = t.id) as nb_reservations
      FROM Trajets t WHERE t.conducteur_id = ? ORDER BY t.date_trajet DESC`, [req.user.id]);
    res.json(trajets);
  } catch (e) { res.status(500).json({ error: 'Erreur serveur' }); }
});

app.get('/api/trajets/mes-reservations', authMiddleware, async (req, res) => {
  try {
    const reservations = await all(`
      SELECT t.*, u.nom, u.prenom, r.id as reservation_id
      FROM Reservations r JOIN Trajets t ON r.trajet_id = t.id JOIN Users u ON t.conducteur_id = u.id
      WHERE r.passager_id = ? ORDER BY t.date_trajet ASC`, [req.user.id]);
    res.json(reservations);
  } catch (e) { res.status(500).json({ error: 'Erreur serveur' }); }
});

app.post('/api/trajets', authMiddleware, async (req, res) => {
  const { lieu_depart, destination, date_trajet, heure_depart, places_disponibles, description } = req.body;
  if (!lieu_depart || !destination || !date_trajet || !heure_depart || !places_disponibles)
    return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' });
  try {
    const result = await run(`INSERT INTO Trajets (conducteur_id, lieu_depart, destination, date_trajet, heure_depart, places_disponibles, description) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, lieu_depart, destination, date_trajet, heure_depart, places_disponibles, description || '']);
    res.json({ message: 'Trajet publié avec succès', id: result.lastID });
  } catch (e) { res.status(500).json({ error: 'Erreur serveur' }); }
});

app.put('/api/trajets/:id', authMiddleware, async (req, res) => {
  try {
    const trajet = await get('SELECT * FROM Trajets WHERE id = ?', [req.params.id]);
    if (!trajet) return res.status(404).json({ error: 'Trajet introuvable' });
    if (trajet.conducteur_id !== req.user.id) return res.status(403).json({ error: 'Non autorisé' });
    const { lieu_depart, destination, date_trajet, heure_depart, places_disponibles, description } = req.body;
    await run(`UPDATE Trajets SET lieu_depart=?, destination=?, date_trajet=?, heure_depart=?, places_disponibles=?, description=? WHERE id=?`,
      [lieu_depart, destination, date_trajet, heure_depart, places_disponibles, description, req.params.id]);
    res.json({ message: 'Trajet modifié avec succès' });
  } catch (e) { res.status(500).json({ error: 'Erreur serveur' }); }
});

app.delete('/api/trajets/:id', authMiddleware, async (req, res) => {
  try {
    const trajet = await get('SELECT * FROM Trajets WHERE id = ?', [req.params.id]);
    if (!trajet) return res.status(404).json({ error: 'Trajet introuvable' });
    if (trajet.conducteur_id !== req.user.id) return res.status(403).json({ error: 'Non autorisé' });
    await run('DELETE FROM Reservations WHERE trajet_id = ?', [req.params.id]);
    await run('DELETE FROM Trajets WHERE id = ?', [req.params.id]);
    res.json({ message: 'Trajet supprimé' });
  } catch (e) { res.status(500).json({ error: 'Erreur serveur' }); }
});

app.post('/api/reservations', authMiddleware, async (req, res) => {
  const { trajet_id } = req.body;
  try {
    const trajet = await get('SELECT * FROM Trajets WHERE id = ?', [trajet_id]);
    if (!trajet) return res.status(404).json({ error: 'Trajet introuvable' });
    if (trajet.conducteur_id === req.user.id) return res.status(400).json({ error: 'Vous ne pouvez pas réserver votre propre trajet' });
    const row = await get('SELECT COUNT(*) as count FROM Reservations WHERE trajet_id = ?', [trajet_id]);
    if (row.count >= trajet.places_disponibles) return res.status(400).json({ error: 'Plus de places disponibles' });
    await run('INSERT INTO Reservations (trajet_id, passager_id) VALUES (?, ?)', [trajet_id, req.user.id]);
    res.json({ message: 'Réservation effectuée avec succès' });
  } catch (e) {
    if (e.message?.includes('UNIQUE')) return res.status(409).json({ error: 'Vous avez déjà réservé ce trajet' });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/api/reservations/:id', authMiddleware, async (req, res) => {
  try {
    const resa = await get('SELECT * FROM Reservations WHERE id = ?', [req.params.id]);
    if (!resa) return res.status(404).json({ error: 'Réservation introuvable' });
    if (resa.passager_id !== req.user.id) return res.status(403).json({ error: 'Non autorisé' });
    await run('DELETE FROM Reservations WHERE id = ?', [req.params.id]);
    res.json({ message: 'Réservation annulée' });
  } catch (e) { res.status(500).json({ error: 'Erreur serveur' }); }
});

app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));