import React from 'react'
import { Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'

import AppliedRoute from './components/AppliedRoute'
import Home from './containers/Home'
import Login from './containers/Login'
import NewNote from './containers/NewNote'
import NotFound from './containers/NotFound'
import ResetPassword from './containers/ResetPassword'
import Signup from './containers/Signup'
import Notes from './containers/Notes'
import AuthenticatedRoute from './components/AuthenticatedRoute'
import UnauthenticatedRoute from './components/UnauthenticatedRoute'

const Routes = ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <UnauthenticatedRoute path="/login/reset" exact component={ResetPassword} props={childProps} />
    <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
    <AuthenticatedRoute path="/notes/new" exact component={NewNote} props={childProps} />
    <AuthenticatedRoute path="/notes/:id" exact component={Notes} props={childProps} />
    {/* Finally, catch all unmatched routes */}
    <Route component={NotFound} />
  </Switch>
)
export default Routes
Routes.propTypes = {
  childProps: PropTypes.object.isRequired,
}
