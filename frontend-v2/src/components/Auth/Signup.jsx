// src/components/Auth/Signup.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { message } from "antd";
import { useRegisterMutation } from "../../actions/authApi";

const Signup = ({ onNext }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const navigate = useNavigate();
  const [register, { isLoading, error }] = useRegisterMutation();

  const onFinish = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!username) {
      message.error("Please enter your username!");
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      message.error("Please enter a valid email!");
      return;
    }
    if (!password) {
      message.error("Please enter your password!");
      return;
    }
    if (password.length < 8) {
      message.error("Password must be at least 8 characters long!");
      return;
    }
    if (!/[a-z]/.test(password)) {
      message.error("Password must include at least one lowercase letter!");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      message.error("Password must include at least one uppercase letter!");
      return;
    }
    if (!/[0-9]/.test(password)) {
      message.error("Password must include at least one number!");
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      message.error("Password must include at least one special character!");
      return;
    }
    if (password !== confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }
    if (!agree) {
      message.error("You must agree to the terms and policy!");
      return;
    }

    try {
      const response = await register({
        email,
        username,
        password,
      }).unwrap();
      const { userId } = response; // Assuming the API returns userId

      message.success({
        content:
          "Registration Successful! You have successfully registered! Please continue.",
        duration: 2,
      });

      if (onNext) {
        onNext(userId); // Pass userId to onNext
      } else {
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (err) {
      message.error({
        content:
          err?.data?.error || "An unexpected error occurred. Please try again.",
        duration: 2,
      });
    }
  };

  return (
    <section className="mn-login p-b-15">
      <div className="mn-title">
        <h2>
          Create an Account<span></span>
        </h2>
        <p>Sign up to access your Orders, Wishlist, and Recommendations.</p>
      </div>
      <div className="mn-login-content">
        <div className="mn-login-box">
          <div className="mn-login-wrapper">
            <div className="mn-login-container">
              <div className="mn-login-form">
                <form onSubmit={onFinish}>
                  <span className="mn-login-wrap">
                    <label>Username*</label>
                    <input
                      type="text"
                      name="username"
                      placeholder="Enter your username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </span>
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
                  <span className="mn-login-wrap">
                    <label>Confirm Password*</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </span>
                  <span className="mn-login-wrap mn-login-fp">
                    <span className="mn-remember">
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                      />
                      <label htmlFor="agreeTerms">
                        I agree to terms & Policy
                        <span className="checked"></span>
                      </label>
                    </span>
                    <label>
                      <Link to="/privacy-policy">Learn more</Link>
                    </label>
                  </span>
                  <span className="mn-login-wrap mn-login-btn">
                    <span>
                      <Link to="/login">Already have an account? Login</Link>
                    </span>
                    <button
                      className="mn-btn-1 btn"
                      type="submit"
                      disabled={isLoading}
                    >
                      <span>
                        {isLoading ? "Registering..." : "Submit & Register"}
                      </span>
                    </button>
                  </span>
                  {error && (
                    <p className="text-danger mt-3">
                      {error?.data?.error || "An error occurred"}
                    </p>
                  )}
                  <p className="font-xs text-muted mt-3">
                    <strong>Note:</strong> Your personal data will be used to
                    support your experience throughout this website, to manage
                    access to your account, and for other purposes described in
                    our privacy policy.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="mn-login-box d-n-991">
          <div className="mn-login-img">
            <img
              src="/assets/imgs/page/login-1.png"
              alt="Signup illustration"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
