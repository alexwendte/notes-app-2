import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

const UnauthenticatedRoute = ({ component: C, props: cProps, ...rest }) => {
  const querystring = (name, url = window.location.href) => {
    const newName = name.replace(/[[]]/g, '\\$&')

    const regex = new RegExp(`[?&]${newName}(=([^&#]*)|&|#|$)`, 'i')
    const results = regex.exec(url)

    if (!results) {
      return null
    }
    if (!results[2]) {
      return ''
    }

    return decodeURIComponent(results[2].replace(/\+/g, ' '))
  }

  const redirect = querystring('redirect')

  return (
    <Route
      {...rest}
      render={props =>
        !cProps.isAuthenticated ? (
          <C {...props} {...cProps} />
        ) : (
          <Redirect to={redirect === '' || redirect === null ? '/' : redirect} />
        )
      }
    />
  )
}

UnauthenticatedRoute.propTypes = {
  component: PropTypes.any.isRequired,
  props: PropTypes.any.isRequired,
}

export default UnauthenticatedRoute
