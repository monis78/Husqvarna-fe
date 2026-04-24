import React from "react";
import { Box } from "@mui/material";
import Header from "../../component/Header/Header";
import ChatInputComponent from "./ChatInputComponent";

const Chatbot = () => {
  

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        maxWidth: 600,
        margin: "auto",
        border: "1px solid #ddd",
      }}
    >
      <Header />
      <ChatInputComponent />
    </Box>
  );
};

export default Chatbot;