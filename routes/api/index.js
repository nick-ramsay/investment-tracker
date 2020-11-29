const router = require("express").Router();
const investmentTrackerRoutes = require("./investmentTrackerRoutes");

// investment-tracker routes
router.use("/investment-tracker", investmentTrackerRoutes);

module.exports = router;