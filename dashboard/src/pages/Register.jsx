import { useState } from 'react';
import axios from 'axios';
import API from './api';
import './Register.css';
import { TextField, Button, Typography, Box } from '@mui/material';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'buyer', // always buyer
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API.REGISTER, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        userRole: 'buyer' // force buyer
      });
      alert('Registration successful!');
      setFormData({ username: '', email: '', password: '', role: 'buyer' });
      setErrors({});
      // Do not redirect to login, just clear form and stay on page
    } catch (error) {
      let msg = 'Registration failed!';
      if (error.response && error.response.data && error.response.data.message) {
        msg += ' ' + error.response.data.message;
      }
      alert(msg);
      if (error.response) {
        setErrors(error.response.data.error || {});
      } else {
        setErrors({ general: 'Error creating user' });
      }
    }
  };

  return (
    <div className="background-container">
      <Box className="form-container">
        <Typography variant="h4" gutterBottom textAlign="center" sx={{ color: 'black' }}>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box className="form-group">
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
              required
            />
          </Box>
          <Box className="form-group">
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
              required
            />
          </Box>
          <Box className="form-group">
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
              error={!!errors.password}
              helperText={errors.password}
              required
            />
          </Box>
          <Box className="button-container">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                backgroundColor: '#000',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#808080'
                }
              }}
            >
              Register
            </Button>
          </Box>
        </form>
      </Box>
    </div>
  );
};

export default Register;
