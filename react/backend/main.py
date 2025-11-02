from fastapi import FastAPI, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from keras.models import load_model
import numpy as np
import mediapipe as mp
import cv2
import requests
import random
import io
from PIL import Image

app = FastAPI()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for dev (restrict later)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Load Model ----------------
model = load_model("model.h5")
label = np.load("labels.npy")

mp_holistic = mp.solutions.holistic
holistic = mp_holistic.Holistic()

# ---------------- Constants ----------------
YOUTUBE_API_KEY = "AIzaSyDcnx509ugit4gUCp7m1926QplAN_5MnuQ"
indian_singers = [
    "Lata Mangeshkar", "Arijit Singh", "Kishore Kumar", "Shreya Ghoshal",
    "Mohammed Rafi", "Sonu Nigam", "Asha Bhosle", "Kumar Sanu", "Alka Yagnik",
    "Udit Narayan", "Sunidhi Chauhan", "Atif Aslam", "Neha Kakkar",
    "A.R. Rahman", "Shaan", "Javed Ali", "Hariharan", "Kailash Kher",
    "Shankar Mahadevan", "Ankit Tiwari"
]

# ---------------- Emotion Prediction ----------------
@app.post("/predict_emotion/video/")
async def predict_emotion(file: UploadFile = File(...)):
    contents = await file.read()
    img = np.array(Image.open(io.BytesIO(contents)).convert("RGB"))
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    img = cv2.flip(img, 1)

    res = holistic.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))

    lst = []
    if res.face_landmarks:
        for i in res.face_landmarks.landmark:
            lst.append(i.x - res.face_landmarks.landmark[1].x)
            lst.append(i.y - res.face_landmarks.landmark[1].y)

    if res.left_hand_landmarks:
        for i in res.left_hand_landmarks.landmark:
            lst.append(i.x - res.left_hand_landmarks.landmark[8].x)
            lst.append(i.y - res.left_hand_landmarks.landmark[8].y)
    else:
        lst.extend([0.0] * 42)

    if res.right_hand_landmarks:
        for i in res.right_hand_landmarks.landmark:
            lst.append(i.x - res.right_hand_landmarks.landmark[8].x)
            lst.append(i.y - res.right_hand_landmarks.landmark[8].y)
    else:
        lst.extend([0.0] * 42)

    lst = np.array(lst).reshape(1, -1)
    pred = label[np.argmax(model.predict(lst))]
    print(f"Predicted emotion: {pred}")

    return {"emotion": pred}

# ---------------- Song Recommendation ----------------
@app.get("/recommend_song")
async def recommend_song(
    emotion: str = Query(...),
    lang: str = Query(""),
    singer: str = Query("")
):
    if not singer:
        singer = random.choice(indian_singers)

    search_query = f"{emotion} {lang} song {singer}"
    url = (
        f"https://www.googleapis.com/youtube/v3/search?"
        f"part=snippet&maxResults=1&q={search_query}&key={YOUTUBE_API_KEY}"
    )
    response = requests.get(url)
    data = response.json()

    if "items" in data and len(data["items"]) > 0:
        video_id = data["items"][0]["id"]["videoId"]
        video_url = f"https://www.youtube.com/watch?v={video_id}"
        return {
            "emotion": emotion,
            "singer": singer,
            "video_url": video_url
        }
    else:
        return {"error": "No videos found for this emotion/singer."}
