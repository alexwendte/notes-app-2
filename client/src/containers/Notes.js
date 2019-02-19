import React from 'react'
import { API, Storage } from 'aws-amplify'
import PropTypes from 'prop-types'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

import LoaderButton from '../components/LoaderButton'
import config from '../config'
import './Notes.css'
import { s3Upload, s3Delete } from '../libs/awsLib'

const Notes = ({ match, history }) => {
  const [note, setNote] = React.useState(undefined)
  const [attachmentURL, setAttachmentURL] = React.useState(undefined)
  const [content, setContent] = React.useState('')
  const [file, setFile] = React.useState(undefined)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  React.useEffect(() => {
    API.get('notes', `/notes/${match.params.id}`).then(apiNote => {
      const { content: apiContent, attachment } = apiNote
      setNote(apiNote)
      setContent(apiContent)
      if (attachment) {
        Storage.vault.get(attachment).then(apiAttachmentURL => {
          setAttachmentURL(apiAttachmentURL)
        }, alert)
      }
    }, alert)
  }, [])

  const validateForm = () => content.length > 0

  const formatFilename = str => str.replace(/^\w+-/, '')

  const handleChange = event => {
    setContent(event.target.value)
  }

  const handleFileChange = event => {
    setFile(event.target.files[0])
  }

  const saveNote = inputNote =>
    API.put('notes', `/notes/${match.params.id}`, {
      body: inputNote,
    })

  const handleSubmit = async event => {
    event.preventDefault()

    if (file && file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`)
      return
    }
    setIsLoading(true)

    let attachment
    try {
      if (file) {
        attachment = await s3Upload(file)
      }

      await saveNote({
        attachment: attachment || note.attachment,
        content,
      })
      if (file) {
        await s3Delete(note.attachment)
      }
      history.push('/')
    } catch (e) {
      alert(e)
      setIsLoading(false)
    }
  }

  const deleteNote = () => API.del('notes', `/notes/${match.params.id}`)

  const handleDelete = async event => {
    event.preventDefault()

    const confirmed = window.confirm('Are you sure you want to delete this note?')

    if (!confirmed) {
      return
    }
    setIsDeleting(true)

    try {
      await deleteNote()
      history.push('/')
    } catch (e) {
      alert(e)
      setIsDeleting(false)
    }
  }

  return (
    <div className="Notes">
      {note && (
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="content">
            <FormControl onChange={handleChange} value={content} componentClass="textarea" />
          </FormGroup>
          {note.attachment && (
            <FormGroup>
              <ControlLabel>Attachment</ControlLabel>
              <FormControl.Static>
                <a target="_blank" rel="noopener noreferrer" href={attachmentURL}>
                  {formatFilename(note.attachment)}
                </a>
              </FormControl.Static>
            </FormGroup>
          )}
          <FormGroup controlId="file">
            {!note.attachment && <ControlLabel>Attachment</ControlLabel>}
            <FormControl onChange={handleFileChange} type="file" />
          </FormGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!validateForm()}
            type="submit"
            isLoading={isLoading}
            text="Save"
            loadingText="Saving…"
          />
          <LoaderButton
            block
            bsStyle="danger"
            bsSize="large"
            disabled={!validateForm()}
            isLoading={isDeleting}
            onClick={handleDelete}
            text="Delete"
            loadingText="Deleting…"
          />
        </form>
      )}
    </div>
  )
}

export default Notes

Notes.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
}
