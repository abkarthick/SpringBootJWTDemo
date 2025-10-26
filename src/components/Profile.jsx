import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import { Container, Typography, Paper, Box } from "@mui/material";

const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        {currentUser ? (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Profile
            </Typography>
            <Typography variant="body1">
              <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)}...
            </Typography>
            <Typography variant="body1">
              <strong>Id:</strong> {currentUser.id}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {currentUser.email}
            </Typography>
            <Typography variant="body1">
              <strong>Username:</strong> {currentUser.username}
            </Typography>
            <Typography variant="body1">
              <strong>Roles:</strong>
              <ul>
                {currentUser.roles &&
                  currentUser.roles.map((role, index) => (
                    <li key={index}>{role}</li>
                  ))}
              </ul>
            </Typography>
          </Paper>
        ) : (
          <Typography variant="h6">Please login to view profile.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default Profile;