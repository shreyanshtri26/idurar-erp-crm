const Query = require('../../models/appModels/Query');
const mongoose = require('mongoose');

// GET /api/queries?page=&limit=
exports.getQueries = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [queries, total] = await Promise.all([
      Query.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Query.countDocuments()
    ]);
    res.json({
      data: queries,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/queries
exports.createQuery = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const query = new Query({ title, description });
    await query.save();
    res.status(201).json(query);
  } catch (err) {
    next(err);
  }
};

// GET /api/queries/:id
exports.getQueryById = async (req, res, next) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) return res.status(404).json({ message: 'Query not found' });
    res.json(query);
  } catch (err) {
    next(err);
  }
};

// PUT /api/queries/:id
exports.updateQuery = async (req, res, next) => {
  try {
    const { status, resolution, title, description } = req.body;
    const update = {};
    if (status) update.status = status;
    if (resolution) update.resolution = resolution;
    if (title) update.title = title;
    if (description) update.description = description;
    const query = await Query.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!query) return res.status(404).json({ message: 'Query not found' });
    res.json(query);
  } catch (err) {
    next(err);
  }
};

// POST /api/queries/:id/notes
exports.addNote = async (req, res, next) => {
  try {
    const { text, author } = req.body;
    const query = await Query.findById(req.params.id);
    if (!query) return res.status(404).json({ message: 'Query not found' });
    query.notes.push({ text, author });
    await query.save();
    res.status(201).json(query.notes[query.notes.length - 1]);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/queries/:id/notes/:noteId
exports.deleteNote = async (req, res, next) => {
  try {
    const { id, noteId } = req.params;
    const query = await Query.findById(id);
    if (!query) return res.status(404).json({ message: 'Query not found' });
    const note = query.notes.id(noteId);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    note.remove();
    await query.save();
    res.json({ message: 'Note deleted' });
  } catch (err) {
    next(err);
  }
}; 