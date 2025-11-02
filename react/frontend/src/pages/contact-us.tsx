import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!name || !email || !message) {
      toast.warning("Please fill all fields!");
      return;
    }

    toast.success("Your message has been sent!");
    
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.header}>Contact Us</h1>

      <div style={styles.formContainer}>
        <p style={styles.description}>
          We'd love to hear from you! Send us a message, feedback, or any queries regarding Emorsic.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <textarea
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ ...styles.input, height: "120px", resize: "none" }}
          />
          <button type="submit" style={styles.button}>Send Message</button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#121212",
    color: "#ffffff",
    fontFamily: "'Poppins', sans-serif",
    padding: "40px 20px",
    textAlign: "center",
  },
  header: {
    color: "#ff4d6d",
    marginBottom: "20px",
  },
  description: {
    maxWidth: "600px",
    margin: "0 auto 30px",
    color: "#cccccc",
  },
  formContainer: {
    backgroundColor: "#1f1f1f",
    padding: "30px",
    borderRadius: "15px",
    maxWidth: "600px",
    margin: "0 auto",
    boxShadow: "0 6px 12px rgba(0,0,0,0.4)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid #333",
    backgroundColor: "#2a2a2a",
    color: "#ffffff",
    fontSize: "16px",
  },
  button: {
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#ff4d6d",
    color: "#ffffff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};
