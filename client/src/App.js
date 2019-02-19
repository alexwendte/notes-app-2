import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Nav, Navbar, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import PropTypes from 'prop-types'
import { Auth } from 'aws-amplify'
import './App.css'
import Routes from './Routes'

const App = ({ history }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [isAuthenticating, setIsAuthenticating] = React.useState(true)
  React.useEffect(() => {
    Auth.currentSession()
      .then(() => setIsAuthenticated(true))
      .catch(e => {
        if (e !== 'No current user') {
          alert(e)
        }
      })
    setIsAuthenticating(false)
  })

  const handleLogout = async () => {
    await Auth.signOut()
    setIsAuthenticated(false)
    history.push('/login')
  }

  const childProps = {
    isAuthenticated,
    setIsAuthenticated,
  }
  return (
    !isAuthenticating && (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Scratch</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {isAuthenticated ? (
                <NavItem onClick={handleLogout}>Logout</NavItem>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <NavItem>Signup</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    )
  )
}

export default withRouter(App)

App.propTypes = {
  history: PropTypes.object.isRequired,
}
