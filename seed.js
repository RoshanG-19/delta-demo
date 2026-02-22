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

  // ❌ Clear old listings
  await Listing.deleteMany({});

  // 👤 Roshan's existing user ID from Atlas
  const ownerId = new mongoose.Types.ObjectId(
    "6999e3739ed32e1e975d365d"
  );

  // 🌍 Attach owner to ALL listings
  const listingsWithOwner = initData.data.map(obj => ({
    ...obj,
    owner: ownerId
  }));

  await Listing.insertMany(listingsWithOwner);

  console.log("🌱 Listings seeded with Roshan as owner!");
  mongoose.connection.close();
};

initDB();