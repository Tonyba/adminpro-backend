const jwt = require('jsonwebtoken');

function generateJWT(uid) {
  return new Promise((resolve, reject) => {
    const payload = {
      uid,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: '12h',
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject('JWT cannot be generated');
        } else {
          resolve(token);
        }
      }
    );
  });
}

module.exports = {
  generateJWT,
};
