import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // replace with your API

export default function ChatButton() {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ sender: "bot" | "user"; text: string }[]>([]);
  const [userName, setUserName] = useState<string | null>(null);

  // Fetch initial greeting from API when chat opens
  useEffect(() => {
    if (open && chatHistory.length === 0) {
      axios
        .get(`${API_URL}/chat/init`)
        .then((res) => {
          const text = res.data.message || "Hey, glad to meet you! May I know your name, please?";
          setChatHistory([{ sender: "bot", text }]);
        })
        .catch((err) => {
          console.error("API Error:", err);
          setChatHistory([{ sender: "bot", text: "Hey, glad to meet you! May I know your name, please?" }]);
        });
    }
  }, [open, chatHistory.length]);

  const handleSend = async () => {
    if (message.trim() === "") return;

    // Add user's message
    setChatHistory((prev) => [...prev, { sender: "user", text: message }]);
    
    let userMsg = message.trim();
    setMessage("");

    // If userName is not set, treat this first message as name
    if (!userName) {
      setUserName(userMsg);
      const botReply = `Nice to meet you, ${userMsg}! How can I help you today?`;
      setChatHistory((prev) => [...prev, { sender: "bot", text: botReply }]);
      return;
    }

    // Otherwise, call API for normal chat response
    try {
      const res = await axios.post(`${API_URL}/chat/respond`, { message: userMsg, name: userName });
      const botText = res.data.message || "Sorry, I didn't understand that.";
      setChatHistory((prev) => [...prev, { sender: "bot", text: botText }]);
    } catch (err) {
      console.error("Chat API Error:", err);
      setChatHistory((prev) => [...prev, { sender: "bot", text: "Oops! Something went wrong." }]);
    }
  };

  return (
    <div
      style={styles.container}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && !open && <div style={styles.tooltip}>Need counselling? Chat now</div>}

      <button
        style={{ ...styles.button, ...(hovered ? styles.buttonHover : {}) }}
        onClick={() => setOpen(!open)}
      >
        💬
      </button>

      {open && (
        <div style={styles.chatBox}>
          <div style={styles.chatHeader}>Counselling Chat</div>
          <div style={styles.chatBody}>
            {chatHistory.length === 0 ? (
              <div style={styles.placeholder}>Loading...</div>
            ) : (
              chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  style={msg.sender === "bot" ? styles.botMessage : styles.userMessage}
                >
                  {msg.text}
                </div>
              ))
            )}
          </div>
          <div style={styles.chatFooter}>
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={styles.input}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              autoFocus
            />
            <button style={styles.sendButton} onClick={handleSend}>
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Dark-mode styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
  },
  button: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#ff4d6d",
    color: "#fff",
    fontSize: "28px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 10px rgba(255,77,109,0.4)",
    transition: "all 0.3s ease",
  },
  buttonHover: {
    boxShadow: "0 0 20px 4px #ff4d6d",
    transform: "scale(1.1)",
  },
  tooltip: {
    marginBottom: "10px",
    padding: "6px 12px",
    borderRadius: "8px",
    backgroundColor: "#1f1f1f",
    color: "#fff",
    fontSize: "0.9rem",
    whiteSpace: "nowrap",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    opacity: 0.9,
  },
  chatBox: {
    marginTop: "10px",
    width: "320px",
    height: "400px",
    backgroundColor: "#1f1f1f",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
  },
  chatHeader: {
    padding: "12px",
    backgroundColor: "#ff4d6d",
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  chatBody: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    color: "#fff",
  },
  placeholder: {
    color: "#aaa",
    fontSize: "0.9rem",
    textAlign: "center",
    marginTop: "50%",
  },
  botMessage: {
    backgroundColor: "#2a2a2a",
    padding: "8px 12px",
    borderRadius: "12px",
    marginBottom: "8px",
    maxWidth: "80%",
    alignSelf: "flex-start",
  },
  userMessage: {
    backgroundColor: "#ff4d6d",
    padding: "8px 12px",
    borderRadius: "12px",
    marginBottom: "8px",
    maxWidth: "80%",
    alignSelf: "flex-end",
    color: "#fff",
  },
  chatFooter: {
    display: "flex",
    padding: "8px",
    borderTop: "1px solid #333",
    gap: "8px",
  },
  input: {
    flex: 1,
    padding: "8px 12px",
    borderRadius: "12px",
    border: "1px solid #333",
    backgroundColor: "#2a2a2a",
    color: "#fff",
  },
  sendButton: {
    padding: "8px 12px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#ff4d6d",
    color: "#fff",
    cursor: "pointer",
  },
};
