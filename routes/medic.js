const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { getMedics, createMedic, updateMedic, deleteMedic, getMedic } = require('../controllers/medics');
const { validateJWT } = require('../middlewares/validate-jwt');
const { validateFields } = require('../middlewares/validete-fields');

router.get('/', validateJWT, getMedics);
router.get('/:id', validateJWT, getMedic);
router.post(
  '/',
  [validateJWT, check('name', 'name cannot be empty').not().isEmpty(), check('hospital', 'hospital id must be valid').isMongoId(), validateFields],
  createMedic
);
router.put(
  '/:id',
  [validateJWT, check('name', 'name cannot be empty').not().isEmpty(), check('hospital', 'hospital id must be valid').isMongoId(), validateFields],
  updateMedic
);
router.delete('/:id', validateJWT, deleteMedic);

module.exports = router;
