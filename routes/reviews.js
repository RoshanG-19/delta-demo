const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js')
const {validateReview} = require('../middleware.js')
const {isLoggedIn,isAuthorReview} = require('../middleware.js')
const reviewController = require('../controllers/reviews.js');

router.post('/',validateReview,isLoggedIn,wrapAsync(reviewController.postReview))

router.delete('/:reviewId',isLoggedIn,isAuthorReview,wrapAsync(reviewController.destroyReview))

module.exports = router;
