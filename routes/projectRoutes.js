const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getProjects)
  .post(protect, upload.array('images', 10), createProject);

router.route('/:id')
  .put(protect, upload.array('images', 10), updateProject)
  .delete(protect, deleteProject);

module.exports = router;
