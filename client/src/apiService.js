import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
// console.log('API_URL:', API_URL);
export const forgotPassword = async (email) => {
  const response = await fetch(`${API_URL}/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await fetch(`${API_URL}/reset-password/${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ new_password: newPassword }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};
const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

const login = async (identifier, password) => {
  try {
    console.log('Attempting login to:', `${API_URL}/login`);
    const response = await axios.post(`${API_URL}/login`, { identifier, password });
    console.log('Login response:', response);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response || error);
    throw error.response ? error.response.data : error;
  }
};

const logout = () => {
    localStorage.removeItem('token');
  };

const getProtected = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/protected`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

const getNotes = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/notes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

const addNote = async (token, title, content) => {
  try {
    const response = await axios.post(
      `${API_URL}/notes`,
      { title, content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

const updateNote = async (token, noteId, title, content) => {
  try {
    const response = await axios.put(
      `${API_URL}/notes/${noteId}`,
      { title, content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

const deleteNote = async (token, noteId) => {
  try {
    const response = await axios.delete(`${API_URL}/notes/${noteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export { register, login, getProtected, getNotes, addNote, updateNote, deleteNote, logout  };