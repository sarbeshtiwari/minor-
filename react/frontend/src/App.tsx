import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import TryEmorsic from "./pages/emorsic";
import Header from "./component/header";
import Footer from "./component/footer";
import ContactUs from "./pages/contact-us";
import NotFound from "./pages/not-found";
import ChatButton from "./component/chatbutton";

function App() {
  return (
    <Router>
      <ChatButton/>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/try-emorsic" element={<TryEmorsic />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer/>
    </Router>
  );
}

export default App;
