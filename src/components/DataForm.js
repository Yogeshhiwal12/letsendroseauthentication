import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import axios from "axios";
import AnimatedButton from "./AnimatedButton";
import AnimatedTextField from "./AnimatedTextField";
import { API_BASE_URL } from "../config";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
  return config;
});

const DataForm = () => {
  const [user1, setUser1] = useState({ username: "", email: "", password: "" });
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user, setUser } = useContext(UserContext); // Destructure setUser from UserContext

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/api/user-details");
        console.log('Response:', response);
        setUser1(response.data);
        setUser(response.data); // Update the user data in UserContext
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(`Failed to fetch user data: ${error.message}`);
      }
    };
    fetchUserData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating user details:', { ...user1, newPassword });
      await axiosInstance.put("/api/update-user-details", {
        ...user1,
        newPassword,
      });
      setError(null);
      setSuccess(true);
      setUser(user1); // Update the user data in UserContext
    } catch (error) {
      setError(`Failed to update user details: ${error.message}`);
      setSuccess(false);
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <Grid container spacing={3}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>User details updated successfully!</p>}
        <Grid item xs={12}>
          <AnimatedTextField
            label="Username"
            value={user1.username}
            onChange={(e) => setUser1({ ...user1, username: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <AnimatedTextField
            label="Email"
            value={user1.email}
            onChange={(e) => setUser1({ ...user1, email: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <AnimatedTextField
            label="Old Password"
            type="password"
            value={user1.password}
            onChange={(e) => setUser1({ ...user1, password: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <AnimatedTextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>
      <AnimatedButton type="submit">Update User Details</AnimatedButton>
    </form>
  );
};

export default DataForm;
