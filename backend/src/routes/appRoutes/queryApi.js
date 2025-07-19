const express = require('express');
const router = express.Router();
const queryController = require('../../controllers/appControllers/queryController');

// GET /api/queries?page=&limit=
router.get('/', queryController.getQueries);

// POST /api/queries
router.post('/', queryController.createQuery);

// GET /api/queries/:id
router.get('/:id', queryController.getQueryById);

// PUT /api/queries/:id
router.put('/:id', queryController.updateQuery);

// POST /api/queries/:id/notes
router.post('/:id/notes', queryController.addNote);

// DELETE /api/queries/:id/notes/:noteId
router.delete('/:id/notes/:noteId', queryController.deleteNote);

module.exports = router; 