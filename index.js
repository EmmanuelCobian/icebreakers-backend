const express = require('express');
const app = express();
const port = 3000;
const userRoutes = require('./routes/users');

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('SQLite Hackathon API is live!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
