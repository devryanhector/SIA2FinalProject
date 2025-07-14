import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Modal,
  InputAdornment,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Lock from '@mui/icons-material/Lock';
import axios from 'axios';
import './Login.css';
// Use the new red Bookly logo for login
const loginImage = '/Red_Booklyp.png';

function Login() {
  const [ModalStudOpen, setModalStudOpen] = useState(true);
  const [loginID, setLoginID] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginIDErr, setLoginIDError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleCloseStudModal = () => {
    setModalStudOpen(false);
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Hardcoded admin and seller logins
    const adminEmail = 'admin@system.com';
    const adminPassword = 'admin123';
    const sellerEmail = 'seller@system.com';
    const sellerPassword = 'seller123';

    if (loginID === adminEmail && password === adminPassword) {
      localStorage.setItem('token', 'dummy_admin_token');
      localStorage.setItem('userRole', 'admin');
      navigate('/ManageProduct');
      return;
    }

    if (loginID === sellerEmail && password === sellerPassword) {
      localStorage.setItem('token', 'dummy_seller_token');
      localStorage.setItem('userRole', 'seller');
      navigate('/ManageProduct'); // Direct seller to Manage Books
      return;
    }

    // Buyer login via backend
    try {
      const response = await axios.post('http://localhost:3004/api/login', {
        loginID,
        password
      });
      const { token, userRole, username } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('username', username);

      if (userRole === 'buyer' || userRole === 'user') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.status === 400) {
        setLoginIDError('Invalid login ID or password');
        setPasswordError('Invalid login ID or password');
      } else {
        setLoginIDError('An error occurred');
        setPasswordError('An error occurred');
      }
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <Modal open={ModalStudOpen} onClose={handleCloseStudModal}>
      <div className="login-modal" style={{ background: '#FFF8F0', borderRadius: 16, boxShadow: '0 4px 32px rgba(128,0,32,0.10)', padding: 0 }}>
        <div className="main-login-form" style={{ background: '#FFF8F0', borderRadius: 16 }}>
          <div className="login-form" style={{ boxShadow: '0 2px 16px rgba(128,0,32,0.08)', borderRadius: 16, padding: 32, background: '#FFF8F0', minWidth: 340, maxWidth: 400, margin: 'auto' }}>
            <img src={loginImage} alt="Login" className="login-image" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 12, borderRadius: 12, background: '#FFF8F0', border: '2px solid #800020', boxShadow: '0 2px 8px rgba(128,0,32,0.10)', display: 'block', marginLeft: 'auto', marginRight: 'auto', filter: 'drop-shadow(0 0 2px #80002022)' }} />
            <h1 style={{ color: '#800020', fontWeight: 700, marginBottom: 18, fontFamily: 'serif', letterSpacing: 1 }}>Login</h1>
            <div className="login-forms" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <TextField
                value={loginID}
                onChange={(e) => {
                  setLoginID(e.target.value);
                  setLoginIDError('');
                }}
                id="outlined-login-id"
                label="Email or Username"
                variant="outlined"
                required
                error={!!loginIDErr}
                helperText={loginIDErr}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle sx={{ color: '#800020' }} />
                    </InputAdornment>
                  ),
                  style: { background: '#FFF8F0', borderRadius: 8 }
                }}
                InputLabelProps={{ style: { color: '#800020' } }}
              />
              <TextField
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                id="outlined-password"
                label="Password"
                variant="outlined"
                type="password"
                required
                error={!!passwordError}
                helperText={passwordError}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#800020' }} />
                    </InputAdornment>
                  ),
                  style: { background: '#FFF8F0', borderRadius: 8 }
                }}
                InputLabelProps={{ style: { color: '#800020' } }}
              />
              {/* Forgot Password link for buyers */}
              {(!loginID || (!loginID.includes('admin') && !loginID.includes('seller'))) && (
                <div style={{ width: '100%', textAlign: 'right', marginTop: 4 }}>
                  <a href="/forgot-password" style={{ color: '#D95D39', fontWeight: 500, fontSize: 15, textDecoration: 'underline', cursor: 'pointer' }}>
                    Forgot password?
                  </a>
                </div>
              )}
              {/* <FormControlLabel
                control={
                  <Checkbox
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    sx={{ color: '#800020', '&.Mui-checked': { color: '#800020' } }}
                  />
                }
                label={<span style={{ color: '#800020' }}>Show Password</span>}
              /> */}
              <Button
                variant="contained"
                onClick={handleSubmit}
                className="login-button sign-in"
                style={{ backgroundColor: '#800020', color: 'white', fontWeight: 600, borderRadius: 8, fontSize: 18, boxShadow: '0 2px 8px rgba(128,0,32,0.10)' }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={handleCloseStudModal}
                className="login-button cancel"
                style={{ backgroundColor: '#D95D39', color: 'white', fontWeight: 600, borderRadius: 8, fontSize: 18, boxShadow: '0 2px 8px rgba(217,93,57,0.10)' }}
              >
                Cancel
              </Button>
              {/* Register button only shown for non-admin/non-seller */}
              {loginID !== 'admin@system.com' && loginID !== 'seller@system.com' && (
                <Button
                  variant="outlined"
                  onClick={handleRegisterClick}
                  className="login-button register"
                  style={{ borderColor: '#800020', color: '#800020', height: '56px', fontWeight: 600, borderRadius: 8, fontSize: 18 }}
                >
                  Register
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default Login;
