import { useState } from 'react';
import axios from 'axios';
import { API } from './api';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: enter email, 2: enter new password

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      // Simulate email check (in real app, send code or link)
      const res = await axios.post(API.FORGOT_PASSWORD, { email });
      if (res.data.success) {
        setStep(2);
        setMessage('Email found. Please enter your new password.');
      } else {
        setError('Email not found.');
      }
    } catch (err) {
      setError('Email not found.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const res = await axios.post(API.FORGOT_PASSWORD, { email, newPassword });
      if (res.data.success) {
        setMessage('Password changed successfully! You can now log in.');
        setStep(3);
      } else {
        setError('Failed to change password.');
      }
    } catch (err) {
      setError('Failed to change password.');
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      {step === 1 && (
        <form onSubmit={handleEmailSubmit} className="forgot-password-form">
          <label>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <button type="submit">Next</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handlePasswordSubmit} className="forgot-password-form">
          <label>New Password:</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          <label>Confirm Password:</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          <button type="submit">Change Password</button>
        </form>
      )}
      {step === 3 && (
        <div className="forgot-password-success">{message}</div>
      )}
      {error && <div className="forgot-password-error">{error}</div>}
      {message && step !== 3 && <div className="forgot-password-message">{message}</div>}
    </div>
  );
};

export default ForgotPassword;
