import { CircularProgress, Box, Container } from "@mui/material";

import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Modal,
  Card,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import { FaTimes } from "react-icons/fa";
import { PatientContext } from "./PatientDashContext";
import DbService from "../Api/DbService";
import { red } from "@mui/material/colors";

const BookingCard = ({ booking, onComplete, submitData }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const [showModal, setShowModal] = useState(false);



 

  const Base64Image = ({ base64String }) => {
    const imageSrc = `data:image/png;base64,${base64String}`;
    return (
      <img
        src={imageSrc}
        alt="Converted"
        style={{ width: "100px", height: "100px", borderRadius: "50%" }}
      />
    );
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 2,
        marginBottom: 2,
        boxShadow: 3,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Base64Image base64String={booking.doctorImage} />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="h6" gutterBottom>
            {booking.doctorName}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Status: {booking.status}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Date: {formatDate(booking.bookingDate)}
          </Typography>
        </Grid>
      </Grid>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Card sx={{ padding: 2, margin: 2 }}>
          <Typography variant="h6">Error</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        </Card>
      </Modal>
    </Card>
  );
};

const CompletedCard = ({ booking }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const Base64Image = ({ base64String }) => {
    const imageSrc = `data:image/png;base64,${base64String}`;
    return (
      <img
        src={imageSrc}
        alt="Converted"
        style={{ width: "100px", height: "100px", borderRadius: "50%" }}
      />
    );
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 2,
        marginBottom: 2,
        boxShadow: 3,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Base64Image base64String={booking.doctorImage} />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="h6" gutterBottom>
            {booking.doctorName}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Status: {booking.status}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Date: {formatDate(booking.bookingDate)}
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleShowModal}
            sx={{ marginTop: 2 }}
          >
            View Prescription
          </Button>
        </Grid>
      </Grid>

      <Modal open={showModal} onClose={handleCloseModal}>
        <Card
          sx={{
            padding: 2,
            margin: "auto",
            maxWidth: "90%",
            maxHeight: "90vh",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Prescription
          </Typography>
          <img
            src={`data:image/png;base64,${booking.prescription}`}
            alt="Prescription"
            style={{
              width: "500px",
              height: "500px",
              objectFit: "contain",
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseModal}
            sx={{
              marginTop: 2,
              width: "150px",
            }}
          >
            Close
          </Button>
        </Card>
      </Modal>
    </Card>
  );
};
const PendingCard = ({ booking, fetchDatas }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleShowConfirmModal = () => setShowConfirmModal(true);
  const handleCloseConfirmModal = () => setShowConfirmModal(false);

  const handleCancel = async () => {
    setCancelLoading(true);
    const formData = new FormData();
    formData.append("status", "Cancelled");
    formData.append("DoctorId", booking.doctorId);
    formData.append("PatientId", booking.patientId);
    formData.append("Prescription", null);

    try {
      await DbService.put(
        `Bookings/${booking.bookingId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
        sessionStorage.getItem("token")
      );
      await fetchDatas();
    } catch (error) {
      console.error("Error canceling booking:", error);
    } finally {
      setCancelLoading(false);
      handleCloseConfirmModal();
    }
  };

  const Base64Image = ({ base64String }) => {
    const imageSrc = `data:image/png;base64,${base64String}`;
    return (
      <img
        src={imageSrc}
        alt="Converted"
        style={{ width: "100px", height: "100px", borderRadius: "50%" }}
      />
    );
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 2,
        marginBottom: 2,
        boxShadow: 3,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Base64Image base64String={booking.doctorImage} />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="h6" gutterBottom>
            {booking.doctorName}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Status: {booking.status}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Date: {formatDate(booking.bookingDate)}
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
        <IconButton
          onClick={handleShowConfirmModal}
          sx={{
            color: red[500],
            "&:hover": { color: red[700] },
          }}
        >
          <FaTimes />
        </IconButton>
      </Box>

      <Modal open={showConfirmModal} onClose={handleCloseConfirmModal}>
        <Card
          sx={{
            padding: 2,
            margin: "auto",
            maxWidth: "90%",
            maxHeight: "90vh",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Are you sure you want to cancel this appointment?
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCancel}
              disabled={cancelLoading}
            >
              {cancelLoading ? <CircularProgress size={24} /> : "Confirm"}
            </Button>
            <Button variant="outlined" onClick={handleCloseConfirmModal}>
              Cancel
            </Button>
          </Box>
        </Card>
      </Modal>
    </Card>
  );
};

const CancelledCard = ({ booking }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };



  const Base64Image = ({ base64String }) => {
    const imageSrc = `data:image/png;base64,${base64String}`;
    return (
      <img
        src={imageSrc}
        alt="Converted"
        style={{ width: "100px", height: "100px", borderRadius: "50%" }}
      />
    );
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 2,
        marginBottom: 2,
        boxShadow: 3,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Base64Image base64String={booking.doctorImage} />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="h6" gutterBottom>
            {booking.doctorName}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Status: {booking.status}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Date: {formatDate(booking.bookingDate)}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};
const BookingList = ({ bookings, submitData }) => {
  return (
    <Grid container spacing={2}>
      {bookings.map(
        (booking) =>
          booking.status.toLowerCase() === "booked" && (
            <Grid item xs={12} sm={6} md={4} key={booking.bookingId}>
              <BookingCard booking={booking} submitData={submitData} />
            </Grid>
          )
      )}
    </Grid>
  );
};

const CompletedList = ({ bookings }) => {
  return (
    <Grid container spacing={2}>
      {bookings.map(
        (booking) =>
          booking.status.toLowerCase() === "completed" && (
            <Grid item xs={12} sm={6} md={4} key={booking.bookingId}>
              <CompletedCard booking={booking} />
            </Grid>
          )
      )}
    </Grid>
  );
};

const PendingList = ({ bookings, fetchDatas }) => {
  return (
    <Grid container spacing={2}>
      {bookings.map(
        (booking) =>
          booking.status.toLowerCase() === "pending" && (
            <Grid item xs={12} sm={6} md={4} key={booking.bookingId}>
              <PendingCard booking={booking} fetchDatas={fetchDatas} />
            </Grid>
          )
      )}
    </Grid>
  );
};

const CancelledList = ({ bookings }) => {
  return (
    <Grid container spacing={2}>
      {bookings.map(
        (booking) =>
          booking.status.toLowerCase() === "cancelled" && (
            <Grid item xs={12} sm={6} md={4} key={booking.bookingId}>
              <CancelledCard booking={booking} />
            </Grid>
          )
      )}
    </Grid>
  );
};
const Patientbookings = () => {
  const { patients,  fetchDatas } = useContext(PatientContext);
  const [pendingData, setPendingData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  const [bookedData, setBookedData] = useState([]);
  const [cancelledData, setCancelledData] = useState([]);

 

  const submitData = async (booking, file) => {
    const formData = new FormData();
    formData.append("BookingDate", booking.bookingDate);
    formData.append("Status", "Completed");
    formData.append("DoctorId", parseInt(booking.doctorId));
    formData.append("PatientId", parseInt(booking.patientId));
    formData.append("Prescription", file);

    try {
      const response = await DbService.put(
        `bookings/${booking.bookingId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log("Booking updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  useEffect(() => {
    if (patients) {
      const allBookings = patients.bookings["$values"];

      setPendingData(
        allBookings.filter(
          (booking) => booking.status.toLowerCase() === "pending"
        )
      );
      setCompletedData(
        allBookings.filter(
          (booking) => booking.status.toLowerCase() === "completed"
        )
      );
      setBookedData(
        allBookings.filter(
          (booking) => booking.status.toLowerCase() === "booked"
        )
      );
      setCancelledData(
        allBookings.filter(
          (booking) => booking.status.toLowerCase() === "cancelled"
        )
      );
    }
  }, [patients]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Patient Bookings
      </Typography>

      <Typography variant="h6">Booked Appointments</Typography>

      {bookedData.length > 0 ? (
        <BookingList bookings={bookedData} submitData={submitData} />
      ) : (
        <Typography
          variant="h6"
          color="textSecondary"
          align="center"
          sx={{ marginTop: 2 }}
        >
          No records found
        </Typography>
      )}

      <Typography variant="h6">Pending Appointments</Typography>
      {pendingData.length > 0 ? (
        <PendingList bookings={pendingData} fetchDatas={fetchDatas} />
      ) : (
        <Typography
          variant="h6"
          color="textSecondary"
          align="center"
          sx={{ marginTop: 2 }}
        >
          No records found
        </Typography>
      )}

      <Typography variant="h6">Completed Appointments</Typography>
      {completedData.length > 0 ? (
        <CompletedList bookings={completedData} />
      ) : (
        <Typography
          variant="h6"
          color="textSecondary"
          align="center"
          sx={{ marginTop: 2 }}
        >
          No records found
        </Typography>
      )}

      <Typography variant="h6">Cancelled Appointments</Typography>
      {cancelledData.length > 0 ? (
        <CancelledList bookings={cancelledData} />
      ) : (
        <Typography
          variant="h6"
          color="textSecondary"
          align="center"
          sx={{ marginTop: 2 }}
        >
          No records found
        </Typography>
      )}
    </Container>
  );
};

export default Patientbookings;
