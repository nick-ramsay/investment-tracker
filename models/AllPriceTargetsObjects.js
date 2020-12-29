const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AllPriceTargetsObjectsSchema = new Schema({
    priceTargetLastUpdated: {type: Date},
    priceTargets: {type: Array}
})

const AllPriceTargetsObjects = mongoose.model("AllPriceTargetsObjects", AllPriceTargetsObjectsSchema);

module.exports = AllPriceTargetsObjects;