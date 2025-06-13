import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router";
import { useLoginLogic } from "../functions/logics";

function Login() {
  const [emailText, setEmail] = useState<string>("");
  const [passwordText, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { handleLogin } = useLoginLogic(setError, setSuccessMessage);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin(emailText, passwordText);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-cont">
      <div className="login-box">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              value={emailText}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
          </div>

          <div className="form-group password-group">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter password"
              value={passwordText}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
            />
            <span
              className="eye-icon"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && (
            <div className="form-group">
              <p className="error">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="form-group">
              <p className="success">{successMessage}</p>
            </div>
          )}

          <div className="form-group">
            <Link to={"/forget-password"} className="link">
              Forgot your password?
            </Link>
          </div>

          <div className="form-group">
            <button type="submit">Login</button>
          </div>
          <Link to={"/register"} className="link">
            Create an account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
