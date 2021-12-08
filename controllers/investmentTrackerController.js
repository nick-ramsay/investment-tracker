const db = require("../models");

require('dotenv').config();

const mongoose = require('mongoose');
const pLimit = require('p-limit');
const axios = require('axios');
const moment = require('moment');
const sha256 = require('js-sha256').sha256;
const { ETrade } = require('e-trade-api');
const sgMail = require('@sendgrid/mail');
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const cheerio = require("cheerio");
const request = require("request-promise");

const fs = require('fs');

const keys = require("../keys");

const limit = pLimit(9);

const gmailClientId = keys.gmail_credentials.gmailClientId;
const gmailClientSecret = keys.gmail_credentials.gmailClientSecret;
const gmailRefreshToken = keys.gmail_credentials.gmailRefreshToken;
const sendGridAPIKey = keys.gmail_credentials.sendGridAPIKey;

const eTrade = new ETrade({
    key: keys.etrade.etradeAPIKey,
    secret: keys.etrade.etradeSecret
});

sgMail.setApiKey(sendGridAPIKey);

const oauth2Client = new OAuth2(
    gmailClientId, // ClientID
    gmailClientSecret, // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: gmailRefreshToken
});

const accessToken = oauth2Client.getAccessToken();

const smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        user: "applications.nickramsay@gmail.com",
        //user: gmailUserId,
        //pass: gmailPassword,
        clientId: gmailClientId,
        clientSecret: gmailClientSecret,
        refreshToken: gmailRefreshToken,
        accessToken: accessToken
    }
});

let useGmail = true;
let useSendgrid = true;

