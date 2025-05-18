import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProtected, addNote, getNotes, updateNote, deleteNote, logout, validateToken } from '../apiService';
// import './MainPage.css';

const MainPage = () => {
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You need to log in first.');
      navigate('/login');
      return;
    }
    try {
      const response = await getProtected(token);
      setMessage(`Welcome ${response.username}`);
      fetchNotes();
    } catch (error) {
      setMessage(error.message);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await validateToken();
      if (!isValid) {
        navigate('/login');
        return;
      }
      setIsLoading(false);
      fetchData();
    };
    checkAuth();
  }, [navigate]);

  const fetchNotes = async () => {
    const token = localStorage.getItem('token');
    try {
      const notesResponse = await getNotes(token);
      setNotes(notesResponse);
    } catch (error) {
      setMessage('Failed to retrieve notes: ' + error.message);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await addNote(token, noteTitle, noteContent);
      setNoteTitle('');
      setNoteContent('');
      fetchNotes();
    } catch (error) {
      setMessage('Failed to add note: ' + error.message);
    }
  };

  const handleEditNote = (note) => {
    setEditingNoteId(note._id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await updateNote(token, editingNoteId, noteTitle, noteContent);
      setEditingNoteId(null);
      setNoteTitle('');
      setNoteContent('');
      fetchNotes();
    } catch (error) {
      setMessage('Failed to update note: ' + error.message);
    }
  };

  const handleDeleteNote = async (noteId) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await deleteNote(token, noteId);
      fetchNotes();
    } catch (error) {
      setMessage('Failed to delete note: ' + error.message);
    }
  };
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Add loading state
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="main-container">
        <div className="header">
            <h2>Note-app</h2>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
        <div className="content">
        <div className="input-section">
        {/* <button className="logout-btn" onClick={handleLogout}>Logout</button> */}
        {/* <h2>Note-app</h2> */}
        <p className="message">{message}</p>
        <form onSubmit={editingNoteId ? handleUpdateNote : handleAddNote}>
          <h3>{editingNoteId ? 'Edit Note' : 'Add Note'}</h3>
          <input
            placeholder="Title"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Content"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            required
          />
          <button type="submit">
            {editingNoteId ? 'Update Note' : 'Add Note'}
          </button>
          <br/>
          {editingNoteId && (
            <button type="button" onClick={() => {
              setEditingNoteId(null);
              setNoteTitle('');
              setNoteContent('');
            }}>
              Cancel Edit
            </button>
          )}
        </form>
      </div>
      <div className="notes-section">
        <h3>Notes</h3>
        {notes.map((note) => (
          <div key={note._id} className="note">
            <h4>{note.title}</h4>
            <p>{note.content}</p>
            <div className="note-actions">
              <button className="edit-btn" onClick={() => handleEditNote(note)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDeleteNote(note._id)}>Delete</button>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;