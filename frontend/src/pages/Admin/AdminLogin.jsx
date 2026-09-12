import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8081/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem("adminToken", data.token);

        navigate("/admin/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        <div className="admin-logo">
          <img
            src="/images/icon.jpeg"
            alt="V2 Aesthetic Logo"
          />
        </div>

        <span className="admin-tag">
          V2 AESTHETIC
        </span>

        <h1>Welcome Back</h1>

        <p className="admin-subtitle">
          Login to manage your clinic
        </p>

        <form onSubmit={handleLogin}>

          <div className="admin-form-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="admin-login-error">
              {error}
            </p>
          )}

          <div className="admin-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              className="forgot-password"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login to Dashboard"}

            {!loading && <span>→</span>}
          </button>

        </form>

        <a
          href="/"
          className="back-home"
        >
          ← Back to Website
        </a>

        <small className="admin-footer-text">
          V2 Aesthetic Skin & Hair Care Clinic
        </small>

      </div>
    </div>
  );
}

export default AdminLogin;