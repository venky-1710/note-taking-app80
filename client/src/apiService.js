import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const handleApiError = (error) => {
  if (error.response) {
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new Error(error.response.data.message || 'An error occurred');
  }
  throw new Error('Network error occurred');
};

// Auth related functions
const validateToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const response = await axios.get(`${API_URL}/validate-token`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.valid;
  } catch (error) {
    localStorage.removeItem('token');
    return false;
  }
};

const login = async (identifier, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { identifier, password });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, email, password });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const logout = () => {
  localStorage.removeItem('token');
};

// Note related functions
const getNotes = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/notes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
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
    handleApiError(error);
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
    handleApiError(error);
  }
};

const deleteNote = async (token, noteId) => {
  try {
    const response = await axios.delete(`${API_URL}/notes/${noteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Password reset functions
const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password/${token}`, {
      new_password: newPassword
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const getProtected = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/protected`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export {
  validateToken,
  login,
  register,
  logout,
  getNotes,
  addNote,
  updateNote,
  deleteNote,
  forgotPassword,
  resetPassword,
  getProtected
};