const bcrypt = require('bcryptjs');
const { response } = require('express');
const { generateJWT } = require('../helpers/jwt');
const User = require('../models/user');

async function login(req, res = response) {
  try {
    const { email, password } = req.body;
    const userDB = await User.findOne({ email });

    if (!userDB) {
      return res.json(400).json({
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
  login,
};