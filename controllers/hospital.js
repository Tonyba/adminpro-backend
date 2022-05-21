const { response } = require('express');
const Hospital = require('../models/hospital');
const User = require('../models/user');

async function getHospitals(req, res = response) {
  try {
    const hospitals = await Hospital.find().populate('user', 'name image');

    res.json({
      ok: true,
      hospitals,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
    });
  }
}

async function createHospital(req, res = response) {
  try {
    const uid = req.uid;
    const hospital = new Hospital({
      user: uid,
      ...req.body,
    });

    await hospital.save();

    res.json({
      ok: true,
      hospital,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'unexpected error',
      error,
    });
  }
}

async function updateHospital(req, res = response) {
  try {
    const id = req.params.id;

    const hospitalDB = await Hospital.findById(id);
    console.log(req.body.user, 'paso');

    const userDB = await User.findById(req.body.user);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'User not found',
      });
    }

    if (!hospitalDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Hospital not found',
      });
    }

    const update = await Hospital.findByIdAndUpdate(id, req.body, { new: true });

    res.json({
      ok: true,
      msg: 'hospital updated',
      update,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'unexpected error',
      error,
    });
  }
}

async function deleteHospital(req, res = response) {
  try {
    const id = req.params.id;

    const hospitalDB = await Hospital.findById(id);

    if (!hospitalDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Hospital not found',
      });
    }

    const update = await Hospital.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: 'hospital deleted',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'unexpected error',
      error,
    });
  }
}

module.exports = {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
};
