import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Modal,
  Container,
  Grid,
} from "@mui/material";
import {
  FaUserMd,
  FaUsers,
  FaCalendarCheck,
  FaChartBar,
  FaSignOutAlt,
  FaEnvelopeOpen,
} from "react-icons/fa";
import "../App.css";

const AdminDashUi = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const logout = () => {
    navigate("/login");
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          bgcolor: "transparent",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "linear-gradient(90deg, #007bff, #00d084)",
          padding: "1rem 2rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar>
          <Container maxWidth="lg">
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item xs={12} md={8}>
                <Box
                  display="flex"
                  justifyContent={{ xs: "center", md: "flex-start" }}
                  flexWrap="wrap"
                >
                  <Button
                    component={Link}
                    to="analytics"
                    startIcon={<FaChartBar />}
                    sx={{
                      color: "#ffffff",
                      textTransform: "none",
                      fontSize: "1rem",
                      mx: 1,
                    }}
                  >
                    Analytics
                  </Button>
                  <Button
                    component={Link}
                    to="doctors"
                    startIcon={<FaUserMd />}
                    sx={{
                      color: "#ffffff",
                      textTransform: "none",
                      fontSize: "1rem",
                      mx: 1,
                    }}
                  >
                    Doctors
                  </Button>
                  <Button
                    component={Link}
                    to="patients"
                    startIcon={<FaUsers />}
                    sx={{
                      color: "#ffffff",
                      textTransform: "none",
                      fontSize: "1rem",
                      mx: 1,
                    }}
                  >
                    Patients
                  </Button>
                  <Button
                    component={Link}
                    to="appointments"
                    startIcon={<FaCalendarCheck />}
                    sx={{
                      color: "#ffffff",
                      textTransform: "none",
                      fontSize: "1rem",
                      mx: 1,
                    }}
                  >
                    Appointments
                  </Button>
                  <Button
                    component={Link}
                    to="contactform"
                    startIcon={<FaEnvelopeOpen />}
                    sx={{
                      color: "#ffffff",
                      textTransform: "none",
                      fontSize: "1rem",
                      mx: 1,
                    }}
                  >
                    Contact Form
                  </Button>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
                textAlign={{ xs: "center", md: "right" }}
              >
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleOpen}
                  sx={{ fontSize: "1rem", color: "#ffffff" }}
                >
                  <FaSignOutAlt size={20} />
                  <Typography
                    sx={{ ml: 1, display: { xs: "none", md: "inline" } }}
                  >
                    Logout
                  </Typography>
                </IconButton>
              </Grid>
            </Grid>
          </Container>
        </Toolbar>
      </AppBar>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: 250, sm: 300 },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Confirm Logout
          </Typography>
          <Typography variant="body2" gutterBottom>
            Are you sure you want to logout?
          </Typography>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="contained" color="primary" onClick={logout}>
              Confirm
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <Container>
        <Outlet />
      </Container>
    </>
  );
};

export default AdminDashUi;
