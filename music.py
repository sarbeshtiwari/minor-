import streamlit as st
from streamlit_webrtc import webrtc_streamer
import av
import cv2 
import numpy as np 
import mediapipe as mp 
from keras.models import load_model
import requests
from streamlit_player import st_player
from keras.models import model_from_json
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from PIL import Image, ImageOps
from streamlit_webrtc import webrtc_streamer, VideoTransformerBase, RTCConfiguration, VideoProcessorBase, WebRtcMode
import time
import random

model  = load_model("model.h5")
label = np.load("labels.npy")

# Mediapipe Holistic object for pose detection
holistic = mp.solutions.holistic
hands = mp.solutions.hands
holis = holistic.Holistic()

page_bg = """
<style>
/* Background */
[data-testid="stAppViewContainer"] {
    background: linear-gradient(to bottom, #FFD1DC, #FFE4E1);
}

/* Sidebar */
[data-testid="stSidebar"] {
    background-color: #FFF0F5;
}

/* Main titles */
h1, h2, h3, h4, h5, h6 {
    color: #4B2E2E !important; /* dark chocolate text */
    font-weight: 600;
}

/* Regular text */
p, span, label, div {
    color: #3D3D3D !important; /* dark grey text */
    font-size: 16px;
}

/* Sidebar text */
[data-testid="stSidebar"] * {
    color: #333 !important;
}

/* Dropdowns & buttons */
.stSelectbox, .stButton button {
    color: #fff !important;
    background: #FF69B4 !important; /* hot pink button */
    border-radius: 10px;
    font-weight: 600;
}

/* Error / Success / Warning boxes */
.stAlert {
    border-radius: 12px;
    font-weight: 500;
}
</style>
"""

# List of Indian singers for recommendation
indian_singers = ["Lata Mangeshkar", "Arijit Singh", "Kishore Kumar", "Shreya Ghoshal", "Mohammed Rafi", "Sonu Nigam", "Asha Bhosle", "Kumar Sanu", "Alka Yagnik", "Udit Narayan", "Sunidhi Chauhan", "Atif Aslam", "Neha Kakkar", "A.R. Rahman", "Shaan", "Javed Ali", "Hariharan", "Kailash Kher", "Shankar Mahadevan", "Ankit Tiwari"]

# Function to process video frames for emotion detection

def program():
    st.header("EMORSIC")
    if "run" not in st.session_state:
        st.session_state["run"] = "true"
    try:
        emotion = np.load("emotion.npy")[0]
    except:
        emotion=""
    if not(emotion):
        st.session_state["run"] = "true"
    else:
        st.session_state["run"] = "false"

    class EmotionProcessor:
        def recv(self, frame):
            frm = frame.to_ndarray(format="bgr24")
            frm = cv2.flip(frm, 1)
            res = holis.process(cv2.cvtColor(frm, cv2.COLOR_BGR2RGB))
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
                for i in range(42):
                    lst.append(0.0)

            if res.right_hand_landmarks:
                for i in res.right_hand_landmarks.landmark:
                    lst.append(i.x - res.right_hand_landmarks.landmark[8].x)
                    lst.append(i.y - res.right_hand_landmarks.landmark[8].y)
                                
            else:
                for i in range(42):
                    lst.append(0.0)

            lst = np.array(lst).reshape(1,-1)
            pred = label[np.argmax(model.predict(lst))]
            print(pred)
            cv2.putText(frm, pred, (50,50),cv2.FONT_ITALIC, 1, (255,0,0),2)
            np.save("emotion.npy", np.array([pred]))
			
            drawing.draw_landmarks(frm, res.face_landmarks, holistic.FACEMESH_TESSELATION,
            landmark_drawing_spec=drawing.DrawingSpec(color=(0,0,255), thickness=-1, circle_radius=1),
            connection_drawing_spec=drawing.DrawingSpec(thickness=1))
            drawing.draw_landmarks(frm, res.left_hand_landmarks, hands.HAND_CONNECTIONS)
            drawing.draw_landmarks(frm, res.right_hand_landmarks, hands.HAND_CONNECTIONS)

            return av.VideoFrame.from_ndarray(frm, format="bgr24")

    lang = st.text_input("Language")
    singer = st.text_input("Singer")

    webrtc_streamer(key="key",  video_processor_factory=EmotionProcessor)

    btn = st.button("Recommend me songs")
    
    if singer == '':
        random_singer = random.choice(indian_singers)
        sing = random_singer
    else:
        sing = singer

    if btn:
        if not(emotion):
            st.warning("Please let me capture your emotion first")
            st.session_state["run"] = "true"
        else:            
            cv2.destroyAllWindows()
            # YouTube Data API to search for videos and get the video ID of the top result
            youtube_data_api_key = 'AIzaSyDcnx509ugit4gUCp7m1926QplAN_5MnuQ'
           
            search_query = f"{emotion} {lang}song {sing}"
            print(sing)            
           
            search_url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q={search_query}&key={youtube_data_api_key}"
            response = requests.get(search_url)
            print(search_url)
            data = response.json()
            if data['items']:
                for item in data['items']:
                    if 'id' in item and 'videoId' in item['id']:
                        video_id = item['id']['videoId']
                        # Play the video in an embedded player
                        st_player(f"https://www.youtube.com/watch?v={video_id}")

                        np.save("emotion.npy", np.array([""]))
                        st.session_state["run"] = "false"
            else:
                st.error("No videos found. Please try again.")

