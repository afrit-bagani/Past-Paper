import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { BACKEND_URL, FRONTEND_URL } from "../config";
import NotificationToast from "../components/NotificationToast";
import styles from "../css/Login.module.css";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [toastData, setToastData] = useState(null);
  const [isLoging, setIsLoging] = useState(false);

  const showToast = (message, variant) => {
    setToastData({ message, variant });
  };

  // Toggle visibility of password
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    (async function logInAccount() {
      try {
        setIsLoging(true);
        const res = await fetch(`${BACKEND_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });
        setIsLoging(false);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Login request failed");
        }
        showToast(data.message, "success");
        setTimeout(() => {
          navigate("/home");
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
          onClose={() => {
            setToastData(null);
          }}
        />
      )}
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className={`${styles.formContainer} bg-white`}>
          <div className="text-center mb-4">
            <h2 className="text-info fw-bold">Login</h2>
            <p className="text-muted">
              Welcome Back, Please Login Into Your Account
            </p>
          </div>
          <form onSubmit={handleSubmit}>
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
                  type="email"
                  ref={emailRef}
                  id="email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                  disabled={isLoging}
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
                  type={showPassword ? "text" : "password"}
                  ref={passwordRef}
                  id="password"
                  className="form-control"
                  placeholder="Enter your password"
                  required
                  disabled={isLoging}
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

            {/* Sign In Button */}
            <button
              type="submit"
              className="btn btn-danger w-100 fw-bold py-2"
              disabled={isLoging}
            >
              {!isLoging ? "Login" : "Loging..."}
            </button>
          </form>
          <p className="text-center mt-3 text-muted">
            Don't have an account?{" "}
            <Link
              to={`${FRONTEND_URL}/register`}
              className="text-primary fw-semibold"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
