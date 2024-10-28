const express = require('express');
const router = express.Router();
const pharmacistController = require('../controllers/pharmacistController');

router.get('/v1/pharmacist', pharmacistController.getAllPharmacists);
router.post('/v1/pharmacist', pharmacistController.createPharmacist);
router.put('/v1/pharmacist/:id', pharmacistController.updatePharmacist);
router.get('/v1/pharmacist/:id', pharmacistController.getPharmacistById);

module.exports = router;