def main():
    st.markdown(page_bg, unsafe_allow_html=True)
    st.title("AI Mental Health")
    activiteis = ["Home", "About", "Try Emorsic"]
    choice = st.sidebar.selectbox("Select Activity", activiteis)
    if choice == "Home":
        html_temp_home1 = """<div style="background-color:#6D7B8D;padding:10px">
                            <h4 style="color:white;text-align:center;">
                            AI mental health application using OpenCV, Custom CNN model and Streamlit.</h4>
                            </div>
                            </br>"""
        st.markdown(html_temp_home1, unsafe_allow_html=True)
        st.write("""
                 The application has two functionalities.

                 1. Real time face detection using web cam feed.

                 2. Real time face emotion recognization and music suggestion.

                 """)
        
    elif choice == "About":
        st.write("What is Emorsic?")
        st.write("Emotion-detecting music players hold the potential to revolutionize the way people interact with their music libraries. By leveraging advanced emotion analysis techniques, this technology offers a highly personalized and immersive listening experience. It's not just about playing songs; it's about curating the perfect playlist that resonates with the user's prevailing emotions and individual musical preferences.")
        st.write("Why Emorsic?")
        st.write("In the current digital age, music has become an integral part of our daily lives. However, the existing music players offer a static experience, lacking personalization and adaptability to the user’s emotional state. This project aims to develop a cutting-edge emotion-detecting music player that dynamically adapts to the user’s emotional state, providing a highly personalized and immersive listening experience.")

    elif choice == "Try Emorsic":
        st.header("Webcam Live Feed")
        st.write("Click on start to use webcam and detect your face emotion")
        choice = st.selectbox("Select Mode", ["Select a mode", "Video", "Photo"])
        if choice == "Video":
            st.write("Click on start to use webcam and detect your face emotion")
            st.error("You will get video experience in this mode")
            st.success("Use Photo mode for audio experience")
            st.error("Its correct prediiction rate is only 52%")
            program()
        elif choice == 'Select a mode':
              st.write("Choose a mode to experience the Emorsic")
              st.error("Use Photo mode (Under Testing)")
              st.success("Use Video mode (Recommended)")
        elif choice == "Photo":
            st.error("This can predict 0%")
            img = st.camera_input("Webcam", key="webcam")
            if img is not None:
                image = Image.open(img)
                image = np.array(image)
                res = classify_image(image)
                st.write(res)
                if len(res) != 0:
                    if res[0] == 'angry':
                        st.error("You are angry")
                        play_sound(angry)

                    elif res[0] == 'happy':
                        st.success("You are happy")
                        play_sound(happy)

                    elif res[0] == 'neutral':
                        st.write("You are neutral")
                        play_sound(neutral)

                    elif res[0] == 'sad':
                        st.write("You are sad")
                        play_sound(sad)

                    elif res[0] == 'surprise':
                        st.success("You are surprise")
                        play_sound(surprise)
                else:
                    st.error("No emotion detected")

    else:
        pass


#load face
try:
    face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
except Exception:
    st.write("Error loading cascade classifiers")


RTC_CONFIGURATION = RTCConfiguration({"iceServers": [{"urls": ["stun:stun.l.google.com:19302"]}]})


angry = 'https://www.youtube.com/embed/j1hrZIA-2nM'
happy = 'https://www.youtube.com/embed/tNca0jr850M'
neutral = 'https://www.youtube.com/embed/gZGLnxVrzD0'
sad = 'https://www.youtube.com/embed/e4N9al7vhVQ'
surprise = 'https://www.youtube.com/embed/dOKQeqGNJwY'

# load model
emotion_dict = {2:'angry', 1 :'happy', 0: 'neutral', 3:'sad', 4: 'surprise'}

# load json and create model
json_file = open('emotion_model1.json', 'r')
loaded_model_json = json_file.read()
json_file.close()
classifier = model_from_json(loaded_model_json)

# load weights into new model
classifier.load_weights("emotion_model1.h5")

def play_sound(link):
    html_string="""
               <iframe width="1" height="1"  src="{}?autoplay=1" ></iframe>
            """.format(link)
    sound = st.empty()
    sound.markdown(html_string, unsafe_allow_html=True)
    time.sleep(400)
    sound.empty()

def classify_image(face):
    resu = []
    face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(face, 1.3, 5)
    for (x, y, w, h) in faces:
        face = face[y:y + h, x:x + w]
        face = cv2.resize(face, (48, 48), interpolation=cv2.INTER_AREA)
        if np.sum([face]) != 0:
            face = face.astype("float") / 255.0
            face = img_to_array(face)
            face = np.expand_dims(face, axis=0) #48,48,1
            face = preprocess_input(face)
            pred = classifier.predict(face)[0]
            pred = int(np.argmax(pred)) # 0.98, 0.01, 0.01, 0.01, 0.01 = 1
            final_pred = emotion_dict[pred]  # happy
            output = str(final_pred) # happy 
            resu.append(output)

    return resu


if __name__ == "__main__":
    main()
