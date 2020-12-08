const router = require("express").Router();
const investmentTrackerController = require("../../controllers/investmentTrackerController");

router
  .route("/send-email")
  .post(investmentTrackerController.sendEmail);

router
  .route("/set-email-verification-token")
  .post(investmentTrackerController.setEmailVerficationToken)

router
  .route("/create-account")
  .post(investmentTrackerController.createAccount);

router
  .route("/check-existing-account-emails")
  .post(investmentTrackerController.checkExistingAccountEmails);

router
  .route("/reset-password-request")
  .post(investmentTrackerController.resetPasswordRequest);

router
  .route("/check-email-and-reset-token")
  .post(investmentTrackerController.checkEmailAndToken);

router
  .route("/reset-password")
  .post(investmentTrackerController.resetPassword);

router
  .route("/reset-login")
  .post(investmentTrackerController.login);

router
  .route("/set-session-access-token")
  .post(investmentTrackerController.setSessionAccessToken);

router
  .route("/fetch-account-details")
  .post(investmentTrackerController.fetchAccountDetails);

router
  .route("/test-backend-token")
  .post(investmentTrackerController.testBackendToken);

router
  .route("/create-portfolio")
  .post(investmentTrackerController.createPortfolio);

router
  .route("/fetch-portfolios")
  .post(investmentTrackerController.fetchPortfolios);

router
  .route("/fetch-portfolio-data")
  .post(investmentTrackerController.fetchPortfolioData);

router
  .route("/add-investment")
  .post(investmentTrackerController.addInvestment);

router
  .route("/update-investment")
  .post(investmentTrackerController.updateInvestment);

  router
  .route("/investment-transaction")
  .post(investmentTrackerController.investmentTransaction);

module.exports = router;
