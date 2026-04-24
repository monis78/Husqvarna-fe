import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Message } from "../../type/message";
import { streamQueryResponse } from "../../services/chatService";

const ChatInputComponent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const chatEndRef: React.RefObject<HTMLDivElement | null> = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const updateAssistantMessage = (messageIndex: number, text: string) => {
    setMessages((prev) =>
      prev.map((message, index) =>
        index === messageIndex ? { ...message, text } : message,
      ),
    );
  };

  const sendMessage = async () => {
    const query = input.trim();

    if (!query || loading) return;

    const userMessage: Message = { role: "user", text: query };
    const assistantMessage: Message = { role: "assistant", text: "" };
    const assistantMessageIndex = messages.length + 1;

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
    setLoading(true);

    try {
      const streamedText = await streamQueryResponse({
        query,
        onTextUpdate: (text) =>
          updateAssistantMessage(assistantMessageIndex, text),
      });

      if (!streamedText) {
        updateAssistantMessage(assistantMessageIndex, "No response received.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unable to connect";

      updateAssistantMessage(assistantMessageIndex, `Error: ${errorMessage}`);
      setStreamError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            <Paper
              sx={{
                p: 1.5,
                maxWidth: "70%",
                bgcolor: msg.role === "user" ? "#1976d2" : "#f1f1f1",
                color: msg.role === "user" ? "white" : "black",
              }}
            >
              <Typography variant="body2">{msg.text}</Typography>
            </Paper>
          </Box>
        ))}

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <CircularProgress size={20} />
          </Box>
        )}

        <div ref={chatEndRef} />
      </Box>

      <Box sx={{ display: "flex", p: 1, borderTop: "1px solid #ddd" }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <IconButton onClick={sendMessage} disabled={loading || !input.trim()}>
          <SendIcon />
        </IconButton>
      </Box>

      <Snackbar
        open={Boolean(streamError)}
        autoHideDuration={5000}
        onClose={() => setStreamError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setStreamError(null)}
        >
          {streamError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChatInputComponent;
