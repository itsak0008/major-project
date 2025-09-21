const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js"); // <-- yahan sahi path

main().then((res) => {
    console.log("connection successfull")
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDb = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: '68c46e1729dab326fb48b853' }))
    await Listing.insertMany(initData.data);
    console.log("data was initialized")
}

initDb();