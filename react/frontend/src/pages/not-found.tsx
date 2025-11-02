import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <h1 className="notfound-header">404</h1>
        <h2 className="notfound-subHeader">Page Not Found</h2>
        <p className="notfound-description">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="notfound-button">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}