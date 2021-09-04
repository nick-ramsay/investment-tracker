import axios from "axios";

const apiURL = process.env.NODE_ENV === 'production' ? '' : '//localhost:3001'

export default {
    //START: Account APIs...
    sendEmail: function (messageInfo) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/send-email", data: [messageInfo] });
    },
    createAccount: function (newAccountInfo) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/create-account", data: newAccountInfo })
    },
    setEmailVerificationToken: function (email) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/set-email-verification-token", data: { email: email } })
    },
    checkEmailVerificationToken: function (email, emailVerificationToken) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/check-email-verification-token", data: { email: email, emailVerificationToken: emailVerificationToken } })
    },
    deleteEmailVerificationToken: function (email) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/delete-email-verification-token", data: { email: email } })
    },
    checkExistingAccountEmails: function (email) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/check-existing-account-emails", data: [email] });
    },
    setEmailResetCode: function (email, generatedResetToken) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/reset-password-request", data: [email, generatedResetToken] });
    },
    checkEmailAndResetToken: function (email, resetToken) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/check-email-and-reset-token", data: { email: email, resetToken: resetToken } });
    },
    resetPassword: function (email, newPassword) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/reset-password", data: { email: email, newPassword: newPassword } });
    },
    login: function (email, password) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/reset-login", data: { email: email, password: password } });
    },
    setSessionAccessToken: function (id, sessionAccessToken) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/set-session-access-token", data: { id: id, sessionAccessToken: sessionAccessToken } });
    },
    //END: Account APIs...
    //START: Home page APIs...
    fetchAccountDetails: function (id) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/fetch-account-details", data: { id: id } });
    },
    testBackendToken: function () {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/test-backend-token", data: {} });
    },
    createPortfolio: function (newPortfolioName, user_id, created_date) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/create-portfolio", data: { name: newPortfolioName, account_id: user_id, created_date: created_date, balance: 0, investmentCount: 0, cashPercentage: 0, speculativePercentage: 0 } });
    },
    fetchPortfolios: function (user_id) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/fetch-portfolios", data: { account_id: user_id } });
    },
    updatePortfolioSettings: function (PortfolioID, userToken, portfolioName, portfolioBalance, targetInvestmentCount, cashPercentage, speculativePercentage, datePortfolioOpened) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/update-portfolio-settings", data: { portfolioID: PortfolioID, userToken: userToken, portfolioName: portfolioName, portfolioBalance: Number(portfolioBalance), targetInvestmentCount: Number(targetInvestmentCount), cashPercentage: Number(cashPercentage / 100), speculativePercentage: Number(speculativePercentage / 100), datePortfolioOpened: datePortfolioOpened } })
    },
    updateInvestmentReason: function (PortfolioID, userToken, symbol, currentReason, currentForeverHold, queuedForPurchase) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/update-investment-reason", data: { portfolioID: PortfolioID, userToken: userToken, symbol: symbol, currentReason: currentReason, currentForeverHold: currentForeverHold, queuedForPurchase: queuedForPurchase } })
    },
    fetchPortfolioData: function (portfolio_id, user_id) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/fetch-portfolio-data", data: { portfolioId: portfolio_id, accountId: user_id } });
    },
    //END: Home page APIs...
    addInvestment: function (portfolio_id, user_id, new_investment) {
        console.log(user_id)
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/add-investment", data: { portfolioId: portfolio_id, accountId: user_id, newInvestment: new_investment } });
    },
    updateInvestment: function (portfolio_id, user_id, updated_investment_data) {
        console.log(user_id)
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/update-investment", data: { portfolioId: portfolio_id, accountId: user_id, updatedInvestmentData: updated_investment_data } });
    },
    addLabel: function (portfolio_id, user_id, new_label_data) {
        console.log(user_id);
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/add-label", data: { portfolioId: portfolio_id, accountId: user_id, newLabelData: new_label_data } });
    },
    editLabels: function (portfolio_id, user_id, new_label_data) {
        console.log(user_id);
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/edit-labels", data: { portfolioId: portfolio_id, accountId: user_id, newLabelData: new_label_data } });
    },
    stopWatchingInvestment: function (portfolio_id, user_id, investment_symbol, stop_watching_boolean) {
        console.log(investment_symbol);
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/stop-watching-investment", data: { portfolioId: portfolio_id, accountId: user_id, investment_symbol: investment_symbol, stopWatchingBoolean: stop_watching_boolean } });
    },
    investmentTransaction: function (portfolio_id, user_id, investment_symbol, transaction, longTermHold, speculativeHold) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/investment-transaction", data: { portfolioId: portfolio_id, accountId: user_id, investmentSymbol: investment_symbol, transaction: transaction, longTermHold: longTermHold, speculativeHold: speculativeHold } });
    },
    investmentStatus: function (portfolio_id, user_id, investment_symbol, status) {
        console.log(status);
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/investment-status", data: { portfolioId: portfolio_id, accountId: user_id, investmentSymbol: investment_symbol, investmentStatus: status } });
    },
    generateInvestmentData: function (portfolio_id, user_id, investment_data) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/generate-investment-data", data: { portfolioId: portfolio_id, accountId: user_id, investmentData: investment_data } });
    },
    generateTargetPriceData: function (portfolio_id, user_id, investment_data) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/generate-target-price-data", data: { portfolioId: portfolio_id, accountId: user_id, investmentData: investment_data } });
    },
    //END: Home Page APIs...
    //START: Value Search APIs...
    fetchValueSearchData: function () {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/fetch-value-search-data", data: {} });
    }
    //END: Value Search APIs...
};