import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [emailText, setEmail] = useState("");
  const [passwordText, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (
      !firstName ||
      !lastName ||
      !username ||
      !gender ||
      !emailText ||
      !passwordText
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setSuccessMessage("Registration successful! You can now log in.");
    console.log({
      firstName,
      lastName,
      username,
      gender,
      emailText,
      passwordText,
    });

    setFirstName("");
    setLastName("");
    setUsername("");
    setGender("");
    setEmail("");
    setPassword("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="registration-cont">
      <div className="registration-box">
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              aria-label="First name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              aria-label="Last name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-label="Username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="gender-select"
              aria-label="Select gender"
            >
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

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
            <button type="submit">Register</button>
          </div>

          <Link to={"/"} className="link">
            I already have an account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
