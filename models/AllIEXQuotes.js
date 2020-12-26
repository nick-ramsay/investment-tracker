const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AllIEXQuotesSchema = new Schema({
    quotes: { type: Array },
    lastUpdated: { type: Date }
})

const AllIEXQuotes = mongoose.model("AllIEXQuotes", AllIEXQuotesSchema);

module.exports = AllIEXQuotes;