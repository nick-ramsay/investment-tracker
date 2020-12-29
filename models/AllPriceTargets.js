const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AllPriceTargetsSchema = new Schema({
    priceTargetLastUpdated: {type: Date},
    symbol: {type: String},
    priceTarget: {type: Object}
})

const AllPriceTargets = mongoose.model("AllPriceTargets", AllPriceTargetsSchema);

module.exports = AllPriceTargets;