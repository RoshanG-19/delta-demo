const Listing = require('./models/listing');
const Review = require('./models/reviews.js')
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema} = require('./schema.js');
const {reviewSchema} = require('./schema.js');


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
       if(req.method == 'GET'){
         req.session.redirectUrl = req.originalUrl;
       }

        req.flash('error','you must login before');
        return res.redirect('/login');
    }
   return next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner =async (req,res,next)=>{
    let {id} = req.params;
    let listings = await Listing.findById(id);
    if( !listings.owner._id.equals(res.locals.currentUser._id)){
        req.flash('error',"you dont't have permission to edit");
        return  res.redirect(`/listings/${id}`);
    }
   return next();
}

module.exports.isAuthorReview =async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if( !review.author.equals(res.locals.currentUser._id)){
        req.flash('error',"you haven't posted review");
        return  res.redirect(`/listings/${id}`);
    }
   return next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        return next(new ExpressError(400,errMsg));
    }
    return next()
}

module.exports.validateReview =  (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        return next(new ExpressError(400,errMsg));
    }
     return   next()
}