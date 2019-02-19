import React from 'react'
import { Link } from 'react-router-dom'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Auth } from 'aws-amplify'
import './Login.css'
import PropTypes from 'prop-types'
import LoaderButton from '../components/LoaderButton'

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const validateForm = () => email.length > 0 && password.length > 0

  const handleChange = event => {
    if (event.target.id === 'email') {
      setEmail(event.target.value)
    } else {
      setPassword(event.target.value)
    }
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setIsLoading(true)

    try {
      await Auth.signIn(email, password)
      setIsAuthenticated(true)
    } catch (e) {
      alert(e.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl autoFocus type="email" value={email} onChange={handleChange} />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl value={password} onChange={handleChange} type="password" />
        </FormGroup>
        <Link to="/login/reset">Forgot password?</Link>
        <LoaderButton
          block
          bsSize="large"
          disabled={!validateForm()}
          type="submit"
          isLoading={isLoading}
          text="Login"
          loadingText="Logging in…"
        />
      </form>
    </div>
  )
}

export default Login

Login.propTypes = {
  history: PropTypes.object.isRequired,
  setIsAuthenticated: PropTypes.func.isRequired,
}
