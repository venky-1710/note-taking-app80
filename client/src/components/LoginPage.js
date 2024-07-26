import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../apiService';
import toast from './toastManager';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await login(email, password);
      toast.success(response.message);
      localStorage.setItem('token', response.access_token);
      navigate('/main');
    } catch (error) {
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <form onSubmit={handleLogin}>
        <h1>Login</h1>
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
        <div className="forgot">
          <a href=" " onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}>Forgot Password</a>
        </div>
        <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Loading...
              </>
            ) : (
              'Log in'
            )}
          </button>
        <div className="register">
          <p>Don't have an account? <a href=" " onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Register</a></p>
        </div>
      </form>
    </section>
  );
};

export default LoginPage;