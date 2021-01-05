const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ValueSearchesSchema = new Schema({
    symbol: { type: String },
    quote: { type: Object },
    price: { type: Number, default: null },
    targetPrice: { type: Number, default: null },
    numberOfAnalysts: { type: Number, default: null },
    targetPercentage: { type: Number, default: null },
    type: { type: String },
    region: { type: String },
    exchange: { type: String },
    exchangeName: { type: String },
    week52Range: { type: Number, default: null },
    debtEquity: { type: Number, default: null},
    priceToBook: { type: Number, default: null},
    lastUpdated: { type: Date }
})

const ValueSearches = mongoose.model("ValueSearches", ValueSearchesSchema);

module.exports = ValueSearches;