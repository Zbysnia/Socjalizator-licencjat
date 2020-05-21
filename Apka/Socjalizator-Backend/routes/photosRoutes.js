const express = require('express');

const router = express.Router();

const PhotoController = require('..//controllers/photos');
const AuthHelper = require('..//helpers/AuthHelper');

router.post('/upload-photos', AuthHelper.VerifyToken, PhotoController.UploadPhoto);


module.exports = router;