const { response } = require('express');
const Medic = require('../models/medic');
const User = require('../models/user');
const Hospital = require('../models/hospital');

async function getMedics(req, res = response) {
  try {
    const medics = await Medic.find().populate('user', 'name img').populate('hospital', 'name img');

    res.json({
      ok: true,
      medics,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
    });
  }
}

async function createMedic(req, res = response) {
  try {
    const hospitalDB = await Hospital.findById(req.body.hospital);
    const userDB = await User.findById(req.uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'User not found',
      });
    }

    if (!hospitalDB) {
      return res.status(404).json({
        ok: false,
        msg: 'hospital not found',
      });
    }

    req.body.user = req.uid;

    const medic = new Medic(req.body);

    await medic.save();

    res.json({
      ok: true,
      medic,
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

async function updateMedic(req, res = response) {
  try {
    const id = req.params.id;

    const medicDB = await Medic.findById(id);
    const userDB = await User.findById(req.uid);

    if (!medicDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Medic not found',
      });
    }

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'User not found',
      });
    }

    const changesMedic = {
      ...req.body,
      user: req.uid,
      hospital: req.body.hospital,
    };

    const update = await Medic.findByIdAndUpdate(id, changesMedic, { new: true });

    res.json({
      ok: true,
      msg: 'Medic updated',
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

async function deleteMedic(req, res = response) {
  try {
    const id = req.params.id;

    const medicDB = await Medic.findById(id);

    if (!medicDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Medic not found',
      });
    }

    await Medic.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: 'Medic deleted',
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

async function getMedic(req, res = response) {
  try {
    const medic = await Medic.findById(req.params.id).populate('user', 'name img').populate('hospital', 'name img');

    if (!medic) {
      return res.status(404).json({
        ok: false,
        msg: 'User does not exist',
      });
    }

    return res.json({
      ok: true,
      medic,
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
  getMedics,
  createMedic,
  updateMedic,
  deleteMedic,
  getMedic,
};
