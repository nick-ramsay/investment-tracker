const router = require("express").Router();
const rmtRoutes = require("./rmtRoutes");

// react-mongo-template routes
router.use("/react-mongo-template", rmtRoutes);

module.exports = router;