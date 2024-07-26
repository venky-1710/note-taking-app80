import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../apiService';
import toast from './toastManager';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await register(username, email, password);
      toast.success(response.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <form onSubmit={handleRegister}>
        <h1>Register</h1>
        <div className="inputbox">
          <ion-icon name="person-outline"></ion-icon>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          <label>Username</label>
        </div>
        <div className="inputbox">
          <ion-icon name="mail-outline"></ion-icon>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <label>Email</label>
        </div>
        <div className="inputbox">
          <ion-icon name="lock-closed-outline"></ion-icon>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <label>Password</label>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Registering...
            </>
          ) : (
            'Register'
          )}
        </button>
        <div className="register">
          <p>Already have an account? <a href=" " onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Login</a></p>
        </div>
      </form>
    </section>
  );
};

export default RegisterPage;