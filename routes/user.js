const { Router } = require('express');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/user');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validete-fields');
const { validateJWT, validateAdmin, validateAdmin_or_SameUser } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/', validateJWT, getUsers);
router.post(
  '/register',
  [
    check('name', 'name cannot be empty').not().isEmpty(),
    check('password', 'password cannot be empty').not().isEmpty(),
    check('email', 'enter a valid email').isEmail(),
    validateFields,
  ],
  createUser
);
router.put(
  '/:id',
  [
    validateJWT,
    validateAdmin_or_SameUser,
    check('name', 'name cannot be empty').not().isEmpty(),
    check('email', 'enter a valid email').isEmail(),
    check('role', 'role cannot be empty').not().isEmpty(),
    validateFields,
  ],
  updateUser
);

router.delete('/:id', [validateJWT, validateAdmin], deleteUser);

module.exports = router;
