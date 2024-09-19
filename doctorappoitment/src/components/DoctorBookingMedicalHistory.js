import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DbService from "../Api/DbService";
import { Container, Typography } from "@mui/material";

const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    width: "300px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
  },
  info: {
    marginTop: "16px",
  },
};

const DoctorBookingMedicalHistory = () => {
  const { id } = useParams();
  const [medicalHistory, setMedicalhistory] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

 

  useEffect(() => {
    const getmedicalHistory = async () => {
      const response = await DbService.get(
        `Bookings/medicalhistory/${id}`,
        {},
        sessionStorage.getItem("token")
      );
      setMedicalhistory(response.data.value["$values"]);
    };
    getmedicalHistory();
  }, [id,medicalHistory]);
  const formatDate = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleDateString();
  };
  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };
  return (
    <Container>
      <div>
        <div style={styles.container}>
          {medicalHistory ? (
            medicalHistory.map((item, index) => (
              <div key={index} style={styles.card}>
                <img
                  src={`data:image/jpeg;base64,${item.prescription}`}
                  alt={`Prescription of ${item.patientName}`}
                  style={styles.image}
                  onClick={() => handleImageClick(item.prescription)}
                />
                <div style={styles.info}>
                  <h3>Doctor: {item.doctorName}</h3>
                  <h4>Patient: {item.patientName}</h4>
                  <p>Visited Date: {formatDate(item.bookingDate)}</p>
                </div>
              </div>
            ))
          ) : (
            <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
              No History found.
            </Typography>
          )}
        </div>

        {selectedImage && (
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Prescription Image</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <img
                    src={`data:image/jpeg;base64,${selectedImage}`}
                    alt="Selected Prescription"
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default DoctorBookingMedicalHistory;
