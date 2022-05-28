const bcrypt = require('bcryptjs');
const { response } = require('express');
const { googleVerify } = require('../helpers/google-verify');
const { generateJWT } = require('../helpers/jwt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

async function login(req, res = response) {
  try {
    const { email, password } = req.body;
    const userDB = await User.findOne({ email });

    if (!userDB) {
      return res.status(400).json({
        ok: false,
        msg: 'Email or Password not valid',
      });
    }

    const validPassword = bcrypt.compareSync(password, userDB.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Password not valid',
      });
    }

    // GENERATE TOKEN
    const token = await generateJWT(userDB.id);

    res.json({
      ok: true,
      token,
      user: userDB,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Unexpected Error. Check logs',
      error,
    });
  }
}

async function googleSignIn(req, res = response) {
  try {
    const googleToken = req.body.token;

    const { name, email, picture } = await googleVerify(googleToken);

    const userDB = await User.findOne({ email });
    let user;

    if (!userDB) {
      user = new User({
        email,
        name,
        img: picture,
        password: '@@@',
        google: true,
      });
    } else {
      user = userDB;
      delete user.password;
      user.google = true;
    }

    await user.save();

    const token = await generateJWT(user.uid);

    res.json({
      ok: true,
      msg: 'google sigin',
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'token is not valid',
      error,
    });
  }
}

async function renewToken(req, res = response) {
  try {
    const token = await generateJWT(req.uid);

    res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'token is not valid',
      error,
    });
  }
}

module.exports = {
  login,
  googleSignIn,
  renewToken,
};
