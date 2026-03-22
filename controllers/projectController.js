const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Public (for demonstration)
const createProject = async (req, res) => {
  try {
    console.log('Received Body:', req.body);
    const { title, category, tech, desc, demoUrl, githubUrl, useCase, developer } = req.body;
    
    if (!title || !category) {
      return res.status(400).json({ message: 'Title and Category are required' });
    }

    // Process images (uploaded or URLs)
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    } else if (req.body.imageUrls) {
      const urls = typeof req.body.imageUrls === 'string' 
        ? req.body.imageUrls.split(',').map(u => u.trim()).filter(u => u !== "")
        : req.body.imageUrls;
      images = Array.isArray(urls) ? urls : [];
    }

    // Main image is the first one, or fallback, or empty string
    const image = images.length > 0 ? images[0] : (req.body.image || "");

    const project = new Project({
      title,
      category,
      image,
      images,
      tech: Array.isArray(tech) ? tech : JSON.parse(tech || "[]"),
      desc,
      useCase,
      developer,
      demoUrl,
      githubUrl
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    console.error('Project Creation Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Public (for demonstration)
const updateProject = async (req, res) => {
  try {
    const { title, category, tech, desc, demoUrl, githubUrl, useCase, developer } = req.body;

    const project = await Project.findById(req.params.id);

    if (project) {
      // Process new uploaded images or manual URLs
      if (req.files && req.files.length > 0) {
        project.images = req.files.map(file => `/uploads/${file.filename}`);
        project.image = project.images[0];
      } else if (req.body.imageUrls) {
        const urls = typeof req.body.imageUrls === 'string' 
          ? req.body.imageUrls.split(',').map(u => u.trim()).filter(u => u !== "")
          : req.body.imageUrls;
        project.images = Array.isArray(urls) ? urls : project.images;
        if (project.images.length > 0) {
          project.image = project.images[0];
        }
      } else if (req.body.image) {
        project.image = req.body.image;
      }

      project.title = title || project.title;
      project.category = category || project.category;
      if (tech) {
        project.tech = Array.isArray(tech) ? tech : JSON.parse(tech || "[]");
      }
      project.desc = desc || project.desc;
      project.useCase = useCase !== undefined ? useCase : project.useCase;
      project.developer = developer !== undefined ? developer : project.developer;
      project.demoUrl = demoUrl || project.demoUrl;
      project.githubUrl = githubUrl || project.githubUrl;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Public (for demonstration)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject
};
