import { Box, Typography } from "@mui/material";

const Header = () => {
  return (
    <Box sx={{ p: 2, bgcolor: "#1976d2", color: "white" }}>
      <Typography variant="h6">AI Chatbot</Typography>
    </Box>
  );
};

export default Header;