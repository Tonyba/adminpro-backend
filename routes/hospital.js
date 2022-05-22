const { Router } = require('express');
const { getHospitals, createHospital, updateHospital, deleteHospital } = require('../controllers/hospital');
const router = Router();
const { validateJWT } = require('../middlewares/validate-jwt');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validete-fields');

router.get('/', validateJWT, getHospitals);
router.post('/', [validateJWT, check('name', 'name cannot be empty').not().isEmpty(), validateFields], createHospital);
router.put('/:id', [validateJWT, check('name', 'name cannot be empty').not().isEmpty(), validateFields], updateHospital);
router.delete('/:id', validateJWT, deleteHospital);

module.exports = router;
