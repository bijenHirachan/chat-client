import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";

const App = () => {
  // const socket = useMemo(() => io("http://localhost:3000"), []);
  const socket = useMemo(() => io("https://chat-server-lm44.onrender.com"), []);

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);

  const commentBox = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { name, message, room });
    setMessage("");
    setMessages((prev) => [...prev, { sender: "me", message }]);
    commentBox.current.scrollTo({
      top: commentBox.current.scrollHeight,
      behaviour: "smooth",
    });
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", { name, room });
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected", socket.id);
      setSocketId(socket.id);
    });

    socket.on("welcome", (message) => {
      console.log(message);
    });

    socket.on("you-entered", (message) => {
      alert(message);
    });
    socket.on("user-entered", (message) => {
      alert(message);
    });

    socket.on("receive-message", ({ name, message }) => {
      console.log(message);
      setMessages((prev) => [...prev, { sender: name, message }]);
      commentBox.current.scrollTo({
        top: commentBox.current.scrollHeight,
        behaviour: "smooth",
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <Container maxWidth="sm" style={{ marginTop: 16 }}>
      <Typography variant="h4" component={"div"} gutterBottom>
        Enter your name and select room
      </Typography>

      <form onSubmit={joinRoomHandler} style={{ marginTop: 32 }}>
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          id="name"
          label="Name"
          variant="outlined"
          fullWidth
          required
        />
        <FormControl
          style={{ margin: "8px 0", display: "flex", gap: 4 }}
          fullWidth
        >
          <InputLabel id="room-label">Room</InputLabel>
          <Select
            labelId="room-label"
            id="room"
            value={room}
            label="Room"
            onChange={(e) => setRoom(e.target.value)}
            required
          >
            <MenuItem value={"room-one"}>Room One</MenuItem>
            <MenuItem value={"room-two"}>Room Two</MenuItem>
            <MenuItem value={"room-three"}>Room Three</MenuItem>
          </Select>
          <Button type="submit" variant="contained" color="primary">
            Join Room
          </Button>
        </FormControl>
      </form>

      <div
        ref={commentBox}
        style={{
          height: "256px",
          display: "flex",
          flexDirection: "column",
          margin: "8px 0",
          borderRadius: 4,
          border: "1px solid lightgray",
          gap: 2,
          padding: "8px 8px 64px 8px",
          overflowX: "none",
          overflowY: "scroll",
          marginTop: 64,
        }}
      >
        {messages.map((m, i) => (
          <Typography
            key={i}
            alignSelf={m.sender === "me" ? "" : "end"}
            variant="p"
            component={"div"}
            gutterBottom
            style={{
              backgroundColor: "gray",
              padding: "20px 8px 8px 8px",
              width: "fit-content",
              borderRadius: "8px",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
              position: "relative",
              minWidth: 132,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                backgroundColor: "lightgray",
                borderRadius: 6,
                padding: "0px 4px",
                color: "gray",
                fontSize: 10,
              }}
            >
              {m.sender === "me" ? "Me " : `${m.sender}`}
            </span>
            {m.message}
          </Typography>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          marginTop: 48,
        }}
      >
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="message"
          label="Message"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
    </Container>
  );
};

export default App;
