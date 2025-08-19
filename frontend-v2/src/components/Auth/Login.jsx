// src/components/Auth/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { message } from "antd";
import { useLoginMutation } from "../../actions/authApi";

const Login = ({ onNext }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [login, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await login({ email, password }).unwrap();
      const { token, userId } = response; // Assuming the API returns userId
      localStorage.setItem("token", token);

      message.success("Logged in successfully!");
      if (onNext) {
        onNext(userId); // Pass userId to onNext
      } else {
        navigate("/"); // Fallback to homepage if no onNext
      }
    } catch (err) {
      message.error(err?.data?.error || "Login failed");
    }
  };

  return (
    <section className="mn-login p-b-15">
      <div className="mn-title">
        <h2>
          Login<span></span>
        </h2>
        <p>Get access to your Orders, Wishlist, and Recommendations.</p>
      </div>
      <div className="mn-login-content">
        <div className="mn-login-box">
          <div className="mn-login-wrapper">
            <div className="mn-login-container">
              <div className="mn-login-form">
                <form onSubmit={handleLogin}>
                  <span className="mn-login-wrap">
                    <label>Email Address*</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email add..."
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </span>
                  <span className="mn-login-wrap">
                    <label>Password*</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </span>
                  <span className="mn-login-wrap mn-login-fp">
                    <span className="mn-remember">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label htmlFor="rememberMe">
                        Remember
                        <span className="checked"></span>
                      </label>
                    </span>
                    <label>
                      <Link to="/forgot-password">Forgot Password?</Link>
                    </label>
                  </span>
                  <span className="mn-login-wrap mn-login-btn">
                    <span>
                      <Link to="/signup">Create Account?</Link>
                    </span>
                    <button
                      className="mn-btn-1 btn"
                      type="submit"
                      disabled={isLoading}
                    >
                      <span>{isLoading ? "Logging in..." : "Login"}</span>
                    </button>
                  </span>
                  {error && (
                    <p className="text-danger mt-3">
                      {error?.data?.error || "An error occurred"}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="mn-login-box d-n-991">
          <div className="mn-login-img">
            <img src="/assets/imgs/page/login-1.png" alt="Login illustration" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
