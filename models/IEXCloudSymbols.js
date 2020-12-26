const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IEXCloudSymbolsSchema = new Schema({
    symbolsLastUpdated: { type: Date },
    symbols: { type: Array },
    rawQuoteDataLastUpdated: { type: Date },
    rawQuoteData: {type: Array},
    valueSearchLastUpdated: {type: Date},
    valueSearchData: {type: Array}
})

const IEXCloudSymbols = mongoose.model("IEXCloudSymbols", IEXCloudSymbolsSchema);

module.exports = IEXCloudSymbols;