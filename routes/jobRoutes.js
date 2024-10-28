const express = require('express');
const { getAllJobs, createJob, updateJob, deleteJob, getJobById } = require('../controllers/jobController');
const { updateCoordinates } = require('../controllers/coordinateController');

const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/v1/job', authMiddleware, getAllJobs);
router.post('/v1/job', authMiddleware, createJob);
router.put('/v1/job/:id', authMiddleware, updateJob);
router.delete('/v1/job/:id', authMiddleware, deleteJob);
router.get('/v1/job/:id', authMiddleware, getJobById);

// Define route for updating pharmacy branch coordinates
router.get('/v1/updateCoordinates', updateCoordinates);

module.exports = router;
