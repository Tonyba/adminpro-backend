const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = (req, res, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'Not Token found in request',
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    req.uid = uid;
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'Invalid Token',
    });
  }

  next();
};

const validateAdmin = async (req, res, next) => {
  const uid = req.uid;

  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'User does not exist',
      });
    }

    if (userDB.role !== 'ADMIN_ROLE') {
      return res.status(403).json({
        ok: false,
        msg: 'User is not admin',
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Talk to the admin',
    });
  }
};

const validateAdmin_or_SameUser = async (req, res, next) => {
  const uid = req.uid;
  const id = req.params.id;

  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'User does not exist',
      });
    }

    if (userDB.role === 'ADMIN_ROLE' || uid === id) {
      next();
    } else {
      return res.status(403).json({
        ok: false,
        msg: 'User is unauthorized',
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Talk to the admin',
    });
  }
};

module.exports = {
  validateJWT,
  validateAdmin,
  validateAdmin_or_SameUser,
};
