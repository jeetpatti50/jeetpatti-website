const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

dns.setDefaultResultOrder("ipv4first");

const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const path       = require('path');


dns.setDefaultResultOrder('ipv4first');

require('dotenv').config();

console.log("SERVER FILE LOADED");

const app = express();

// Trust the reverse proxy (Render/Nginx/etc.) so req.protocol reflects the
// original client protocol via the X-Forwarded-Proto header.
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Canonical host + HTTPS redirect (SEO).
// Forces a single canonical URL: https://jeetpatti.in
//   - www.jeetpatti.in        -> jeetpatti.in
//   - http (any jeetpatti.in) -> https
// Localhost and other hosts are left untouched for local development.
const CANONICAL_HOST = 'jeetpatti.in';
app.use((req, res, next) => {
  const host = (req.headers.host || '').toLowerCase().split(':')[0];

  // Only enforce for the production domain (skip localhost / IPs / previews).
  if (host !== CANONICAL_HOST && host !== 'www.' + CANONICAL_HOST) {
    return next();
  }

  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
  const needsRedirect = host !== CANONICAL_HOST || !isHttps;

  if (needsRedirect) {
    return res.redirect(301, 'https://' + CANONICAL_HOST + req.originalUrl);
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

console.log('Mongo URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000
})
.then(() => console.log('✅ Database connected!'))
.catch(err => {
  console.log('❌ Database error:', err.message);
  console.log('⚠️  Signups/logins will NOT work until the DB connects.');
  console.log('   → Check MongoDB Atlas: whitelist your IP (Network Access) and make sure the cluster is not paused.');
});

app.use('/api/auth',  require('./routes/auth'));
app.use('/api/chips', require('./routes/chips'));
app.use('/api/game',  require('./routes/game'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('');
  console.log('🎴 ================================');
  console.log('   JeetPatti is RUNNING!');
  console.log('   Open: http://localhost:' + PORT);
  console.log('🎴 ================================');
  console.log('');
});