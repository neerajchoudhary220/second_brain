const express = require('express');
const path = require('path');
const memoryRoutes = require('./routes/memoryRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/', memoryRoutes);

// Error Handling Middleware
app.use((req, res, next) => {
  res.status(404).render('index', {
    title: '404 - Not Found | Second Brain',
    activeTab: '',
    memories: [],
    categories: [],
    tags: [],
    filterType: '',
    filterCategory: '',
    filterTag: '',
    searchQuery: '404 Page Not Found'
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🧠 Second Brain MVP application active & running!`);
  console.log(`🚀 Access application at: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
