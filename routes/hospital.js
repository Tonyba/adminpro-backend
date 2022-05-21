const { Router } = require('express');
const { getHospitals, createHospital, updateHospital, deleteHospital } = require('../controllers/hospital');
const router = Router();
const { validateJWT } = require('../middlewares/validate-jwt');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validete-fields');

router.get('/', validateJWT, getHospitals);
router.post(
  '/',
  [validateJWT, check('name', 'the name cannot be empty').not().isEmpty(), check('user', 'user id must be valid').isMongoId(), validateFields],
  createHospital
);
router.put('/:id', validateJWT, updateHospital);
router.delete('/:id', validateJWT, deleteHospital);

module.exports = router;
