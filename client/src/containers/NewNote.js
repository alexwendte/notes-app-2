import React from 'react'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { API } from 'aws-amplify'
import PropTypes from 'prop-types'

import LoaderButton from '../components/LoaderButton'
import config from '../config'
import './NewNote.css'
import { s3Upload } from '../libs/awsLib'

const NewNote = ({ history }) => {
  const [file, setFile] = React.useState(undefined)
  const [isLoading, setIsLoading] = React.useState(false)
  const [content, setContent] = React.useState('')

  const validateForm = () => content.length > 0

  const handleFileChange = event => {
    setFile(event.target.files[0])
  }

  const createNote = note => {
    return API.post('notes', '/notes', {
      body: note,
    })
  }

  const handleSubmit = async event => {
    event.preventDefault()

    if (file && file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`)
      return
    }

    setIsLoading(true)

    try {
      const attachment = file ? await s3Upload(file) : null

      await createNote({
        attachment,
        content,
      })
      history.push('/')
    } catch (e) {
      alert(e)
      setIsLoading(false)
    }
  }

  return (
    <div className="NewNote">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="content">
          <FormControl onChange={e => setContent(e.target.value)} value={content} componentClass="textarea" />
        </FormGroup>
        <FormGroup controlId="file">
          <ControlLabel>Attachment</ControlLabel>
          <FormControl onChange={handleFileChange} type="file" />
        </FormGroup>
        <LoaderButton
          block
          bsStyle="primary"
          bsSize="large"
          disabled={!validateForm()}
          type="submit"
          isLoading={isLoading}
          text="Create"
          loadingText="Creating…"
        />
      </form>
    </div>
  )
}
export default NewNote

NewNote.propTypes = {
  history: PropTypes.object.isRequired,
}
