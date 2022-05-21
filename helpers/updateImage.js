const Medic = require('../models/medic');
const User = require('../models/user');
const Hospital = require('../models/hospital');

const fs = require('fs');

function deleteImage(path) {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}

async function updateImage(type, id, filename) {
  let oldPath = '';

  switch (type) {
    case 'medics':
      const medic = await Medic.findById(id);
      if (!medic) {
        console.log("It's not a medic");
        return false;
      }

      oldPath = `./uploads/medics/${medic.img}`;
      deleteImage(oldPath);

      medic.img = filename;
      await medic.save();
      return true;
      break;

    case 'hospitals':
      const hospital = await Hospital.findById(id);
      if (!hospital) {
        console.log("It's not a hospital");
        return false;
      }

      oldPath = `./uploads/hospitals/${hospital.img}`;
      deleteImage(oldPath);

      hospital.img = filename;
      await hospital.save();
      return true;
      break;

    case 'users':
      const user = await User.findById(id);
      if (!user) {
        console.log("It's not a user");
        return false;
      }

      oldPath = `./uploads/users/${user.img}`;
      deleteImage(oldPath);

      user.img = filename;
      await user.save();
      return true;
      break;
  }
}

module.exports = {
  updateImage,
};
