const Memory = require('../models/Memory');

exports.renderDashboard = (req, res) => {
  try {
    const stats = Memory.getStats();
    const categories = Memory.getCategories();
    const tags = Memory.getTags();

    res.render('dashboard', {
      title: 'Dashboard | Second Brain',
      activeTab: 'dashboard',
      stats,
      categories,
      tags
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
};

exports.renderAllMemories = (req, res) => {
  try {
    const { type, category, tag, search } = req.query;
    const memories = Memory.getAll({ type, category, tag, search });
    const categories = Memory.getCategories();
    const tags = Memory.getTags();

    let activeTab = 'all';
    if (type) activeTab = type.toLowerCase();

    res.render('index', {
      title: `${type || 'All'} Memories | Second Brain`,
      activeTab,
      memories,
      categories,
      tags,
      filterType: type || '',
      filterCategory: category || '',
      filterTag: tag || '',
      searchQuery: search || ''
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
};

exports.renderCreateForm = (req, res) => {
  try {
    const defaultType = req.query.type || 'Note';
    const categories = Memory.getCategories();

    res.render('create', {
      title: 'Add Memory | Second Brain',
      activeTab: 'create',
      defaultType,
      categories
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.createMemory = (req, res) => {
  try {
    const newId = Memory.create(req.body);
    res.redirect(`/memories/${newId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating memory');
  }
};

exports.renderDetail = (req, res) => {
  try {
    const memory = Memory.getById(req.params.id);
    if (!memory) {
      return res.status(404).send('Memory not found');
    }

    const categories = Memory.getCategories();

    res.render('show', {
      title: `${memory.title} | Second Brain`,
      activeTab: memory.type.toLowerCase(),
      memory,
      categories
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.renderEditForm = (req, res) => {
  try {
    const memory = Memory.getById(req.params.id);
    if (!memory) {
      return res.status(404).send('Memory not found');
    }
    const categories = Memory.getCategories();

    res.render('edit', {
      title: `Edit: ${memory.title} | Second Brain`,
      activeTab: 'all',
      memory,
      categories
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.updateMemory = (req, res) => {
  try {
    Memory.update(req.params.id, req.body);
    res.redirect(`/memories/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating memory');
  }
};

exports.deleteMemory = (req, res) => {
  try {
    Memory.delete(req.params.id);
    res.redirect('/memories');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting memory');
  }
};

exports.globalSearch = (req, res) => {
  const q = req.query.q || '';
  res.redirect(`/memories?search=${encodeURIComponent(q)}`);
};
