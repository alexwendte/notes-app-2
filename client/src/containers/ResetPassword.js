import React from 'react'
import { Auth } from 'aws-amplify'
import { Link } from 'react-router-dom'
import { HelpBlock, FormGroup, Glyphicon, FormControl, ControlLabel } from 'react-bootstrap'
import LoaderButton from '../components/LoaderButton'

import './ResetPassword.css'

const ResetPassword = () => {
  const [values, setValues] = React.useState({ code: '', confirmPassword: '', email: '', password: '' })
  const [codeSent, setCodeSent] = React.useState(false)
  const [confirmed, setConfirmed] = React.useState(false)
  const [isConfirming, setIsConfirming] = React.useState(false)
  const [isSendingCode, setIsSendingCode] = React.useState(false)

  const validateCodeForm = () => values.email.length > 0

  const validateResetForm = () =>
    values.code.length > 0 && values.password.length > 0 && values.password === values.confirmPassword

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.id]: event.target.value,
    })
  }

  const handleSendResetEmail = async event => {
    event.preventDefault()

    setIsSendingCode(true)

    try {
      await Auth.forgotPassword(values.email)
      setCodeSent(true)
    } catch (e) {
      alert(e.message)
      setIsSendingCode(false)
    }
  }

  const handleConfirmClick = async event => {
    event.preventDefault()

    setIsConfirming(true)

    try {
      await Auth.forgotPasswordSubmit(values.email, values.code, values.password)
      setConfirmed(true)
    } catch (e) {
      alert(e.message)
      setIsConfirming(false)
    }
  }

  const renderRequestCodeForm = () => (
    <form onSubmit={handleSendResetEmail}>
      <FormGroup bsSize="large" controlId="email">
        <ControlLabel>Email</ControlLabel>
        <FormControl autoFocus type="email" value={values.email} onChange={handleChange} />
      </FormGroup>
      <LoaderButton
        block
        type="submit"
        bsSize="large"
        loadingText="Sending…"
        text="Send Reset Email"
        isLoading={isSendingCode}
        disabled={!validateCodeForm()}
      />
    </form>
  )

  const renderConfirmationForm = () => (
    <form onSubmit={handleConfirmClick}>
      <FormGroup bsSize="large" controlId="code">
        <ControlLabel>Confirmation Code</ControlLabel>
        <FormControl autoFocus type="tel" value={values.code} onChange={handleChange} />
        <HelpBlock>Please check your email ({values.email}) for the confirmation code.</HelpBlock>
      </FormGroup>
      <hr />
      <FormGroup bsSize="large" controlId="password">
        <ControlLabel>New Password</ControlLabel>
        <FormControl type="password" value={values.password} onChange={handleChange} />
      </FormGroup>
      <FormGroup bsSize="large" controlId="confirmPassword">
        <ControlLabel>Confirm Password</ControlLabel>
        <FormControl type="password" onChange={handleChange} value={values.confirmPassword} />
      </FormGroup>
      <LoaderButton
        block
        type="submit"
        bsSize="large"
        text="Confirm"
        loadingText="Confirm…"
        isLoading={isConfirming}
        disabled={!validateResetForm()}
      />
    </form>
  )

  const renderSuccessMessage = () => (
    <div className="success">
      <Glyphicon glyph="ok" />
      <p>Your password has been reset.</p>
      <p>
        <Link to="/login">Click here to login with your new credentials.</Link>
      </p>
    </div>
  )

  return (
    <div className="ResetPassword">
      {!codeSent && renderRequestCodeForm()}
      {codeSent && (!confirmed ? renderConfirmationForm() : renderSuccessMessage())}
    </div>
  )
}

export default ResetPassword
