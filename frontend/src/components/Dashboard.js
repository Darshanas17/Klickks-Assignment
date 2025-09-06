import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

import "../App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Dashboard({ setIsAuthenticated }) {
  const [userId, setUserId] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Determine greeting and fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Greeting based on current time
        const hour = new Date().getHours();
        setGreeting(
          hour < 12
            ? "Good Morning"
            : hour < 18
            ? "Good Afternoon"
            : "Good Evening"
        );

        // Fetch user info from backend
        const res = await fetch(`${API_URL}/api/dashboard`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Not authenticated");

        const data = await res.json();
        setUserId(data.userId);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, setIsAuthenticated]);

  // 🔹 Logout handler
  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("Logout failed. Please try again.");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="dashboard-page">
      <button className="logout-btn-fixed" onClick={handleLogout}>
        Logout
      </button>

      <img
        src="https://res.cloudinary.com/du3fq1wgm/image/upload/v1757082995/klickks_logo_nyhatm.png"
        alt="Klickks Logo"
        className="dashboard-logo"
      />

      <div className="dashboard-container">
        <h2 className="dashboard-greeting">{greeting}!</h2>
        <p className="user-id-display">
          {userId ? (
            <>
              Your User ID: <strong>{userId}</strong>
            </>
          ) : (
            "Could not load user info."
          )}
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
