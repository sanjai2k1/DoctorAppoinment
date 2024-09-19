import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Pagination,
} from "@mui/material";
import DbService from "../Api/DbService";

const AdminContactForm = () => {
  const [pendingContacts, setPendingContacts] = useState([]);
  const [readContacts, setReadContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDateAndTime = (timestamp) => {
    const date = new Date(timestamp);

    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return { formattedDate, formattedTime };
  };

  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 5;

  useEffect(() => {
    DbService.get("Admin/contact-form", {}, sessionStorage.getItem("token"))
      .then((response) => {
        const allContacts = response.data["$values"];
        splitContacts(allContacts);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const splitContacts = (allContacts) => {
    const pending = allContacts.filter((contact) => !contact.isRead);
    const read = allContacts.filter((contact) => contact.isRead);
    setPendingContacts(pending);
    setReadContacts(read);
  };

  const markAsRead = (contact) => {
    const id = contact.id;
    DbService.put(
      `Admin/contact-form/${id}`,
      contact,
      {},
      sessionStorage.getItem("token")
    )
      .then(() => {
        const updatedPending = pendingContacts.filter(
          (contact) => contact.id !== id
        );
        const readContact = pendingContacts.find(
          (contact) => contact.id === id
        );
        setPendingContacts(updatedPending);
        setReadContacts((prevReadContacts) => [
          ...prevReadContacts,
          { ...readContact, isRead: true },
        ]);
      })
      .catch((error) => {
        setError("Failed to mark as read");
      });
  };

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentReadContacts = readContacts.slice(
    indexOfFirstContact,
    indexOfLastContact
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Contact Forms
      </Typography>

      <Typography variant="h5" gutterBottom>
        Pending Messages
      </Typography>
      {pendingContacts.length === 0 ? (
        <Typography>No pending contact forms found.</Typography>
      ) : (
        pendingContacts.map((contact) => (
          <Card key={contact.id} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6">{contact.name}</Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {contact.email}
              </Typography>
              <Typography variant="body1">
                <strong>Message:</strong> {contact.message}
              </Typography>
              <Typography variant="body1">
                <strong>Date:</strong>{" "}
                {formatDateAndTime(contact.submittedAt).formattedDate}
              </Typography>
              <Typography variant="body1">
                <strong>Time:</strong>{" "}
                {formatDateAndTime(contact.submittedAt).formattedTime}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => markAsRead(contact)}
              >
                Mark as Read
              </Button>
            </CardContent>
          </Card>
        ))
      )}

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Completed Messages (Marked as Read)
      </Typography>
      {readContacts.length === 0 ? (
        <Typography>No completed contact forms found.</Typography>
      ) : (
        <>
          {currentReadContacts.map((contact) => (
            <Card key={contact.id} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6">{contact.name}</Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {contact.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Message:</strong> {contact.message}
                </Typography>
                <Typography variant="body1">
                  <strong>Date:</strong>{" "}
                  {formatDateAndTime(contact.submittedAt).formattedDate}
                </Typography>
                <Typography variant="body1">
                  <strong>Time:</strong>{" "}
                  {formatDateAndTime(contact.submittedAt).formattedTime}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Status: Read
                </Typography>
              </CardContent>
            </Card>
          ))}

          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={Math.ceil(readContacts.length / contactsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default AdminContactForm;
