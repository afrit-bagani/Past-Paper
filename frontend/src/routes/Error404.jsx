import { Link } from "react-router-dom";

function Error404() {
  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-dark">
      <main className="d-flex flex-column justify-content-center align-items-center gap-3">
        <h1 className="display-1 fw-bold text-light">404 - Page Not Found</h1>
        <p className="text-light">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link to="/home" className="btn btn-primary">
          Go Back Home
        </Link>
      </main>
    </div>
  );
}

export default Error404;
