const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { getMedics, createMedic, updateMedic, deleteMedic } = require('../controllers/medics');
const { validateJWT } = require('../middlewares/validate-jwt');
const { validateFields } = require('../middlewares/validete-fields');

router.get('/', validateJWT, getMedics);
router.post(
  '/',
  [
    validateJWT,
    check('name', 'name cannot be empty').not().isEmpty(),
    check('hospital', 'hospital id must be valid').isMongoId(),
    check('user', 'user id must be valid').isMongoId(),
    validateFields,
  ],
  createMedic
);
router.put('/:id', validateJWT, updateMedic);
router.delete('/:id', validateJWT, deleteMedic);

module.exports = router;
