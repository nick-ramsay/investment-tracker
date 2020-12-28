const db = require("../models");

require('dotenv').config();

const pLimit = require('p-limit');
const axios = require('axios');
const moment = require('moment');
const sha256 = require('js-sha256').sha256;
const sgMail = require('@sendgrid/mail');
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const keys = require("../keys");

const limit = pLimit(9);

const gmailClientId = keys.gmail_credentials.gmailClientId;
const gmailClientSecret = keys.gmail_credentials.gmailClientSecret;
const gmailRefreshToken = keys.gmail_credentials.gmailRefreshToken;
const sendGridAPIKey = keys.gmail_credentials.sendGridAPIKey;

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
        console.log(req.body);
        db.Accounts
            .find({ email: req.body[0] }, { email: 1, _id: 0 }).sort({})
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    setEmailVerficationToken: function (req, res) {
        console.log("Called check set e-mail verification token controller...");
        let email = req.body.email;
        let emailVerificationToken = Math.floor((Math.random() * 999999) + 100000).toString();
        //console.log(emailVerificationToken);
        //console.log(req.body);
        db.AccountCreationRequests
            .replaceOne({ email: email }, { email: email, emailVerificationToken: emailVerificationToken }, { upsert: true })
            .then(dbModel => {
                res.json(dbModel[0]),
                    smtpTransport.sendMail({
                        from: 'applications.nickramsay@gmail.com',
                        to: email,
                        subject: "Your Email Verification Code",
                        text: "Your e-mail verification code is: " + emailVerificationToken
                    }, (error, response) => {
                        error ? console.log(error) : console.log(response);
                        smtpTransport.close();
                    })
            })
            .catch(err => res.status(422).json(err));
    },
    checkEmailVerificationToken: function (req, res) {
        console.log("Called checkEmailVerificationController controller...");
        console.log(req.body);
        db.AccountCreationRequests
            .find({ email: req.body.email, emailVerificationToken: req.body.emailVerificationToken }, { email: 1 })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err))
    },
    deleteEmailVerificationToken: function (req, res) {
        console.log("Called deleteEmailVerificationController controller...");
        console.log(req.body);
        db.AccountCreationRequests
            .remove({ email: req.body.email })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err))
    },
    resetPasswordRequest: function (req, res) {
        console.log("Called reset password request controller...");
        let resetToken = Math.floor((Math.random() * 999999) + 100000).toString();
        console.log(resetToken);

        db.Accounts
            .updateOne({ email: req.body[0] }, { passwordResetToken: sha256(resetToken) })
            .then(dbModel => {
                res.json(dbModel[0]),
                    smtpTransport.sendMail({
                        from: 'applications.nickramsay@gmail.com',
                        to: req.body[0],
                        subject: "Your Password Reset Code",
                        text: "Your password reset code is: " + resetToken
                    }, (error, response) => {
                        error ? console.log(error) : console.log(response);
                        smtpTransport.close();
                    })
            })
            .catch(err => res.status(422).json(err));
    },
    checkEmailAndToken: function (req, res) {
        console.log("Called check email and token controller...");
        console.log(req.body);
        db.Accounts
            .find({ email: req.body.email, passwordResetToken: req.body.resetToken }, { email: 1 })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    resetPassword: function (req, res) {
        console.log("Called reset password controller...");
        console.log(req.body);
        db.Accounts
            .updateOne({ email: req.body.email }, { password: req.body.newPassword, passwordResetToken: null })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    login: function (req, res) {
        console.log("Called login controller...");
        console.log(req.body);

        db.Accounts
            .find({ email: req.body.email, password: req.body.password }, { _id: 1 })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    setSessionAccessToken: function (req, res) {
        console.log("Called session token set controller...");
        console.log(req.body);

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
        console.log(req.body);
        db.Accounts
            .find({ _id: req.body.id }, { password: 0, sessionAccessToken: 0, passwordResetToken: 0, _id: 0 }).sort({})
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    testBackendToken: function (req, res) {
        console.log("Called test token controller!");
        var testToken;
        testToken = Math.floor(Math.random() * 100000);
        var testJSON = { body: testToken };
        res.json(testJSON);
    },
    createPortfolio: function (req, res) {
        console.log("Called Create Portfolio controller");
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
    addInvestment: function (req, res) {
        console.log("Called addInvestment Controller...");
        console.log(req.body);
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
        console.log(req.body);
        db.Portfolios
            .find({ _id: req.body.portfolioId, account_id: req.body.accountId })
            .sort({ name: 1 })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    updateInvestment: function (req, res) {
        console.log("Called update investment controller...");
        console.log(req.body);

        db.Portfolios
            .updateOne({ _id: req.body.portfolioId, "investments.symbol": req.body.updatedInvestmentData.symbol },
                {
                    $set: { "investments.$.name": req.body.updatedInvestmentData.name, "investments.$.price": Number(req.body.updatedInvestmentData.price), "investments.$.price_target": Number(req.body.updatedInvestmentData.price_target), "investments.$.target_percentage": Number(req.body.updatedInvestmentData.price / req.body.updatedInvestmentData.price_target) }
                }
            )
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    investmentTransaction: function (req, res) {
        console.log("Called update investment controller...");
        console.log(req.body);

        db.Portfolios
            .updateOne({ _id: req.body.portfolioId, account_id: req.body.accountId, "investments.symbol": req.body.investmentSymbol },
                {
                    $set: { "investments.$.purchased": req.body.transaction, "investments.$.longTermHold": req.body.longTermHold }
                }
            )
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
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

                    console.log(iexCurrentInvestmentData);

                    if (iexCurrentInvestmentData && iexCurrentInvestmentData !== null) {
                        db.Portfolios
                            .updateOne({ _id: portfolioID, account_id: accountID, "investments.symbol": currentInvestmentData.symbol },
                                {
                                    $set: { "investments.$.name": iexCurrentInvestmentData.companyName, "investments.$.price": iexCurrentInvestmentData.latestPrice, "investments.$.yearlyLow": iexCurrentInvestmentData.week52Low, "investments.$.yearlyHigh": iexCurrentInvestmentData.week52High, "investments.$.peRatio": iexCurrentInvestmentData.peRatio, "investments.$.dailyChange": ((iexCurrentInvestmentData.change / iexCurrentInvestmentData.open) * 100), "investments.$.target_percentage": Number(Number(iexCurrentInvestmentData.latestPrice) / currentInvestmentData.target_price) }
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
    fetchAllIexCloudSymbols: function (req, res) {
        console.log("Called update fetchAllIexCloudSymbols controller...");

        let apiURLs = [];
        let promises = [];

        apiURLs.push("https://cloud.iexapis.com/beta/ref-data/symbols?&token=" + keys.iex_credentials.apiKey)

        apiURLs.forEach(apiURL =>
            promises.push(
                axios.get(apiURL)
            )
        )

        Promise.all(promises).then(response => {
            console.log(response[0].data);
            db.IEXCloudSymbols
                .updateMany({},
                    {
                        "symbolsLastUpdated": new Date(),
                        "symbols": response[0].data
                    }
                )
                .then(dbModel => res.send(dbModel))
                .catch(err => console.log(err))

        })
            .catch(err => console.log(err));
    },
    fetchAllQuotes: function (req, res) {
        console.log("Called fetchAllQuotes controller...");

        let allSymbols = [[]];
        let arrayIndex = 0;

        let apiURLs = [];
        let promises = [];
        let symbolString;

        db.IEXCloudSymbols
            .find({})
            .then(dbModel => {
                for (let i = 0; i < dbModel[0].symbols.length; i++) {
                    if (i % 90 === 0 && i !== 0) {
                        allSymbols.push([]);
                        arrayIndex += 1;
                    }
                    if (dbModel[0].symbols[i].symbol.includes("#") === false) {
                        allSymbols[arrayIndex].push(dbModel[0].symbols[i].symbol);
                    }
                }

                for (let i = 0; i < allSymbols.length; i++) {
                    symbolString = "";
                    for (let j = 0; j < allSymbols[i].length; j++) {
                        symbolString += (j !== 0 ? "," : "") + allSymbols[i][j];
                    }
                    apiURLs.push("https://cloud.iexapis.com/stable/stock/market/batch?types=quote&symbols=" + symbolString + "&token=" + keys.iex_credentials.apiKey);
                }

                apiURLs.forEach(apiURL =>
                    promises.push(
                        limit(() => axios.get(apiURL)).catch(err => console.log(err))
                    )
                )

                let allResults = [];

                (async () => {
                    const result = await Promise.all(promises);
                    for (let i = 0; i < result.length; i++) {
                        allResults.push(result[i].data);
                    }
                    db.IEXCloudSymbols
                        .updateMany({},
                            {
                                "rawQuoteDataLastUpdated": new Date(),
                                "rawQuoteData": allResults
                            }
                        )
                        .then(dbModel => res.send(dbModel))
                        .catch(err => console.log(err))
                })()
            })
            .catch(err => res.status(422).json(err));
    },
    compileValueSearchData: (req, res) => {
        console.log("Called compileValueSearchData controller...");
        let allIEXData;
        let assembledValueSearchData = [];

        db.IEXCloudSymbols
            .find()
            .then(dbModel => {
                allIEXData = dbModel[0];

                for (let i = 0; i < Object.keys(allIEXData.rawQuoteData).length; i++) {
                    for (const [key, value] of Object.entries(allIEXData.rawQuoteData[i])) {
                        let currentKey = `${key}`;
                        let symbolsIndex = allIEXData.symbols.map((e) => {
                            return e.symbol;
                        }).indexOf(currentKey);

                        let valueSearchObject = {
                            symbol: `${key}`,
                            quote: allIEXData.rawQuoteData[i][currentKey].quote,
                            type: allIEXData.symbols[symbolsIndex].type,
                            region: allIEXData.symbols[symbolsIndex].region,
                            exchange: allIEXData.symbols[symbolsIndex].exchange,
                            exchangeName: allIEXData.symbols[symbolsIndex].exchangeName,
                            week52Range: (allIEXData.rawQuoteData[i][currentKey].quote.latestPrice - allIEXData.rawQuoteData[i][currentKey].quote.week52Low) / (allIEXData.rawQuoteData[i][currentKey].quote.week52High - allIEXData.rawQuoteData[i][currentKey].quote.week52Low) * 100
                        }
                        assembledValueSearchData.push(valueSearchObject);
                    }
                };
                db.ValueSearches
                    .updateMany({},
                        {
                            "valueSearchLastUpdated": new Date(),
                            "valueSearchData": assembledValueSearchData
                        }
                    )
                    .then(dbModel => res.send(dbModel))
                    .catch(err => console.log(err))
            })
            .catch(err => res.status(422).json(err));
    },
    fetchValueSearchData: (req, res) => {
        db.ValueSearches
            .find({})
            .then(dbModel => res.send(dbModel))
            .catch(err => console.log(err))
    }
}