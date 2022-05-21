const { Router } = require('express');
const { getAll, getCollection } = require('../controllers/search');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/:search', validateJWT, getAll);

router.get('/collection/:table/:search', validateJWT, getCollection);

module.exports = router;
