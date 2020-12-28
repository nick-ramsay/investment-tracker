const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ValueSearchesSchema = new Schema({
    valueSearchLastUpdated: {type: Date},
    valueSearchData: {type: Array}
})

const ValueSearches = mongoose.model("ValueSearches", ValueSearchesSchema);

module.exports = ValueSearches;