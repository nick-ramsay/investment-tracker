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
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/create-portfolio", data: { name: newPortfolioName, account_id: user_id, created_date: created_date } });
    },
    fetchPortfolios: function (user_id) {
        console.log(user_id)
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/fetch-portfolios", data: { account_id: user_id } });
    },
    //END: Home page APIs...
    fetchPortfolioData: function (portfolio_id, user_id) {
        console.log(user_id)
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/fetch-portfolio-data", data: { portfolioId: portfolio_id, accountId: user_id } });
    },
    addInvestment: function (portfolio_id, user_id, new_investment) {
        console.log(user_id)
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/add-investment", data: { portfolioId: portfolio_id, accountId: user_id, newInvestment: new_investment } });
    },
    updateInvestment: function (portfolio_id, user_id, updated_investment_data) {
        console.log(user_id)
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/update-investment", data: { portfolioId: portfolio_id, accountId: user_id, updatedInvestmentData: updated_investment_data } });
    },
    investmentTransaction: function (portfolio_id, user_id, investment_symbol, transaction) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/investment-transaction", data: { portfolioId: portfolio_id, accountId: user_id, investmentSymbol: investment_symbol, transaction: transaction } });
    }

};