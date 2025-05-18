import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../actions/authApi";
import { toast } from "react-toastify";
import { FiFacebook, FiX, FiGlobe } from "react-icons/fi"; // Using react-icons for social buttons
import PropTypes from "prop-types";

const Login = ({ logoSrc = "/img/logo.svg", logoAlt = "Cinenotes Logo" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await login({ email, password }).unwrap();
      const token = response.token;
      localStorage.setItem("token", token);

      toast.success("Logged in successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.error || "Login failed", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="sign section--bg" data-bg="img/bg/section__bg.jpg">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="sign__content">
              <form onSubmit={handleLogin} className="sign__form">
                <Link to="/" className="sign__logo">
                  <img src={logoSrc} alt={logoAlt} />
                </Link>

                <div className="sign__group">
                  <input
                    type="email"
                    className="sign__input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="sign__group">
                  <input
                    type="password"
                    className="sign__input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="sign__group sign__group--checkbox">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <label htmlFor="remember">Remember Me</label>
                </div>

                <button
                  className="sign__btn"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>

                <span className="sign__delimiter">or</span>

                <span className="sign__text">
                  Don't have an account? <Link to="/signup">Sign up!</Link>
                </span>

                <span className="sign__text">
                  <Link to="/forgot">Forgot password?</Link>
                </span>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  logoSrc: PropTypes.string,
  logoAlt: PropTypes.string,
};

export default Login;
