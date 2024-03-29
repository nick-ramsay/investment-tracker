exports.gmail_credentials = {
  gmailUserId: process.env.REACT_APP_GMAIL_USER_ID,
  gmailPassword: process.env.REACT_APP_GMAIL_PASSWORD,
  gmailClientId: process.env.REACT_APP_GMAIL_CLIENT_ID,
  gmailClientSecret: process.env.REACT_APP_CLIENT_SECRET,
  gmailRefreshToken: process.env.REACT_APP_REFRESH_TOKEN,
  sendGridAPIKey: process.env.SENDGRID_API_KEY
};

exports.mongodb = {
  mongo_uri: process.env.mongo_uri
}

exports.iex_credentials = {
  apiKey: process.env.IEX_API_KEY
}

exports.datadog = {
  DD_API_KEY: process.env.DD_API_KEY,
  DD_SITE: process.env.DD_SITE,
  DD_CLIENT_TOKEN: process.env.DD_CLIENT_TOKEN,
  DD_APPLICATION_ID: process.env.DD_APPLICATION_ID
}

exports.etrade = {
  etradeAPIKey: process.env.ETRADE_PROD_API_KEY,
  etradeSecret: process.env.ETRADE_PROD_SECRET
}