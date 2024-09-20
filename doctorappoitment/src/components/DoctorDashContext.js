import React, { createContext, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  EventNote,
  History,
  Edit,
  Logout,
  Close,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DbService from "../Api/DbService";
import { Button, styled } from "@mui/material";

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  borderRadius: "8px",
  margin: theme.spacing(1),
  padding: theme.spacing(1.5, 2),
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  fontWeight: "bold",
  textTransform: "none",
}));

export const DoctorContext = createContext();

export const DoctorProvider = ({ children }) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [doctors, setDoctors] = useState(null);
  const [doctorsList, setDoctorsList] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const id = sessionStorage.getItem("Doctor");

  const handleModalOpen = () => setOpenModal(true);

  const handleModalClose = () => setOpenModal(false);

  const handleDrawerOpen = () => setDrawerOpen(true);

  const handleDrawerClose = () => setDrawerOpen(false);

 



  const handleLogout = () => {
    console.log("Logged out");
    // sessionStorage.clear();
    navigate("/login");
  };



 
  const fetchDatas =useCallback( async () => {
    try {
      const patientsRes = await DbService.get(
        `Doctor/${id}`,
        {},
        sessionStorage.getItem("token")
      );
      setDoctors(patientsRes.data);
    } catch (err) {
      console.log(err);
    }
  },[setDoctors,id]);

  const fetchDoctors = useCallback( async () => {
    const getDayWithSuffix = (day) => {
      if (day > 3 && day < 21) return `${day}th`;
      switch (day % 10) {
        case 1:
          return `${day}st`;
        case 2:
          return `${day}nd`;
        case 3:
          return `${day}rd`;
        default:
          return `${day}th`;
      }
    };
  
    const formatDate = (dateTimeString) => {
      const date = new Date(dateTimeString);
      const day = getDayWithSuffix(date.getDate());
      const month = date.toLocaleString("default", { month: "short" });
      return `${day} ${month}`;
    };
    const response = await DbService.get(
      "Doctor/",
      {},
      sessionStorage.getItem("token")
    );
    const data = response.data["$values"];

    const uniqueSpecializations = [
      ...new Set(data.map((doctor) => doctor.specialization)),
    ];
    setSpecializations(uniqueSpecializations);

    const uniqueOrganizations = [
      ...new Set(data.map((doctor) => doctor.organization)),
    ];
    setOrganizations(uniqueOrganizations);

    const uniqueLocations = [...new Set(data.map((doctor) => doctor.location))];
    setLocations(uniqueLocations);

    const doctorsData = data.map((doctor) => ({
      id: doctor.doctorId,
      name: doctor.name,
      specialization: doctor.specialization,
      hospital: doctor.organization,
      image: doctor.imageData,
      availabilityDate: formatDate(doctor.availableFrom),
      gender: doctor.gender,
      location: doctor.location,
    }));

    setDoctorsList(doctorsData);
    setFilteredDoctors(doctorsData);
  },[setDoctorsList,setFilteredDoctors]);

  useEffect(() => {
    fetchDatas();
    fetchDoctors();
  }, [id,fetchDatas,fetchDoctors]);

  return (
    <DoctorContext.Provider
      value={{
        doctors,
        id,
        doctorsList,
        filteredDoctors,
        specializations,
        organizations,
        locations,
        setFilteredDoctors,
        selectedDoctor,
        setSelectedDoctor,
        fetchDatas,
        fetchDoctors,
      }}
    >
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(90deg, #007bff, #00d084)",
          padding: { xs: "0.5rem 1rem", sm: "1rem 2rem" },
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
          top: 0,
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerOpen}
            sx={{ display: { xs: "block", sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: { xs: "none", sm: "flex" }, flexGrow: 1 }}>
            <StyledButton
              variant="contained"
              startIcon={<Home />}
              onClick={() => navigate("/doctor-dash")}
            >
              Home
            </StyledButton>
            <StyledButton
              variant="contained"
              startIcon={<EventNote />}
              onClick={() => navigate("doctor-bookings")}
            >
              Bookings
            </StyledButton>
            <StyledButton variant="contained" startIcon={<History />}>
              Medical History
            </StyledButton>
            <StyledButton
              variant="contained"
              startIcon={<Edit />}
              onClick={() => navigate("doctor-edit")}
            >
              Edit Profile
            </StyledButton>
          </Box>

          <Box sx={{ flexGrow: 1, textAlign: "right" }}>
            <Typography variant="h6">Welcome {doctors?.name}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton  color="inherit">
              <Avatar
                alt="Doctor Profile"
                src={`data:image/png;base64,${doctors?.imageData}`}
              />
            </IconButton>
            <IconButton onClick={handleModalOpen} color="inherit">
              <Close />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ marginTop: "64px" }}></Box>

      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerClose}>
        <List>
          <ListItem
            button
            onClick={() => {
              navigate("/doctor-dash");
              handleDrawerClose();
            }}
          >
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              navigate("doctor-bookings");
              handleDrawerClose();
            }}
          >
            <ListItemIcon>
              <EventNote />
            </ListItemIcon>
            <ListItemText primary="Bookings" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              handleDrawerClose();
            }}
          >
            <ListItemIcon>
              <History />
            </ListItemIcon>
            <ListItemText primary="Medical History" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              navigate("doctor-edit");
              handleDrawerClose();
            }}
          >
            <ListItemIcon>
              <Edit />
            </ListItemIcon>
            <ListItemText primary="Edit Profile" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      <Dialog open={openModal} onClose={handleModalClose}>
        <DialogTitle>
          Close Profile
          <IconButton
            aria-label="close"
            onClick={handleModalClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              backgroundColor: "#f5f5f5",
              color: "#ff1744",
              border: "1px solid #ff1744",
              "&:hover": {
                backgroundColor: "#ff1744",
                color: "#ffffff",
              },
              transition: "all 0.3s ease",
              width: 40,
              height: 40,
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to close the profile section?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {children}
    </DoctorContext.Provider>
  );
};
