import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ManageAccount.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IconButton, Modal, Box, TextField, Button, Select, MenuItem, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Register from './Register';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

function ManageAccount() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3004/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3004/api/users/${userId}`);
      console.log('after deletion should show this log to indicate that the deletion was successful');
      navigate('/ManageAccount');
      alert('User deleted successfully');
      setUsers(users.filter(user => user._id !== userId)); // Remove the deleted user from the state
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleEditUser = async () => {
    try {
      console.log('Selected user before update:', selectedUser);
      const response = await axios.put(`http://localhost:3004/edituser/${selectedUser._id}`, selectedUser);
      console.log('Update response:', response);
      setUsers(users.map(user => (user._id === selectedUser._id ? selectedUser : user))); // Update the user in the state
      handleEditModalClose();
      alert('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  const handleRoleChange = (e) => {
    setSelectedUser({ ...selectedUser, userRole: e.target.value });
  };

  const handleRegisterModalOpen = () => {
    setIsRegisterModalOpen(true);
  };

  const handleRegisterModalClose = () => {
    setIsRegisterModalOpen(false);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="manage-account-container">
      <div className="sidebar">
        <Link to="/ManageProduct" className="sidebar-link">
          <DashboardIcon sx={{ marginRight: '10px' }} />
          Manage Books
        </Link>
        <Link to="/ManageAccount" className="sidebar-link">
          <AccountBoxIcon sx={{ marginRight: '10px' }} />
          Manage Users
        </Link>
        <Link to="/ViewSales" className="sidebar-link">
          <DashboardIcon sx={{ marginRight: '10px' }} />
          View Sales
        </Link>
        <Link to="/" className="sidebar-link logout-link">
          <ExitToAppIcon sx={{ marginRight: '10px' }} />
          Logout
        </Link>
      </div>
      <div className="content">
        <div className="head">
          <h2 className="h1-center">Manage Users</h2>
          <TextField
            label="Search Usernames"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-field"
          />
          <br />
          <br />
          <Button variant="contained" color="primary" onClick={handleRegisterModalOpen} sx={{ minWidth: 120, float: 'right' }}>
            Add User
          </Button>
        </div>
        <br />
        <TableContainer component={Paper} style={{ marginTop: 20 }}>
          <Table style={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: 180 }}>Username</TableCell>
                <TableCell style={{ width: 250 }}>Email</TableCell>
                <TableCell style={{ width: 250 }}>Password</TableCell>
                <TableCell style={{ width: 120 }}>User Role</TableCell>
                <TableCell style={{ width: 180 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell style={{ maxWidth: 250, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={user.email}>
                    {user.email && user.email.length > 30 ? user.email.slice(0, 30) + '...' : user.email}
                  </TableCell>
                  <TableCell style={{ maxWidth: 250, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={user.password}>
                    {user.password && user.password.length > 30 ? user.password.slice(0, 30) + '...' : user.password}
                  </TableCell>
                  <TableCell>{user.userRole}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="primary" onClick={() => handleEditClick(user)} style={{ marginRight: 8 }} startIcon={<EditIcon />}>Edit</Button>
                    <Button variant="outlined" color="error" onClick={() => deleteUser(user._id)} startIcon={<DeleteIcon />}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Modal open={isEditModalOpen} onClose={handleEditModalClose}>
        <Box sx={{ ...modalStyle }}>
          <h2>Edit User</h2>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={selectedUser?.username || ''}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={selectedUser?.email || ''}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            value={selectedUser?.password || ''}
            onChange={handleInputChange}
            type="password"
            required
            error={!selectedUser?.password}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>User Role</InputLabel>
            <Select
              name="userRole"
              value={selectedUser?.userRole || ''}
              onChange={handleRoleChange}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="inventory">Inventory</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditUser}
          >
            Save Changes
          </Button>
        </Box>
      </Modal>

      <Modal open={isRegisterModalOpen} onClose={handleRegisterModalClose}>
        <Box sx={{ ...modalStyle }}>
          <Register closeModal={handleRegisterModalClose} />
        </Box>
      </Modal>
    </div>
  );
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default ManageAccount;