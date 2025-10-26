import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Button,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import AuthService from "../services/auth.service";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const BoardUser = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    roles: ["ROLE_USER"],
  });
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setIsAdmin(user?.roles?.includes("ROLE_ADMIN"));
    
    axios
      .get("http://localhost:8080/api/users", {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then(
        (response) => {
          setUsers(response.data);
        },
        (error) => {
          const _content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setError(_content);
        }
      );
  }, []);

  const handleEdit = (userId) => {
    // Implement edit functionality
    console.log("Edit user:", userId);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const user = AuthService.getCurrentUser();
        await axios.delete(`http://localhost:8080/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });
        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        setError("Failed to delete user");
      }
    }
  };

  const handleOpen = () => setOpenModal(true);
  
  const handleClose = () => {
    setOpenModal(false);
    setNewUser({
      username: "",
      email: "",
      password: "",
      roles: ["ROLE_USER"],
    });
    setModalError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (event) => {
    setNewUser((prev) => ({
      ...prev,
      roles: event.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError("");
    
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser?.roles?.includes("ROLE_ADMIN")) {
      setModalError("You don't have permission to create users.");
      return;
    }
    
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/signup",
        newUser,
        {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        }
      );
      setUsers([...users, response.data]);
      handleClose();
    } catch (err) {
      setModalError(
        err.response?.data?.message || 
        "An error occurred while creating the user."
      );
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              User Management
            </Typography>
            {isAdmin && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpen}
              >
                Add User
              </Button>
            )}
          </Box>
          {error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Roles</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.roles?.map((role) => role.name).join(", ")}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleEdit(user.id)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDelete(user.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      <Modal open={openModal} onClose={handleClose}>
        <Paper sx={modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h5">Create New User</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {modalError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {modalError}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                required
                fullWidth
                label="Username"
                name="username"
                value={newUser.username}
                onChange={handleInputChange}
              />
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={newUser.email}
                onChange={handleInputChange}
              />
              <TextField
                required
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={newUser.password}
                onChange={handleInputChange}
              />
              <FormControl fullWidth>
                <InputLabel>Roles</InputLabel>
                <Select
                  multiple
                  value={newUser.roles}
                  onChange={handleRoleChange}
                  label="Roles"
                >
                  <MenuItem value="ROLE_USER">User</MenuItem>
                  <MenuItem value="ROLE_MODERATOR">Moderator</MenuItem>
                  <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button variant="outlined" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit">
                  Create User
                </Button>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Modal>
    </Container>
  );
};

export default BoardUser;