import React, { useState } from "react";
import {
  Box,
  Fab,
  Paper,
  Typography,
  IconButton,
  TextField,
  Divider
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { baseURL, chatBotEndpoint } from "./config";

const ChatbotUI = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
const formatResponse = (text) => {
  return text
    .replace(/\n/g, "\n")
    .replace(/\*/g, "•"); // optional: replace * with bullet
};
  const handleSend = () => {
    if (!input.trim()) return;
    const user=localStorage.getItem('user')
    const body={
        "query":input
    }
    axios.post(`${baseURL}${chatBotEndpoint}`,body,{
        headers:{
            Authorization:user.token
        }
    }).then(res=>{
        console.log(res.data.response)
        setMessages((prev) => [
          ...prev,
          { text: input, sender: "user" },
          { text: `🤖 ${formatResponse(res.data.response)}`, sender: "bot" }
        ]);

    }).catch(err=>console.log(err))


    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
      <Fab
        color="primary"
        onClick={() => setOpen(!open)}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000
        }}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </Fab>

      {/* Chat Window */}
      {open && (
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            bottom: 90,
            right: 20,
            width: 320,
            height: 420,
            display: "flex",
            flexDirection: "column",
            borderRadius: "16px",
            overflow: "hidden"
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #6a11cb, #2575fc)",
              color: "#fff",
              padding: "10px 15px"
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Chatbot
            </Typography>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              padding: 1.5,
              overflowY: "auto",
              backgroundColor: "#f5f7fa"
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  mb: 1
                }}
              >
                <Box
                  sx={{
                    background:
                      msg.sender === "user"
                        ? "#2575fc"
                        : "#e0e0e0",
                    color: msg.sender === "user" ? "#fff" : "#000",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    maxWidth: "75%"
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Divider />

          {/* Input */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "8px"
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px"
                }
              }}
            />
            <IconButton color="primary" onClick={handleSend}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default ChatbotUI;