const path = require('path')
const withCSS = require('@zeit/next-css')
const withProgressBar = require('next-progressbar')
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

module.exports = withProgressBar(
  withCSS({
    env: {
      ENV: process.env.NODE_ENV,
      apiKey: process.env.apiKey,
      authDomain: process.env.authDomain,
      databaseURL: process.env.databaseURL,
      projectId: process.env.projectId,
      storageBucket: process.env.storageBucket,
      messagingSenderId: process.env.messagingSenderId,
      appId: process.env.appId,
      measurementId: process.env.measurementId
    },
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      })

      config.resolve.alias['~public'] = path.join(__dirname, 'public') // eslint-disable-line no-param-reassign
      config.resolve.alias['~pages'] = path.join(__dirname, 'pages') // eslint-disable-line no-param-reassign

      return config
    },
  }),
)
