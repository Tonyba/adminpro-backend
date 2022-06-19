const Medic = require('../models/medic');
const User = require('../models/user');
const Hospital = require('../models/hospital');
const { cloudinary } = require('../utils/cloudinary');

const fs = require('fs');

function deleteTempImage(path) {
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

async function updateImageWithCloudinary(path, type, id) {
  let cloudinaryUrl;

  switch (type) {
    case 'medics':
      const medic = await Medic.findById(id);

      if (!medic) {
        console.log("It's not a medic");
        return false;
      }

      cloudinaryUrl = await updateToCloudinary(path, type, medic.img);

      medic.img = cloudinaryUrl;
      await medic.save();
      return true;
      break;

    case 'hospitals':
      const hospital = await Hospital.findById(id);
      if (!hospital) {
        console.log("It's not a hospital");
        return false;
      }

      cloudinaryUrl = await updateToCloudinary(path, type, hospital.img);

      hospital.img = cloudinaryUrl;
      await hospital.save();
      return true;
      break;

    case 'users':
      const user = await User.findById(id);
      if (!user) {
        console.log("It's not a user");
        return false;
      }

      cloudinaryUrl = await updateToCloudinary(path, type, user.img);

      user.img = cloudinaryUrl;
      await user.save();
      return true;
      break;
  }
}

async function updateToCloudinary(path, type, oldImg) {
  storeFileURI = oldImg.split('/');

  try {
    const { resources } = await cloudinary.search
      .expression(`folder:adminpro/${type} AND filename:${storeFileURI[storeFileURI.length - 1]}`)
      .sort_by('public_id', 'desc')
      .execute();

    if (resources.length > 0) {
      for (let file of resources) {
        if (file.secure_url === oldImg) {
          await cloudinary.uploader.destroy(file.public_id);
        }
      }
    }

    const uploadResponse = await cloudinary.uploader.upload(path, {
      folder: `adminpro/${type}`,
      use_filename: true,
    });

    deleteTempImage(path);

    return uploadResponse.secure_url;
  } catch (error) {
    console.log(error);
    return oldImg;
  }
}

module.exports = {
  deleteTempImage,
  updateImageWithCloudinary,
};
