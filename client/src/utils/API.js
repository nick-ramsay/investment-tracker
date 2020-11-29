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
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/set-email-verification-token", data: {email: email} })
    },
    checkExistingAccountEmails: function (email) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/check-existing-account-emails", data: [email] });
    },
    setEmailResetCode: function (email, generatedResetToken) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/reset-password-request", data: [email, generatedResetToken] });
    },
    checkEmailAndResetToken: function (email, resetToken) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/check-email-and-reset-token", data: {email:email, resetToken:resetToken} });
    },
    resetPassword: function (email, newPassword) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/reset-password", data: {email: email, newPassword: newPassword} });
    },
    login: function (email, password) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/reset-login", data: {email: email, password: password} });
    },
    setSessionAccessToken: function (id, sessionAccessToken) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/set-session-access-token", data: {id: id, sessionAccessToken: sessionAccessToken} });
    },
    //END: Account APIs...
    //START: Home page APIs...
    fetchAccountDetails: function (id) {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/fetch-account-details", data: {id:id} });
    },
    testBackendToken: function () {
        return axios({ method: "post", url: apiURL + "/api/investment-tracker/test-backend-token", data: {}});
    }
    //END: Home page APIs...
};