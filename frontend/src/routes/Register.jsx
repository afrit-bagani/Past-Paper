import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { BASE_URL } from "../config";
import NotificationToast from "../components/NotificationToast";
import styles from "../css/Register.module.css";

const Register = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [toastData, setToastData] = useState(null);

  // toast messgae
  const showToast = (message, variant) => {
    setToastData({ message, variant });
  };
  // Toggle visibility of password
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    (async function createAccount() {
      try {
        setIsRegistering(true);
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });
        setIsRegistering(false);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Register account request failed");
        }
        showToast(data.message, "success");
        setTimeout(() => {
          navigate("/login");
        }, 500);
      } catch (error) {
        showToast(error.message, "danger");
        console.error("Fetch error: \n", error);
      }
    })();
  };

  return (
    <div>
      {toastData && (
        <NotificationToast
          message={toastData.message}
          variant={toastData.variant}
          onClose={() => setToastData(null)}
        />
      )}
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className={`${styles.formContainer} bg-white`}>
          <div className="text-center mb-4">
            <h2 className="text-info fw-bold">Register</h2>
            <p className="text-muted">Create your account</p>
          </div>
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="form-label text-primary fw-semibold"
              >
                Name
              </label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-0">
                  <FaUser className="text-danger fs-4" />
                </span>
                <input
                  type="text"
                  ref={nameRef}
                  id="name"
                  className="form-control"
                  placeholder="Enter Your Name"
                  required
                  disabled={isRegistering}
                />
              </div>
            </div>
            {/* Email Field */}
            <div className="mb-3">
              <label
                htmlFor="email"
                className="form-label fw-semibold text-primary"
              >
                Email
              </label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-0">
                  <FaEnvelope className="text-danger fs-4" />
                </span>
                <input
                  ref={emailRef}
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                  disabled={isRegistering}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-3 position-relative">
              <label
                htmlFor="password"
                className="form-label fw-semibold text-primary"
              >
                Password
              </label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-0">
                  <FaLock className="text-danger fs-4" />
                </span>
                <input
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="form-control"
                  placeholder="Enter your password"
                  required
                  disabled={isRegistering}
                />
                <span
                  className={`${styles.passwordToggle} position-absolute`}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-danger fs-4" />
                  ) : (
                    <FaEye className="text-danger fs-4" />
                  )}
                </span>
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="btn btn-danger w-100 fw-bold py-2"
              disabled={isRegistering}
            >
              {!isRegistering ? "Register" : "Registering..."}
            </button>
          </form>
          <p className="text-center mt-3 text-muted">
            Already have an account?{" "}
            <Link to={`${BASE_URL}/login`} className="text-primary fw-semibold">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
