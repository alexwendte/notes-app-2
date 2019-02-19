import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

const AuthenticatedRoute = ({ component: C, props: cProps, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      cProps.isAuthenticated ? (
        <C {...props} {...cProps} />
      ) : (
        // eslint-disable-next-line
        <Redirect to={`/login?redirect=${props.location.pathname}${props.location.search}`} />
      )
    }
  />
)

AuthenticatedRoute.propTypes = {
  component: PropTypes.any.isRequired,
  props: PropTypes.any.isRequired,
}

export default AuthenticatedRoute
