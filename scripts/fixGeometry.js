require("dotenv").config({ path: "../.env" });

const mongoose = require("mongoose");
const Listing = require("../models/listing"); // adjust path
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const geocodingClient = mbxGeocoding({
  accessToken: process.env.MAP_TOKEN,
});

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust ");

async function fixGeometry() {

  const listings = await Listing.find({
    $or: [
      { geometry: { $exists: false } },
      { "geometry.coordinates": { $size: 0 } }
    ]
  });

  console.log("Listings to fix:", listings.length);

  for (let listing of listings) {

    const response = await geocodingClient.forwardGeocode({
      query: listing.location,
      limit: 1,
    }).send();

    const geoData = response.body.features[0];

    if (geoData) {
      listing.geometry = geoData.geometry;
      await listing.save();
      console.log("Updated:", listing.title);
    } else {
      console.log("❌ No result:", listing.location);
    }
  }

  console.log("DONE 🎉");
  mongoose.connection.close();
}

fixGeometry();