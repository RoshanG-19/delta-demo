const mongoose = require("mongoose");
const Listing = require("./models/listing");
const initData = require("./init/data");
require("dotenv").config();


async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);
}

main()
  .then(() => console.log("✅ Connected to Atlas"))
  .catch((err) => console.log(err));

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("🌱 Database Seeded Successfully!");
  mongoose.connection.close();
};

initDB();