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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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