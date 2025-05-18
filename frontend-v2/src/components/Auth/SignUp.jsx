import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../actions/authApi";
import { toast } from "react-toastify";
import { FiFacebook, FiX, FiGlobe } from "react-icons/fi"; // Consistent with Login and Header
import PropTypes from "prop-types";

const SignUp = ({ logoSrc = "/img/logo.svg", logoAlt = "Cinenotes Logo" }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToPolicy, setAgreeToPolicy] = useState(true);
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const onFinish = async (e) => {
    e.preventDefault();

    if (!email || !username || !password) {
      toast.error("Please fill in all required fields", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!agreeToPolicy) {
      toast.error("You must agree to the Privacy Policy", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await register({ email, username, password }).unwrap();
      console.log("Registration Response:", response);

      toast.success("Registration successful! Please log in.", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      toast.error(err?.data?.error || "Registration failed", {
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
              <form onSubmit={onFinish} className="sign__form">
                <Link to="/" className="sign__logo">
                  <img src={logoSrc} alt={logoAlt} />
                </Link>

                <div className="sign__group">
                  <input
                    type="text"
                    className="sign__input"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

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
                    id="agree"
                    name="agree"
                    type="checkbox"
                    checked={agreeToPolicy}
                    onChange={(e) => setAgreeToPolicy(e.target.checked)}
                    disabled={isLoading}
                  />
                  <label htmlFor="agree">
                    I agree to the <Link to="/privacy">Privacy Policy</Link>
                  </label>
                </div>

                <button
                  className="sign__btn"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing up..." : "Sign up"}
                </button>

                <span className="sign__delimiter">or</span>

                <span className="sign__text">
                  Already have an account? <Link to="/login">Sign in!</Link>
                </span>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SignUp.propTypes = {
  logoSrc: PropTypes.string,
  logoAlt: PropTypes.string,
};

export default SignUp;
