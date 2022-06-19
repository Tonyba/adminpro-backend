const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { updateImage, deleteTempImage, updateImageWithCloudinary } = require('../helpers/updateImage');
const path = require('path');
const { setTimeout } = require('timers/promises');
const { cloudinary } = require('../utils/cloudinary');

async function uploadFile(req, res = response) {
  try {
    const type = req.params.type;
    const id = req.params.id;

    const valid = ['medics', 'users', 'hospitals'];

    if (!valid.includes(type)) {
      return res.status(400).json({
        ok: false,
        msg: 'Selected Type is not a medic, hospital or user. Enter a valid type',
      });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were upploaded.');
    }

    const file = req.files.image;

    const shortName = file.name.split('.');
    const extFile = shortName[shortName.length - 1];

    const extValid = ['png', 'jpg', 'jpeg', 'gif'];

    if (!extValid.includes(extFile)) {
      return res.status(400).json({
        ok: false,
        msg: 'Not allowed extension',
      });
    }

    const fileName = `${uuidv4()}.${extFile}`;
    const path = `./temp/${fileName}`;

    file.mv(path, function (err) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          ok: false,
          msg: 'error moving image',
        });
      }
    });

    await setTimeout(100);

    updateImageWithCloudinary(path, type, id);

    res.json({
      ok: true,
      msg: 'File uploaded',
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

async function getFile(req, res) {
  try {
    const type = req.params.type;
    const file = req.params.file;

    storeFileURI = file;

    if (storeFileURI === 'no-image.png') {
      return res.sendFile('./uploads/no-image.png');
    }

    const { resources } = await cloudinary.search
      .expression(`folder:adminpro/${type} AND filename:${storeFileURI}`)
      .max_results(1)
      .sort_by('public_id', 'desc')
      .execute();

    if (resources.length > 0) {
      console.log(resources);
      res.sendFile(resources[0].secure_url);
    } else {
      return res.sendFile(__dirname + './uploads/no-image.png');
    }
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
  uploadFile,
  getFile,
};
