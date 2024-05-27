const express = require('express');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const mysql = require('mysql2');
const session = require('express-session');

const app = express();
const client = new OAuth2Client('YOUR_CLIENT_ID', 'YOUR_CLIENT_SECRET', 'YOUR_REDIRECT_URI');

// Body parser middleware
app.use(bodyParser.json());

// Session middleware
app.use(session({
  secret: '', // replace 'your_secret_key' with a strong, unique key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // replace with your MySQL root password
  database: 'pw' // replace with your database name
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// OAuth callback endpoint
app.post('/auth/google/callback', async (req, res) => {
  const token = req.body.token;

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: '', // replace with your client ID
  });

  const payload = ticket.getPayload();
  const googleId = payload['sub'];
  const email = payload['email'];
  const name = payload['name'];

  // Check if the user exists in the gusers table
  db.query('SELECT * FROM gusers WHERE google_id = ?', [googleId], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      // User exists, log them in
      req.session.userId = result[0].id;
      res.json({ success: true });
    } else {
      // User doesn't exist, create a new user
      db.query('INSERT INTO gusers (google_id, email, name) VALUES (?, ?, ?)', [googleId, email, name], (err, result) => {
        if (err) throw err;
        req.session.userId = result.insertId;
        res.json({ success: true });
      });
    }
  });
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
