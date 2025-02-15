import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import TrackVisitor from "../components/TrackVisitor";

function LandingPage() {
  const navigate = useNavigate();

  function handleGetStartedButton() {
    navigate("/home");
  }

  return (
    <>
      <TrackVisitor />
      <div className="pt-2 my-3 text-center border-bottom">
        <h1 className="display-4 fw-bold text-body-emphasis">
          Ace Your Exams with Past Papers
        </h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">
            Access, Download, and Prepare yourself with Collection of Past
            Question Papers for Every Department and Semester.
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-3">
            <button
              type="button"
              className="btn btn-primary btn-lg px-4 me-sm-3"
              onClick={handleGetStartedButton}
            >
              Get Started <FaArrowRight />
            </button>
          </div>
        </div>
        <div className="overflow-hidden" style={{ maxHeight: "50vh" }}>
          <div className="container px-2">
            <img
              src="/Books.jpg"
              className="img-fluid border rounded-3 shadow-lg mb-2"
              alt="Books image"
              width="1000"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
