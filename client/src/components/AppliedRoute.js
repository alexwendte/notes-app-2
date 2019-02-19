import React from 'react'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'

const AppliedRoute = ({ component: C, props: cProps, ...rest }) => (
  <Route {...rest} render={props => <C {...props} {...cProps} />} />
)

export default AppliedRoute

AppliedRoute.propTypes = {
  component: PropTypes.any.isRequired,
  props: PropTypes.any.isRequired,
}
