import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../apiService';
import toast from './toastManager'; // Make sure this path is correct

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await resetPassword(token, newPassword);
      toast.success(response.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      toast.error(error.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <h1>Reset Password</h1>
        <div className="inputbox">
          <ion-icon name="lock-closed-outline"></ion-icon>
          <input 
            type="password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            required 
          />
          <label>New Password</label>
        </div>
        <button type="submit">Set New Password</button>
      </form>
    </section>
  );
};

export default ResetPasswordPage;