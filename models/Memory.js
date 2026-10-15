const db = require('../database/db');

class Memory {
  static getAll(filters = {}) {
    let query = 'SELECT * FROM memories WHERE 1=1';
    const params = [];

    if (filters.search) {
      query += ` AND (title LIKE ? OR content LIKE ? OR category LIKE ? OR sub_category LIKE ? OR tags LIKE ?)`;
      const term = `%${filters.search}%`;
      params.push(term, term, term, term, term);
    }

    if (filters.type && filters.type !== 'All') {
      query += ` AND type = ?`;
      params.push(filters.type);
    }

    if (filters.category) {
      query += ` AND category = ?`;
      params.push(filters.category);
    }

    if (filters.tag) {
      query += ` AND tags LIKE ?`;
      params.push(`%${filters.tag}%`);
    }

    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    return stmt.all(...params);
  }

  static getById(id) {
    const stmt = db.prepare('SELECT * FROM memories WHERE id = ?');
    return stmt.get(id);
  }

  static create(data) {
    const {
      title,
      content,
      type,
      category,
      sub_category,
      tags,
      code_language,
      task_status,
      task_percentage,
      url
    } = data;

    const stmt = db.prepare(`
      INSERT INTO memories (
        title, content, type, category, sub_category, tags,
        code_language, task_status, task_percentage, url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title,
      content || '',
      type,
      category || 'General',
      sub_category || '',
      tags || '',
      code_language || 'javascript',
      task_status || 'Todo',
      parseInt(task_percentage, 10) || 0,
      url || ''
    );

    return result.lastInsertRowid;
  }

  static update(id, data) {
    const {
      title,
      content,
      type,
      category,
      sub_category,
      tags,
      code_language,
      task_status,
      task_percentage,
      url
    } = data;

    const stmt = db.prepare(`
      UPDATE memories SET
        title = ?,
        content = ?,
        type = ?,
        category = ?,
        sub_category = ?,
        tags = ?,
        code_language = ?,
        task_status = ?,
        task_percentage = ?,
        url = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      title,
      content || '',
      type,
      category || 'General',
      sub_category || '',
      tags || '',
      code_language || 'javascript',
      task_status || 'Todo',
      parseInt(task_percentage, 10) || 0,
      url || '',
      id
    );

    return true;
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM memories WHERE id = ?');
    stmt.run(id);
    return true;
  }

  static getStats() {
    const totalStmt = db.prepare('SELECT COUNT(*) AS total FROM memories');
    const { total } = totalStmt.get();

    const typeStmt = db.prepare('SELECT type, COUNT(*) as count FROM memories GROUP BY type');
    const typeCounts = typeStmt.all().reduce((acc, row) => {
      acc[row.type] = row.count;
      return acc;
    }, {});

    const recentStmt = db.prepare('SELECT * FROM memories ORDER BY created_at DESC LIMIT 5');
    const recent = recentStmt.all();

    return { total, typeCounts, recent };
  }

  static getCategories() {
    const stmt = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM memories 
      WHERE category IS NOT NULL AND category != '' 
      GROUP BY category 
      ORDER BY count DESC
    `);
    return stmt.all();
  }

  static getTags() {
    const stmt = db.prepare(`SELECT tags FROM memories WHERE tags IS NOT NULL AND tags != ''`);
    const rows = stmt.all();
    const tagMap = {};

    rows.forEach((row) => {
      const splitTags = row.tags.split(',').map((t) => t.trim()).filter(Boolean);
      splitTags.forEach((tag) => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    });

    return Object.entries(tagMap).map(([tag, count]) => ({ tag, count }));
  }
}

module.exports = Memory;
