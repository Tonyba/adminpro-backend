const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { response } = require('express');
const { generateJWT } = require('../helpers/jwt');

async function getUsers(req, res = response) {
  try {
    const from = Number(req.query.from) || 0;
    const to = Number(req.query.limit) || 5;

    // const users = await User.find({}, 'name email role google').skip(from).limit(to);

    // const total = await User.count();

    const [users, total] = await Promise.all([User.find({}, 'name email role google img').skip(from).limit(to), User.countDocuments()]);

    res.json({
      ok: true,
      users,
      total,
    });
  } catch (error) {
    res.json({
      ok: false,
      msg: 'Error getting users',
    });
  }
}

async function createUser(req, res = response) {
  const { email, password } = req.body;

  try {
    const existEmail = await User.findOne({ email });

    if (existEmail) {
      return res.status(400).json({
        ok: false,
        msg: 'Email taken',
      });
    }

    const user = new User(req.body);

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    const token = await generateJWT(user.id);

    res.json({
      ok: true,
      msg: 'User registered',
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Unexpected Error. Check logs',
      error,
    });
  }
}

async function updateUser(req, res = response) {
  // TODO:  Validate token and check if user is valid

  try {
    const uid = req.params.id;

    const userDb = await User.findById(uid);

    if (!userDb) {
      return res.status(404).json({
        ok: false,
        msg: 'User not found',
      });
    }

    const { password, google, email, ...fields } = req.body;

    if (userDb.email !== email) {
      const existEmail = await User.findOne({ email });
      if (existEmail) {
        return res.status(400).json({
          ok: false,
          msg: 'Email taken',
        });
      }
    }

    if (!userDb.google) {
      fields.email = email;
    } else if (userDb.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'Google users cant change their email',
      });
    }

    const updateUser = await User.findByIdAndUpdate(uid, fields, { new: true });

    res.json({
      ok: true,
      user: updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Unexpected Error. Check logs',
      error,
    });
  }
}

async function deleteUser(req, res = response) {
  try {
    const id = req.params.id;

    const userDb = await User.findById(id);

    if (!userDb) {
      return res.status(404).json({
        ok: false,
        msg: 'User not found',
      });
    }

    await User.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: 'User deleted',
      id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Unexpected Error. Check logs',
      error,
    });
  }
}

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
