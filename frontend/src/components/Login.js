import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

import "../App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        if (res.ok) {
          navigate("/dashboard", { replace: true });
        }
      } catch (err) {
        console.error("Session check error:", err);
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Login successful!");
        setIsAuthenticated(true);

        // Short delay to show success message
        setTimeout(() => navigate("/dashboard", { replace: true }), 800);
      } else {
        setStatus("error");
        setMessage(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setStatus("error");
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-image">
        <img
          src="https://res.cloudinary.com/du3fq1wgm/image/upload/v1757082594/sign_in_v4hblf.avif"
          alt="Login Illustration"
        />
      </div>

      <div className="login-form-container">
        <img
          src="https://res.cloudinary.com/du3fq1wgm/image/upload/v1757082995/klickks_logo_nyhatm.png"
          alt="Klickks Logo"
          className="auth-logo"
        />
        <h2 className="form-title">Login</h2>

        <form onSubmit={handleLogin} className="auth-form">
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Show Password
          </label>

          <button
            type="submit"
            className="form-btn"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <BeatLoader color="#ffffff" loading={true} size={8} margin={2} />
            ) : (
              "Login"
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
            Don’t have an account?{" "}
            <button
              className="link-btn"
              onClick={() => navigate("/register", { replace: true })}
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
