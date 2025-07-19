const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;
const userRoutes = require('./routes/users');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Ice-Breakers Backend API is live!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
