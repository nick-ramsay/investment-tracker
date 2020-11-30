const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Portfolios = new Schema({
    name: { type: String },
    investments: { type: Array },
    created_date: { type: Date }
})

const Portfolios = mongoose.model("Portfolios", PortfoliosSchema);

module.exports = Portfolios;