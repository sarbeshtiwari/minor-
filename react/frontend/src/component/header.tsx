import { Link } from "react-router-dom";
import { PlayCircle } from "react-bootstrap-icons";

export default function Header() {
  return (
    <>
      <header
        className="shadow-lg py-3 mx-3 rounded-pill position-fixed w-100"
        style={{
          backgroundColor: '#282828ff',
          borderRadius: '25px',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          maxWidth: '1200px'
        }}
      >
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="text-decoration-none">
            <h2
              className="m-0 fw-bold"
              style={{
                fontFamily: 'Poppins, sans-serif',
                background: 'linear-gradient(90deg, #6a11cb, #2575fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '1.8rem'
              }}
            >
              Emorsic
            </h2>
          </Link>
          <nav>
            <ul className="nav gap-2 gap-md-3">
              <li className="nav-item">
                <Link
                  to="/try-emorsic"
                  className="nav-link btn btn-primary text-white px-4 rounded-pill d-flex align-items-center"
                  style={{
                    background: 'linear-gradient(90deg, #6a11cb, #2575fc)',
                    border: 'none',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <PlayCircle className="me-2" size={20} /> Try Emorsic
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <div style={{ height: '100px'}}></div>
    </>
  );
}