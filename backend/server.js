const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./src/routes/authRoutes');
const inventarisRoutes = require('./src/routes/inventarisRoutes');
const pbgRoutes = require('./src/routes/pbgRoutes');
const tugasRoutes = require('./src/routes/tugasRoutes');
const statsRoutes = require('./src/routes/statsRoutes');

require('./src/cron/pbgReminder'); // Start cron jobs

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/inventaris', inventarisRoutes);
app.use('/api/pbg', pbgRoutes);
app.use('/api/tugas', tugasRoutes);
app.use('/api/dashboard', statsRoutes);
app.use('/uploads', express.static('public/uploads'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
