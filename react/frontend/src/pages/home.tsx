import { CameraVideo, EmojiSmile, MusicNoteBeamed } from "react-bootstrap-icons";
// import heroBg from '../assets/react.svg';

export default function Home() {
  return (
  <div className="home-page dark-mode">
    <section className="py-5 hero-section" style={{
      // background: `url(${heroBg}) center/cover no-repeat`,
      // height: '100vh',
      // position: 'relative',
      // overflow: 'hidden',
    }}> 
      <div className="container text-center"> 
        <h1 className="display-4 fw-bold hero-title"> Emorsic: AI-Powered Emotion Detection </h1> 
        <p className="lead mt-3 hero-subtitle"> Discover your emotions in real-time using live facial expression analysis and get personalized mental health insights. </p> 
        <a href="/try-emorsic" className="btn btn-primary btn-lg rounded-pill mt-3 hero-btn"> Try Emorsic Now </a> 
      </div> 
    </section>
    <section className="py-5 about-section"> 
      <div className="container"> 
        <h2 className="fw-bold mb-4 text-center about-title">About Emorsic</h2> 
        <p className="text-center mx-auto about-text" style={{ maxWidth: '700px' }}> Emorsic is an AI-powered platform that predicts your emotions by analyzing your <strong>live facial expressions</strong> and written text. It provides real-time, personalized insights to improve your mental wellness. </p> 
        <p className="text-center mx-auto mt-3 about-text" style={{ maxWidth: '700px' }}> By combining computer vision, emotion recognition, and AI analytics, Emorsic offers actionable recommendations for personal reflection, professional support, or social/academic analysis. </p> 
      </div>
    </section>
    <section className="py-5 how-it-works"> 
      <div className="container"> 
        <h2 className="fw-bold mb-5 text-center section-title">How It Works</h2> 
        <div className="row g-4"> 
          <div className="col-md-4 text-center"> 
            <div className="p-4 shadow-sm rounded bg-dark card-dark h-100"> 
              <CameraVideo className="mb-3" size={40} style={{ color: '#6C63FF' }} /> 
              <h5 className="fw-bold mb-3">Step 1</h5> 
              <p>Allow Emorsic to access your device camera to capture live facial expressions.</p> 
            </div> 
          </div> 
          <div className="col-md-4 text-center"> 
            <div className="p-4 shadow-sm rounded bg-dark card-dark h-100"> 
              <EmojiSmile className="mb-3" size={40} style={{ color: '#FFD166' }} /> 
              <h5 className="fw-bold mb-3">Step 2</h5> 
              <p>Our AI analyzes micro-expressions and emotional patterns in real-time.</p> 
            </div> 
          </div> 
          <div className="col-md-4 text-center"> 
            <div className="p-4 shadow-sm rounded bg-dark card-dark h-100"> 
              <MusicNoteBeamed className="mb-3" size={40} style={{ color: '#06D6A0' }} /> 
              <h5 className="fw-bold mb-3">Step 3</h5> 
              <p>Receive a prediction score, mood insights, and recommendations to enhance mental wellness.</p> 
            </div> 
          </div> 
        </div> 
      </div> 
    </section> 
    <section className="py-5 use-cases"> 
      <div className="container"> 
        <h2 className="fw-bold mb-5 text-center section-title">Use Cases</h2> 
        <div className="row g-4"> 
          <div className="col-md-4"> 
            <div className="p-4 border rounded text-center h-100 card-dark"> 
              <h5 className="fw-bold mb-3">Personal Wellness</h5> 
              <p>Track your emotions and mood trends for improved self-awareness and mental health.</p> 
            </div> 
          </div> 
          <div className="col-md-4"> 
            <div className="p-4 border rounded text-center h-100 card-dark"> 
              <h5 className="fw-bold mb-3">Professional Support</h5> 
              <p>Help HR, therapists, or counselors analyze feedback and understand emotional context.</p> 
            </div> 
          </div> 
          <div className="col-md-4"> 
            <div className="p-4 border rounded text-center h-100 card-dark"> 
              <h5 className="fw-bold mb-3">Social & Academic</h5> 
              <p>Analyze posts, messages, or student feedback to understand emotional patterns.</p> 
            </div> 
          </div> 
        </div> 
      </div> 
    </section>
    <section className="py-5 sample-predictions"> 
      <div className="container"> 
        <h2 className="fw-bold mb-5 text-center section-title">Sample Predictions</h2> 
        <div className="row g-4"> 
          <div className="col-md-4"> 
            <div className="p-4 rounded shadow-sm bg-dark card-dark text-center"> 
              <p className="fw-bold">Input:</p> <p>"I feel stressed about my exams."</p> 
              <p className="text-warning fw-bold">Emotion: Anxiety</p> 
            </div> 
          </div> 
          <div className="col-md-4"> 
            <div className="p-4 rounded shadow-sm bg-dark card-dark text-center"> 
              <p className="fw-bold">Input:</p> 
              <p>"I am so happy with my promotion!"</p> 
              <p className="text-success fw-bold">Emotion: Joy</p> 
            </div> 
          </div> 
          <div className="col-md-4"> 
            <div className="p-4 rounded shadow-sm bg-dark card-dark text-center"> 
              <p className="fw-bold">Input:</p> 
              <p>"Feeling lonely today."</p> 
              <p className="text-info fw-bold">Emotion: Sadness</p> 
            </div> 
          </div>
        </div> 
      </div> 
    </section>
    <section className="py-5 text-center cta-section">
      <div className="container">
        <h3 className="fw-bold section-title mb-4">Ready to explore your emotions?</h3> 
        <a href="/try-emorsic" className="btn btn-primary btn-lg rounded-pill"> Try Emorsic Now </a> 
      </div> 
    </section> 
  </div>
  );
}
