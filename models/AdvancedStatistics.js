const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdvancedStatisticsSchema = new Schema({
    statLastUpdated: { type: Date },
    symbol: { type: String },
    stats: {type: Array}
})

const AdvancedStatistics = mongoose.model("AdvancedStatistics", AdvancedStatisticsSchema);

module.exports = AdvancedStatistics;