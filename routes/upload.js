const { Router } = require('express');
const { uploadFile, getFile } = require('../controllers/upload');
const { validateJWT } = require('../middlewares/validate-jwt');
const router = Router();
const expressFileUpload = require('express-fileupload');

router.use(expressFileUpload());

router.put('/:type/:id', validateJWT, uploadFile);

router.get('/:type/:file', getFile);

module.exports = router;
