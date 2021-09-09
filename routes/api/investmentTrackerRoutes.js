const router = require("express").Router();
const investmentTrackerController = require("../../controllers/investmentTrackerController");

router
  .route("/send-email")
  .post(investmentTrackerController.sendEmail);

router
  .route("/set-email-verification-token")
  .post(investmentTrackerController.setEmailVerficationToken)

router
  .route("/check-email-verification-token")
  .post(investmentTrackerController.checkEmailVerificationToken)

router
  .route("/delete-email-verification-token")
  .post(investmentTrackerController.deleteEmailVerificationToken)

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
  .route("/update-portfolio-settings")
  .post(investmentTrackerController.updatePortfolioSettings);

router
  .route("/update-investment-reason")
  .post(investmentTrackerController.updateInvestmentReasons);

router
  .route("/add-investment")
  .post(investmentTrackerController.addInvestment);

router
  .route("/update-investment")
  .post(investmentTrackerController.updateInvestment);

router
  .route("/add-label")
  .post(investmentTrackerController.addLabel);

router
  .route("/edit-labels")
  .post(investmentTrackerController.editLabels);

router
  .route("/stop-watching-investment")
  .post(investmentTrackerController.stopWatchingInvestment);

router
  .route("/investment-transaction")
  .post(investmentTrackerController.investmentTransaction);

router
  .route("/investment-status")
  .post(investmentTrackerController.investmentStatus);

router
  .route("/generate-investment-data")
  .post(investmentTrackerController.generateInvestmentData);

router
  .route("/generate-target-price-data")
  .post(investmentTrackerController.generateTargetPriceData);

router
  .route("/fetch-value-search-data")
  .post(investmentTrackerController.fetchValueSearchData);

router
  .route("/add-transfer")
  .put(investmentTrackerController.addTransfer);

router
  .route("/delete-transfer")
  .put(investmentTrackerController.deleteTransfer);

router
  .route("/fetch-performance-data")
  .post(investmentTrackerController.fetchPerformanceData)

router
  .route("/sync-with-etrade")
  .put(investmentTrackerController.syncWithEtrade)

module.exports = router;
