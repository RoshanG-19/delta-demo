const Listing = require('../models/listing.js')
const mapToken = process.env.MAP_TOKEN;
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

module.exports.index = async(req,res)=>{
    const listings = await Listing.find({});
    res.render('listings/index.ejs',{listings});

}

module.exports.renderNewForm = (req,res)=>{
    res.render('listings/new.ejs');
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path:'reviews',populate:{
        path:'author'
    },}).populate('owner');
    if(!listing){
        req.flash('error','Listing does not exits');
        return res.redirect('/listings')
    }
    res.render("listings/show.ejs",{listing});


}
module.exports.createListing = async (req, res, next) => {

  const response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  }).send();

  const geoData = response.body.features[0];

  
  if (!geoData) {
    req.flash("error", "Invalid location. Please enter a valid place.");
    return res.redirect("/listings/new");
  }

  const url = req.file.path;
  const filename = req.file.filename;

  const { listing } = req.body;
  const newList = new Listing(listing);

  newList.owner = req.user._id;
  newList.image = { url, filename };

  newList.geometry = geoData.geometry;

  const savedListing = await newList.save();

  console.log("Saved listing geometry:", savedListing.geometry);

  req.flash("success", "New Listing Added");
  res.redirect(`/listings/${savedListing._id}`);
};

module.exports.renderEditForm = async (req,res)=>{
   let {id} = req.params;
   let listing = await Listing.findById(id);
    if(!listing){
        req.flash('error','Listing does not exits');
        return res.redirect('/listings')
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl= originalImageUrl.replace("/upload",'/upload/h_300,w_250')
   res.render('listings/edit.ejs',{listing, originalImageUrl});

}

module.exports.updateListing = async(req,res)=>{
    let {listing} = req.body;
     if(!listing) {
       return next(new ExpressError(400,'Send Valid data for Listing'));
    }
    let {id} = req.params;
    const geoData = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  }).send();
   const coordinates = geoData.body.features[0].geometry.coordinates;
    let upListing = await Listing.findByIdAndUpdate(id,{
            ...listing,
            geometry: {
                type: "Point",
                coordinates: coordinates
            }
        },{new:true});
    if(typeof req.file !== 'undefined'){
           let url = req.file.path;
            let filename = req.file.filename;
            upListing.image = {url,filename}

            await upListing.save();
    }
    req.flash('Success','Listing Updated');

    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
     req.flash('Success',' Listing Deleted');
    res.redirect('/listings');
}