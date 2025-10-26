import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import axios from "axios";

const Home = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/test/all").then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        console.error(error);
        setContent("Error loading public content.");
      }
    );
  }, []);

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Public Content
          </Typography>
          <Typography>{content}</Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;