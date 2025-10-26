import React, { useState, useEffect } from "react";
import { Container, Typography, Paper, Box } from "@mui/material";
import axios from "axios";
import AuthService from "../services/auth.service";

const BoardModerator = () => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    axios
      .get("http://localhost:8080/api/test/mod", {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then(
        (response) => {
          setContent(response.data);
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

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Moderator Board
          </Typography>
          {error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Typography>{content}</Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default BoardModerator;