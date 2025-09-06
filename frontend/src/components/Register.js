import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import "../App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Register({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // 🔹 Redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dashboard`, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error("Session check error:", err);
      }
    };
    checkSession();
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    // 🔹 Password match
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match");
      return;
    }

    // 🔹 Password rules
    const errors = [];
    if (password.length < 6) errors.push("at least 6 characters");
    if (!/[a-z]/.test(password)) errors.push("a lowercase letter");
    if (!/[A-Z]/.test(password)) errors.push("an uppercase letter");
    if (!/\d/.test(password)) errors.push("a number");
    if (!/[@$!%*?&]/.test(password))
      errors.push("a special character (@$!%*?&)");

    if (errors.length > 0) {
      setStatus("error");
      setMessage(`Password must contain: ${errors.join(", ")}`);
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Account created! Redirecting...");
        setIsAuthenticated(true);

        setTimeout(() => navigate("/dashboard", { replace: true }), 1200);
      } else {
        setStatus("error");
        setMessage(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setStatus("error");
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-image">
        <img
          src="https://res.cloudinary.com/du3fq1wgm/image/upload/v1757082594/sign_up_v7piwa.avif"
          alt="Register Illustration"
        />
      </div>

      <div className="login-form-container">
        <img
          src="https://res.cloudinary.com/du3fq1wgm/image/upload/v1757082995/klickks_logo_nyhatm.png"
          alt="Klickks Logo"
          className="auth-logo"
        />
        <h2 className="form-title">Register</h2>

        <form onSubmit={handleRegister} className="auth-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="form-input"
          />

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />{" "}
            Show Passwords
          </label>

          <button
            type="submit"
            className="form-btn"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <BeatLoader color="#ffffff" loading={true} size={8} margin={2} />
            ) : (
              "Register"
            )}
          </button>

          {message && (
            <p
              className={`form-message ${
                status === "error" ? "error" : "success"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <div className="switch-auth">
          <p>
            Already have an account?{" "}
            <button
              className="link-btn"
              onClick={() => navigate("/login", { replace: true })}
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