module.exports = {
    sendEmail: function (req, res) {
        console.log("Called send test e-mail controller...");
        //SENDGRID LOGIC BELOW...

        let messageParameters = req.body[0];

        let msg = {
            to: messageParameters.recipientEmail,
            from: 'applications.nickramsay@gmail.com',
            subject: '"' + messageParameters.subject + '" from ' + messageParameters.senderName + ' via SendGrid',
            text: messageParameters.message,
            html: '<strong>' + messageParameters.message + '</strong>'
        };

        if (useSendgrid) {
            sgMail.send(msg);
        }

        //GMAIL CREDENTIALS BELOW...

        let mailOptions = {
            from: 'applications.nickramsay@gmail.com',
            to: messageParameters.recipientEmail,
            subject: '"' + messageParameters.subject + '" from ' + messageParameters.senderName,
            text: messageParameters.message
        };

        if (useGmail) {
            smtpTransport.sendMail(mailOptions, (error, response) => {
                error ? console.log(error) : console.log(response);
                smtpTransport.close();
            });
        }
    },
    createAccount: function (req, res) {
        console.log("Called Create Account controller");
        db.Accounts
            .create(req.body)
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    checkExistingAccountEmails: function (req, res) {
        console.log("Called check accounts controller...");
        db.Accounts
            .find({ email: req.body[0] }, { email: 1, _id: 0 }).sort({})
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    setEmailVerficationToken: function (req, res) {
        console.log("Called check set e-mail verification token controller...");
        let email = req.body.email;
        let emailVerificationToken = Math.floor((Math.random() * 999999) + 100000).toString();

        db.AccountCreationRequests
            .replaceOne({ email: email }, { email: email, emailVerificationToken: emailVerificationToken }, { upsert: true })
            .then(dbModel => {
                res.json(dbModel[0]),
                    smtpTransport.sendMail({
                        from: 'applications.nickramsay@gmail.com',
                        to: email,
                        subject: "Investment Tracker: Your Email Verification Code",
                        text: "Your Investment Tracker e-mail verification code is: " + emailVerificationToken
                    }, (error, response) => {
                        error ? console.log(error) : console.log(response);
                        smtpTransport.close();
                    })
            })
            .catch(err => res.status(422).json(err));
    },
    checkEmailVerificationToken: function (req, res) {
        console.log("Called checkEmailVerificationController controller...");

        db.AccountCreationRequests
            .find({ email: req.body.email, emailVerificationToken: req.body.emailVerificationToken }, { email: 1 })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err))
    },
    deleteEmailVerificationToken: function (req, res) {
        console.log("Called deleteEmailVerificationController controller...");

        db.AccountCreationRequests
            .remove({ email: req.body.email })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err))
    },
    resetPasswordRequest: function (req, res) {
        console.log("Called reset password request controller...");
        let resetToken = Math.floor((Math.random() * 999999) + 100000).toString();

        db.Accounts
            .updateOne({ email: req.body[0] }, { passwordResetToken: sha256(resetToken) })
            .then(dbModel => {
                res.json(dbModel[0]),
                    smtpTransport.sendMail({
                        from: 'applications.nickramsay@gmail.com',
                        to: req.body[0],
                        subject: "Your Investment Tracker Password Reset Code",
                        text: "Your Investment Tracker password reset code is: " + resetToken
                    }, (error, response) => {
                        error ? console.log(error) : console.log(response);
                        smtpTransport.close();
                    })
            })
            .catch(err => res.status(422).json(err));
    },
    checkEmailAndToken: function (req, res) {
        console.log("Called check email and token controller...");

        db.Accounts
            .find({ email: req.body.email, passwordResetToken: req.body.resetToken }, { email: 1 })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    resetPassword: function (req, res) {
        console.log("Called reset password controller...");

        db.Accounts
            .updateOne({ email: req.body.email }, { password: req.body.newPassword, passwordResetToken: null })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    login: function (req, res) {
        console.log("Called login controller...");

        db.Accounts
            .find({ email: req.body.email, password: req.body.password }, { _id: 1 })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    setSessionAccessToken: function (req, res) {
        console.log("Called session token set controller...");

        let sessionAccessToken = Math.floor((Math.random() * 999999) + 100000).toString();

        db.Accounts
            .updateOne({ _id: req.body.id }, { sessionAccessToken: sha256(sessionAccessToken) })
            .then(dbModel => {
                res.json({
                    dbModel: dbModel[0],
                    sessionAccessToken: sha256(sessionAccessToken)
                });
            })
            .catch(err => res.status(422).json(err));
    },
    fetchAccountDetails: function (req, res) {
        console.log("Called fetch account details controller...");

        db.Accounts
            .find({ _id: req.body.id }, { password: 0, sessionAccessToken: 0, passwordResetToken: 0, _id: 0 }).sort({})
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    testBackendToken: function (req, res) {
        console.log("Called test token controller...");
        var testToken;
        testToken = Math.floor(Math.random() * 100000);
        var testJSON = { body: testToken };
        res.json(testJSON);
    },
    createPortfolio: function (req, res) {
        console.log("Called Create Portfolio controller...");
        db.Portfolios
            .create(req.body)
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    fetchPortfolios: function (req, res) {
        console.log("Called fetch portfolios controller...");
        db.Portfolios
            .find({ account_id: req.body.account_id })
            .sort({ created_date: 1 })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    updatePortfolioSettings: function (req, res) {
        console.log("Called update portfolio settings controller...");
        console.log(req.body);
        db.Portfolios
            .updateOne(
                { _id: req.body.portfolioID, account_id: req.body.userToken },
                { name: req.body.portfolioName, balance: req.body.portfolioBalance, investmentCount: req.body.targetInvestmentCount, cashPercentage: req.body.cashPercentage, speculativePercentage: req.body.speculativePercentage, datePortfolioOpened: req.body.datePortfolioOpened },
                { upsert: true }
            )
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    updateInvestmentReasons: function (req, res) {
        console.log("Called update investment reason controllers...");

        console.log(req.body);

        db.Portfolios
            .updateOne({ _id: req.body.portfolioID, "investments.symbol": req.body.symbol },
                {
                    $set: { "investments.$.currentReason": req.body.currentReason, "investments.$.currentForeverHold": req.body.currentForeverHold, "investments.$.queuedForPurchase": req.body.queuedForPurchase, "investments.$.status": req.body.currentStatus }
                },
                {
                    upsert: true
                }
            )
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    addInvestment: function (req, res) {
        console.log("Called addInvestment Controller...");

        db.Portfolios
            .updateOne(
                { _id: req.body.portfolioId, account_id: req.body.accountId },
                { $push: { investments: req.body.newInvestment } }
            )
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    fetchPortfolioData: function (req, res) {
        console.log("Called fetch portfolio data controller...");

        db.Portfolios
            .find({ _id: req.body.portfolioId, account_id: req.body.accountId })
            .sort({ name: 1 })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    updateInvestment: function (req, res) {
        console.log("Called update investment controller...");
        console.log(req.body.updatedInvestmentData);

        db.Portfolios
            .updateOne({ _id: req.body.portfolioId, "investments.symbol": req.body.updatedInvestmentData.symbol },
                {
                    $set: { "investments.$.name": req.body.updatedInvestmentData.name, "investments.$.price": Number(req.body.updatedInvestmentData.price), "investments.$.price_target": Number(req.body.updatedInvestmentData.price_target), "investments.$.target_percentage": Number(req.body.updatedInvestmentData.price / req.body.updatedInvestmentData.price_target), "investments.$.manual_price_target": req.body.updatedInvestmentData.manual_price_target }
                }
            )
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    addLabel: function (req, res) {
        console.log("Called add label controller...");
        console.log(req.body.newLabelData);

        db.Portfolios
            .updateOne({ _id: req.body.portfolioId, "investments.symbol": req.body.newLabelData.symbol },
                {
                    $push: { "investments.$.labels": req.body.newLabelData.label }
                }
            )
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    editLabels: function (req, res) {
        console.log("Called edit label controller...");
        console.log(req.body.newLabelData);

        db.Portfolios
            .updateOne({ _id: req.body.portfolioId, "investments.symbol": req.body.newLabelData.symbol },
                {
                    $set: { "investments.$.labels": req.body.newLabelData.labels }
                }
            )
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    stopWatchingInvestment: function (req, res) {
        console.log("Called stopWatchingInvestment controller...");

        db.Portfolios
            .updateOne({ _id: req.body.portfolioId, "investments.symbol": req.body.investment_symbol },
                {
                    $set: { "investments.$.stopWatching": req.body.stopWatchingBoolean }
                }
            )
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    investmentTransaction: function (req, res) {
        console.log("Called investmentTransaction controller...");

        db.Portfolios
            .updateOne({ _id: req.body.portfolioId, account_id: req.body.accountId, "investments.symbol": req.body.investmentSymbol },
                {
                    $set: { "investments.$.purchased": req.body.transaction, "investments.$.longTermHold": req.body.longTermHold, "investments.$.speculativeHold": req.body.speculativeHold }
                }
            )
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },

    investmentStatus: function (req, res) {
        console.log("Called investmentStatus controller...");

        db.Portfolios
            .updateOne({ _id: req.body.portfolioId, account_id: req.body.accountId, "investments.symbol": req.body.investmentSymbol },
                {
                    $set: { "investments.$.status": req.body.investmentStatus }
                }
            )
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    generateInvestmentData: function (req, res) {
        console.log("Called update generateInvestmentData controller...");

        const databaseUpdateComplete = () => {
            res.send("Investment Prices Updated...");
        }

        let portfolioID = req.body.portfolioId;
        let accountID = req.body.accountId;
        let investmentData = req.body.investmentData;

        let apiURLs = [];
        let promises = [];
        let symbolString;


        for (let i = 0; i < investmentData.length; i++) {
            symbolString = "";
            for (let j = 0; j < investmentData[i].length; j++) {
                symbolString += (j !== 0 ? "," : "") + investmentData[i][j].symbol;
            }
            apiURLs.push("https://cloud.iexapis.com/stable/stock/market/batch?types=quote&symbols=" + symbolString + "&token=" + keys.iex_credentials.apiKey)
        }

        apiURLs.forEach(apiURL =>
            promises.push(
                axios.get(apiURL)
            )
        )

        Promise.all(promises).then(response => {

            for (let i = 0; i < investmentData.length; i++) {
                for (let j = 0; j < investmentData[i].length; j++) {
                    let currentInvestmentData = investmentData[i][j];
                    let iexCurrentInvestmentData = response[i].data[investmentData[i][j].symbol].quote;

                    if (iexCurrentInvestmentData && iexCurrentInvestmentData !== null) {
                        db.Portfolios
                            .updateOne({ _id: portfolioID, account_id: accountID, "investments.symbol": currentInvestmentData.symbol },
                                {
                                    $set: { "investments.$.name": iexCurrentInvestmentData.companyName, "investments.$.price": iexCurrentInvestmentData.latestPrice, "investments.$.yearlyLow": iexCurrentInvestmentData.week52Low, "investments.$.yearlyHigh": iexCurrentInvestmentData.week52High, "investments.$.peRatio": iexCurrentInvestmentData.peRatio, "investments.$.dailyChange": ((iexCurrentInvestmentData.latestPrice / iexCurrentInvestmentData.previousClose) - 1), "investments.$.target_percentage": Number(Number(iexCurrentInvestmentData.latestPrice) / currentInvestmentData.target_price), "investments.$.previous_close":Number(iexCurrentInvestmentData.previousClose) }
                                }
                            )
                            .then(dbModel => { dbModel })
                            .catch(err => console.log(err))
                    }
                }
            };
            databaseUpdateComplete();
        }).catch(err => console.log(err));
    },
    generateTargetPriceData: function (req, res) {
        console.log("Called update generateTargetPriceData controller...");

        const databaseUpdateComplete = () => {
            res.send("Investment Targets Updated...");
        }

        let portfolioID = req.body.portfolioId;
        let accountID = req.body.accountId;
        let investmentData = req.body.investmentData;

        let apiURLs = [];
        let promises = [];
        let symbolString;

        for (let i = 0; i < investmentData.length; i++) {
            symbolString = "";
            for (let j = 0; j < investmentData[i].length; j++) {
                symbolString += (j !== 0 ? "," : "") + investmentData[i][j].symbol;
            }
            apiURLs.push("https://cloud.iexapis.com/stable/stock/market/batch?types=price-target&symbols=" + symbolString + "&token=" + keys.iex_credentials.apiKey)
        }

        apiURLs.forEach(apiURL =>
            promises.push(
                axios.get(apiURL)
            )
        )

        Promise.all(promises).then(response => {
            db.Portfolios
                .updateOne({ _id: portfolioID, account_id: accountID }, { targetPricesUpdated: new Date() })
                .then(dbModel => { dbModel })
                .catch(err => console.log(err));

            for (let i = 0; i < investmentData.length; i++) {
                for (let j = 0; j < investmentData[i].length; j++) {
                    let currentInvestmentData = investmentData[i][j];
                    let iexCurrentInvestmentData = response[i].data[investmentData[i][j].symbol]["price-target"];

                    if (iexCurrentInvestmentData && iexCurrentInvestmentData !== null) {
                        db.Portfolios
                            .updateOne({ _id: portfolioID, account_id: accountID, "investments.symbol": currentInvestmentData.symbol },
                                {
                                    $set: { "investments.$.price_target": iexCurrentInvestmentData.priceTargetAverage, "investments.$.lastUpdated": new Date(), "investments.$.numberOfAnalysts": iexCurrentInvestmentData.numberOfAnalysts, "investments.$.target_percentage": Number(Number(currentInvestmentData.price) / iexCurrentInvestmentData.priceTargetAverage) }
                                }
                            )
                            .then(dbModel => { dbModel })
                            .catch(err => console.log(err))

                    }
                }
            };
            databaseUpdateComplete();
        }).catch(err => console.log(err));
    },
    syncWithEtrade: (req, res) => {
        console.log("Called syncWithEtrade controller...");
        console.log(req.body);
        (async () => {
            try {
                const requestTokenResults = await eTrade.requestToken();

                // Visit url, authorize application, copy/paste code below

                const accessTokenResults = await eTrade.getAccessToken({
                    key: requestTokenResults.oauth_token,
                    secret: requestTokenResults.oauth_token_secret,
                    code: 'code from requestTokenResults.url'
                });

                eTrade.settings.accessToken = accessTokenResults.oauth_token;
                eTrade.settings.accessSecret = accessTokenResults.oauth_token_secret;

                let results = await eTrade.listAccounts();

                console.log(results[0].accountName);
            } catch (err) {
                console.error(err);
            }

        })();
        },
    fetchValueSearchData: (req, res) => {
        db.ValueSearches
            .find({})
            .then(dbModel => res.send(dbModel))
            .catch(err => console.log(err))
    },
    addTransfer: (req, res) => {
        db.Portfolios
            .updateOne(
                { _id: req.body.portfolioId, account_id: req.body.accountId },
                { $push: { transfers: req.body.transferData } },
                { upsert: true }
            )
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    deleteTransfer: (req, res) => {
        console.log("Called deleteTransferController...");
        console.log(req.body);

        db.Portfolios
            .updateOne(
                { _id: req.body.portfolioId, account_id: req.body.accountId },
                { $pull: { transfers: { transferAmount: req.body.transferAmount, transferDate: req.body.transferDate, transferCreatedAt: req.body.transferCreatedAt } } }
            )
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    fetchPerformanceData: (req, res) => {
        console.log("Performance Req: " + req.json);
        console.log("Called fetch performance controller...");
        console.log("Called fetch portfolio data controller...");

        db.Portfolios
            .find({ _id: req.body.portfolioId, account_id: req.body.accountId })
            .sort({ name: 1 })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    }
}