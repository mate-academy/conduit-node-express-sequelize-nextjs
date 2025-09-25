const express = require('express');
const app = express();
const routes = require('./routes');

// Middleware i parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// app.listen zamiast console.log
const PORT = process.env.PORT || 3000;
app.listen(PORT);

// Eksport dla testów
module.exports = app;
