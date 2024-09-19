import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DbService from "../Api/DbService";
import "./logincomponent.css";
import { FaHome } from "react-icons/fa";

const LoginComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Patient");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    let errorMsg = "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const hasSpaces = (str) => /\s/.test(str);

    if (!username) {
      errorMsg = "Email is required.";
      valid = false;
    } else if (hasSpaces(username)) {
      errorMsg = "Email must not contain spaces.";
      valid = false;
    } else if (!emailRegex.test(username)) {
      errorMsg = "Invalid email format.";
      valid = false;
    }

    if (!password) {
      errorMsg = "Password is required.";
      valid = false;
    } else if (hasSpaces(password)) {
      errorMsg = "Password must not contain spaces.";
      valid = false;
    } else if (password.length < 8) {
      errorMsg = "Password must be at least 8 characters long.";
      valid = false;
    }

    setError(errorMsg);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await DbService.post("Login", {
        email: username,
        password: password,
        role: role,
      });
      console.log(response);
      if (response.status === 200) {
        setSuccess("Login successful!");
        setError("");
        if (role === "Admin") {
          sessionStorage.setItem("Admin", "admin");
          sessionStorage.setItem("token", response.data.token);
          navigate("/admin");
        } else if (role === "Doctor") {
          sessionStorage.setItem("Doctor", response.data.id);
          sessionStorage.setItem("token", response.data.token);
          navigate("/doctor-dash");
        } else if (role === "Patient") {
          sessionStorage.setItem("Patient", response.data.id);
          sessionStorage.setItem("token", response.data.token);
          navigate("/patient-dash");
        }
      } else {
        setError("Invalid username, password, or role.");
        setSuccess("");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError("An error occurred while logging in. Please try again.");
      setSuccess("");
    }
  };

  const handleRegister = () => {
    if (role === "Doctor") {
      navigate("/doctor-register");
    } else if (role === "Patient") {
      navigate("/patient-register");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const getBackgroundImage = () => {
    switch (role) {
      case "Admin":
        return process.env.PUBLIC_URL + "/images/Admin.jpg";
      case "Doctor":
        return process.env.PUBLIC_URL + "/images/Hands.jpg";
      case "Patient":
        return process.env.PUBLIC_URL + "/images/patientpic.jpg";
      default:
        return "";
    }
  };

  return (
    <div
      className="background"
      style={{ backgroundImage: `url(${getBackgroundImage()})` }}
    >
      <div className="card-contain">
        <div className="card-body">
          <h2 className="card-title">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">User Role</label>
              <select
                id="role"
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Admin">Admin</option>
                <option value="Doctor">Doctor</option>
                <option value="Patient">Patient</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Login
            </button>
            <button
              type="button"
              className="btn btn-register btn-block"
              onClick={handleRegister}
            >
              Register
            </button>
            <button
              type="button"
              className="btn btn-link btn-block"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
          </form>
        </div>
        <div className="home-button">
          <button onClick={handleHomeClick} className="btn btn-home">
            <FaHome size={24} /> Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
