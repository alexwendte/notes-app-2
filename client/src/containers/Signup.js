import PropTypes from 'prop-types'
import { Auth } from 'aws-amplify'
import React from 'react'
import { HelpBlock, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import LoaderButton from '../components/LoaderButton'
import './Signup.css'

const Signup = ({ history, setIsAuthenticated }) => {
  const [values, setValues] = React.useState({ confirmationCode: '', confirmPassword: '', email: '', password: '' })
  const [isLoading, setIsLoading] = React.useState(false)
  const [newUser, setNewUser] = React.useState(undefined)

  const validateForm = () =>
    values.email.length > 0 && values.password.length > 0 && values.password === values.confirmPassword

  const validateConfirmationForm = () => values.confirmationCode.length > 0
  const handleChange = event => {
    Auth.userAttributes('themostcolm@gmail.com').then(console.log, console.err)
    setValues({
      ...values,
      [event.target.id]: event.target.value,
    })
  }

  const handleSubmit = async event => {
    event.preventDefault()

    setIsLoading(true)

    try {
      const createdUser = await Auth.signUp({
        password: values.password,
        username: values.email,
      })
      setNewUser(createdUser)
    } catch (e) {
      if (e.name === 'UsernameExistsException') {
        Auth.resendSignUp(values.username)
      }
      alert(e.message)
    }

    setIsLoading(false)
  }

  const handleConfirmationSubmit = async event => {
    event.preventDefault()

    setIsLoading(true)

    try {
      await Auth.confirmSignUp(values.email, values.confirmationCode)
      await Auth.signIn(values.email, values.password)

      setIsAuthenticated(true)
      history.push('/')
    } catch (e) {
      alert(e.message)
      setIsLoading(false)
    }
  }

  const renderConfirmationForm = () => {
    return (
      <form onSubmit={handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl autoFocus type="tel" value={values.confirmationCode} onChange={handleChange} />
          <HelpBlock>Please check your email for the code.</HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!validateConfirmationForm()}
          type="submit"
          isLoading={isLoading}
          text="Verify"
          loadingText="Verifying…"
        />
      </form>
    )
  }

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl autoFocus type="email" value={values.email} onChange={handleChange} />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl value={values.password} onChange={handleChange} type="password" />
        </FormGroup>
        <FormGroup controlId="confirmPassword" bsSize="large">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl value={values.confirmPassword} onChange={handleChange} type="password" />
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!validateForm()}
          type="submit"
          isLoading={isLoading}
          text="Signup"
          loadingText="Signing up…"
        />
      </form>
    )
  }

  return <div className="Signup">{!newUser ? renderForm() : renderConfirmationForm()}</div>
}

export default Signup
Signup.propTypes = {
  history: PropTypes.object.isRequired,
  setIsAuthenticated: PropTypes.func.isRequired,
}
