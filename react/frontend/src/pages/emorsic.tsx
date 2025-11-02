import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://127.0.0.1:8000";

export default function TryEmorsic() {
  const [emotion, setEmotion] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [lang, setLang] = useState("");
  const [singer, setSinger] = useState("");
  const [faceDetected, setFaceDetected] = useState(false);
  const [autoCalled, setAutoCalled] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);

  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const detectionInterval = useRef<number | undefined>(undefined);
  const autoRecommendTimeout = useRef<number | undefined>(undefined);
  
  const detectEmotion = async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const blob = await fetch(imageSrc).then((res) => res.blob());
    const formData = new FormData();
    formData.append("file", blob, "frame.jpg");

    try {
      const res = await axios.post(`${API_URL}/predict_emotion/video/`, formData);
      setEmotion(res.data.emotion);

      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      const video = webcamRef.current?.video;
      if (!video) return;
      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;
      ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);
      const rectWidth = video.videoWidth / 3;
      const rectHeight = video.videoHeight / 2.5;
      const rectX = (video.videoWidth - rectWidth) / 2;
      const rectY = (video.videoHeight - rectHeight) / 2;
      ctx.strokeStyle = "#ff6b81";
      ctx.lineWidth = 4;
      ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
      ctx.fillStyle = "#ff6b81";
      ctx.font = "24px Poppins, sans-serif";
      ctx.fillText(res.data.emotion, rectX + 10, rectY - 10);

      setFaceDetected(true);
    } catch (err) {
      console.error("Emotion detection error:", err);
      toast.error("Emotion detection failed!");
    }
  };

  useEffect(() => {
    detectionInterval.current = setInterval(detectEmotion, 2500); // every 2.5s

    // Auto recommend song after 15 seconds
    autoRecommendTimeout.current = setTimeout(() => {
      if (!videoUrl && emotion) {
        recommendSong();
        setAutoCalled(true);
      }
    }, 15000);

    return () => {
      clearInterval(detectionInterval.current);
      clearTimeout(autoRecommendTimeout.current);
    };
  }, []);

  const recommendSong = async () => {
    clearInterval(detectionInterval.current);
    clearTimeout(autoRecommendTimeout.current);

    if (webcamRef.current && webcamRef.current.video) {
      const stream = webcamRef.current?.video?.srcObject as MediaStream | null;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }

    setCameraActive(false);

    if (!emotion) {
      toast.warning("No emotion detected yet!");
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/recommend_song`, {
        params: { emotion, lang, singer },
      });
      if (res.data.video_url) setVideoUrl(res.data.video_url);
    } catch (err) {
      console.error("Song recommendation error:", err);
      toast.error("Failed to fetch song recommendation!");
    }
  };

  const extractYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.header}>🎵 Emorsic Emotion Music Player 🎵</h1>
      <div style={styles.container}>
        <div style={styles.card}>
          {cameraActive ? (
            <>
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                style={styles.webcam}
              />
              <canvas ref={canvasRef} style={styles.canvas} />
            </>
          ) : (
            <div style={styles.placeholder}>
              <p style={styles.placeholderText}>📷 Camera Off</p>
              <p style={styles.placeholderTextSmall}>Your recommended song will appear here!</p>
            </div>
          )}
        </div>
        <div style={styles.card}>
          <h2 style={{ color: "#ff6b81" }}>Emorsic Controls</h2>
          <div style={styles.inputs}>
            <input
              type="text"
              placeholder="Language"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Singer"
              value={singer}
              onChange={(e) => setSinger(e.target.value)}
              style={styles.input}
            />
          </div>
          <button
            onClick={recommendSong}
            style={styles.button}
            disabled={!!videoUrl || autoCalled}
          >
            Recommend Song
          </button>
          {faceDetected && (
            <div style={{ marginTop: "15px" }}>
              <h3>
                Detected Emotion: <span style={{ color: "#ff6b81" }}>{emotion}</span>
              </h3>
            </div>
          )}
        </div>
      </div>
      {videoUrl && (
        <div style={{ marginTop: "30px", width: "80%", marginLeft: "auto", marginRight: "auto" }}>
          <iframe
            width="100%"
            height="350"
            src={`https://www.youtube.com/embed/${extractYouTubeID(videoUrl)}?autoplay=1&controls=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "12px" }}
          ></iframe>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#121212",
    minHeight: "100vh",
    color: "#e0e0e0",
  },
  header: {
    color: "#ff6b81",
    marginBottom: "30px",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0 6px 12px rgba(0,0,0,0.5)",
    flex: "1 1 300px",
    minHeight: "350px",
    position: "relative",
    color: "#e0e0e0",
  },
  webcam: {
    width: "100%",
    borderRadius: "10px",
  },
  canvas: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  placeholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#ff6b81",
  },
  placeholderText: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  placeholderTextSmall: {
    fontSize: "16px",
    marginTop: "10px",
    color: "#bbb",
  },
  inputs: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    margin: "20px 0",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #444",
    fontSize: "16px",
    backgroundColor: "#2c2c2c",
    color: "#e0e0e0",
  },
  button: {
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#ff6b81",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};
