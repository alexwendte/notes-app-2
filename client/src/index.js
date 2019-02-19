import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import Amplify from 'aws-amplify'

import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import config from './config'

Amplify.configure({
  API: {
    endpoints: [
      {
        endpoint: config.apiGateway.URL,
        name: 'notes',
        region: config.apiGateway.REGION,
      },
    ],
  },
  Auth: {
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  },
  Storage: {
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    region: config.s3.REGION,
  },
})

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
