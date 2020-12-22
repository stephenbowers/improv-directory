const express = require('express');
const router = express.Router();
const theaters = require('../controllers/theaters');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateTheater } = require('../middleware');
const Theater = require('../models/theater');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(theaters.index))
    .post(isLoggedIn, upload.array('image'), validateTheater, catchAsync(theaters.createTheater));

router.get('/new', isLoggedIn, theaters.renderNewForm);

router.route('/:id')
    .get(catchAsync(theaters.showTheater))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateTheater, catchAsync(theaters.updateTheater))
    .delete(isLoggedIn, isAuthor, catchAsync(theaters.deleteTheater));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(theaters.renderEditForm));

module.exports = router;