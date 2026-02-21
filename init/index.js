const mongoose = require('mongoose');
let {data} = require('./data.js')
const Listing = require('../models/listing.js');

main().then(()=>{console.log('connection succesful')})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

const initDB = async()=>{
     await Listing.deleteMany({});

    data = data.map((obj)=>({...obj,owner:'69877bd2bc4e4c9b99ca3535'}));

     await Listing.insertMany(data);
     console.log("data was initialized");

}

initDB();