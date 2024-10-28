const db = require('../models');
const { getCoordinates } = require('../services/geocodingService');

const getAllPharmacists = async (req, res) => {
  try {
    const pharmacists = await db.Pharmacist.findAll();
    res.status(200).json({ status: "success", code: 200, data: pharmacists });
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: error.message });
  }
};

const createPharmacist = async (req, res) => {
  try {
    const { address_1, address_2, postal_code, ...otherFields } = req.body;
    const address = `${address_1}, ${address_2}, ${postal_code}`;
    const coordinates = await getCoordinates(address);

    const newPharmacist = await db.Pharmacist.create({
      address_1,
      address_2,
      postal_code,
      latitude: coordinates?.latitude || null,
      longitude: coordinates?.longitude || null,
      ...otherFields
    });

    res.status(201).json({ status: "success", code: 201, data: newPharmacist });
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: error.message });
  }
};

const updatePharmacist = async (req, res) => {
  try {
    const { id } = req.params;
    const lastModified = req.header('If-Modified-Since');

    const pharmacist = await db.Pharmacist.findByPk(id);
    if (!pharmacist) return res.status(404).json({ status: "error", code: 404, message: "Pharmacist not found" });

    if (lastModified && new Date(lastModified) < pharmacist.updatedAt) {
      return res.status(409).json({ status: "error", code: 409, message: "Record has been modified" });
    }

    await pharmacist.update(req.body);
    res.status(200).json({ status: "success", code: 200, data: pharmacist });
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: error.message });
  }
};

const getPharmacistById = async (req, res) => {
  try {
    const { id } = req.params;
    const pharmacist = await db.Pharmacist.findByPk(id);
    if (!pharmacist) return res.status(404).json({ status: "error", code: 404, message: "Pharmacist not found" });

    res.status(200).json({ status: "success", code: 200, data: pharmacist });
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: error.message });
  }
};

module.exports = {
  getAllPharmacists,
  createPharmacist,
  updatePharmacist,
  getPharmacistById
};
