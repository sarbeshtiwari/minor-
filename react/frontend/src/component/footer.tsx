import { Facebook, Twitter, Instagram, Linkedin } from "react-bootstrap-icons";

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-3">
      <div className="container">
        <div className="d-flex justify-content-center gap-3 mb-3">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-white">
            <Facebook size={24} />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-white">
            <Twitter size={24} />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-white">
            <Instagram size={24} />
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white">
            <Linkedin size={24} />
          </a>
        </div>
        <div className="d-flex justify-content-center gap-4 mb-3">
          <a href="/privacy-policy" className="text-white text-decoration-none">
            Privacy Policy
          </a>
          <a href="/terms-conditions" className="text-white text-decoration-none">
            Terms & Conditions
          </a>
          <a href="/contact-us" className="text-white text-decoration-none">
            Contact Us
          </a>
        </div>
        <hr className="border-secondary" />
        <div className="text-center text-white pt-3" style={{ fontSize: '0.9rem' }}>
          &copy; 2025 Emorsic. All rights reserved.
        </div>
      </div>
    </footer>
  );
}