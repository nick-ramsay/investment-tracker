const router = require("express").Router();
const rmtControllers = require("../../controllers/rmtControllers");

router
  .route("/create-message")
  .post(rmtControllers.createMessage);

router
  .route("/find-all-messages")
  .post(rmtControllers.findAllMessages);

router
  .route("/delete-one-message")
  .post(rmtControllers.deleteOneMessage);

module.exports = router;
