import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../apiService';
import toast from './toastManager';
import './Toast.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await forgotPassword(email);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <h1>Forgot Password</h1>
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
        <button type="submit">Reset Password</button>
        <div className="register">
          <p>Remember your password? <a href=" " onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Login</a></p>
        </div>
      </form>
    </section>
  );
};

export default ForgotPasswordPage;