const jwt = require('jsonwebtoken');

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

    console.log(uid);
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'Invalid Token',
    });
  }

  next();
};

module.exports = {
  validateJWT,
};
