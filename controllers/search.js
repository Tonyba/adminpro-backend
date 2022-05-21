const { response } = require('express');
const Hospital = require('../models/hospital');
const Medic = require('../models/medic');
const User = require('../models/user');

async function getAll(req, res = response) {
  try {
    const search = req.params.search;
    const regex = new RegExp(search, 'i');

    const [users, medics, hospitals] = await Promise.all([User.find({ name: regex }), Medic.find({ name: regex }), Hospital.find({ name: regex })]);

    res.json({
      ok: true,
      users,
      medics,
      hospitals,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
      msg: 'Unexpected Error',
    });
  }
}

async function getCollection(req, res = response) {
  try {
    const collection = req.params.table;
    const regex = new RegExp(req.params.search, 'i');

    let documents = [];

    switch (collection) {
      case 'hospital':
        documents = await Hospital.find({ name: regex }).populate('user', 'name img');
        break;

      case 'medic':
        documents = await Medic.find({ name: regex }).populate('user', 'name img').populate('hospital', 'name img');
        break;

      case 'user':
        documents = await User.find({ name: regex });
        break;

      default:
        return res.status(400).json({
          ok: false,
          msg: 'The table must be valid',
        });
    }

    res.json({
      ok: true,
      results: documents,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error: error,
      msg: 'Unexpected Error',
    });
  }
}

module.exports = {
  getAll,
  getCollection,
};
