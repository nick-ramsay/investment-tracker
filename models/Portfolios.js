const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PortfoliosSchema = new Schema({
    name: { type: String },
    account_id: {type: String},
    investments: { type: Array },
    created_date: { type: Date },
    targetPricesUpdated: {type: Date}
})

const Portfolios = mongoose.model("Portfolios", PortfoliosSchema);

module.exports = Portfolios;