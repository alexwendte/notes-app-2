import React from 'react'
import { PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import PropTypes from 'prop-types'
import { API } from 'aws-amplify'
import { Link } from 'react-router-dom'
import './Home.css'

const Home = ({ isAuthenticated }) => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [notes, setNotes] = React.useState([])

  React.useEffect(() => {
    if (!isAuthenticated) {
      return
    }
    API.get('notes', '/notes').then(apiNotes => {
      setNotes(apiNotes)
    }, alert)
    setIsLoading(false)
  }, [isAuthenticated])

  const renderNotesList = inputNotes => {
    const createNote = (
      <LinkContainer key="new" to="/notes/new">
        <ListGroupItem>
          <h4>
            <b>{'\uFF0B'}</b> Create a new note
          </h4>
        </ListGroupItem>
      </LinkContainer>
    )
    const existingNotes = inputNotes.map(note => (
      <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
        <ListGroupItem header={note.content.trim().split('\n')[0]}>
          {`Created: ${new Date(note.createdAt).toLocaleString()}`}
        </ListGroupItem>
      </LinkContainer>
    ))
    return [createNote, ...existingNotes]
  }

  const renderLander = () => (
    <div className="lander">
      <h1>Scratch</h1>
      <p>A simple note taking app</p>
      <div>
        <Link to="/login" className="btn btn-info btn-lg">
          Login
        </Link>
        <Link to="/signup" className="btn btn-success btn-lg">
          Signup
        </Link>
      </div>
    </div>
  )

  const renderNotes = () => (
    <div className="notes">
      <PageHeader>Your Notes</PageHeader>
      <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
    </div>
  )
  return <div className="Home">{isAuthenticated ? renderNotes() : renderLander()}</div>
}

Home.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
}

export default Home
