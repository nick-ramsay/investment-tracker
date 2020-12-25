const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IEXCloudSymbolsSchema = new Schema({
    symbols: { type: Array },
    lastUpdated: { type: Date }
})

const IEXCloudSymbols = mongoose.model("IEXCloudSymbols", IEXCloudSymbolsSchema);

module.exports = IEXCloudSymbols;