import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import "./patientadminview.css"
import DbService from '../Api/DbService'
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const PatientAdminView = () => {
  const { id } = useParams();
  const [patientsBookData, setPatientsBookData] = useState([]);

 

  useEffect(() => {
    const GetById = async () => {
      try {
        const res = await DbService.get(`Patient/${id}`, {}, sessionStorage.getItem("token"));
        setPatientsBookData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    GetById();
  }, [id]);

  if (!patientsBookData) {
    return <div>Loading...</div>
  }

  const { name, email, contact, address, gender, image, bookings } = patientsBookData;

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: 'center',
          padding: 2,
          boxShadow: 4, 
          borderRadius: 3,
          maxWidth: '90%', 
          margin: '20px auto', 
          backgroundColor: '#f9f9f9',
          transition: 'transform 0.3s', 
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: { xs: 100, sm: 120 }, 
            height: { xs: 100, sm: 120 }, 
            borderRadius: '50%',
            marginBottom: { xs: 2, sm: 0 },
            marginRight: { sm: 2 }, 
            border: '3px solid #1976d2', 
          }}
          image={`data:image/jpeg;base64,${image}`} 
          alt={name}
        />

        <CardContent sx={{ flex: '1', padding: '0 16px', textAlign: 'center' }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            {name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ marginTop: 1 }}>
            <strong>Email:</strong> {email}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ marginTop: 0.5 }}>
            <strong>Contact:</strong> {contact}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ marginTop: 0.5 }}>
            <strong>Address:</strong> {address}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ marginTop: 0.5 }}>
            <strong>Gender:</strong> {gender}
          </Typography>
        </CardContent>
      </Card>

      <TableContainer
        component={Paper}
        sx={{
          marginTop: 8,
          boxShadow: 6, 
          borderRadius: 4, 
          maxWidth: '90%', 
          padding: 3,
          overflowX: 'auto', 
          margin: '0 auto', 
          backgroundColor: '#fff', 
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Bookings
        </Typography>

        {bookings?.$values.length > 0 ? (
          <Table sx={{ minWidth: 300, tableLayout: 'auto', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    padding: '12px',
                    backgroundColor: '#2196f3',
                    color: '#fff',
                    borderTopLeftRadius: '8px',
                    borderBottomLeftRadius: '8px',
                  }}
                >
                  Booking Date
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    padding: '12px',
                    backgroundColor: '#2196f3',
                    color: '#fff',
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    padding: '12px',
                    backgroundColor: '#2196f3',
                    color: '#fff',
                    borderTopRightRadius: '8px',
                    borderBottomRightRadius: '8px',
                  }}
                >
                  Doctor
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {bookings.$values.map((booking) => (
                <TableRow
                  key={booking.bookingId}
                  sx={{
                    backgroundColor: '#f9f9f9', 
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    '&:hover': { backgroundColor: '#f5f5f5' }, 
                    transition: 'background-color 0.3s ease', 
                  }}
                >
                  <TableCell
                    sx={{
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: 500,
                    }}
                  >
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: booking.status === 'Completed' ? '#4caf50' : '#f57c00',
                    }}
                  >
                    {booking.status}
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: 500,
                    }}
                  >
                    {booking.doctorName ? booking.doctorName : 'Record deleted'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Box sx={{ padding: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              No bookings available
            </Typography>
          </Box>
        )}
      </TableContainer>
      </>
  )
}

export default PatientAdminView;
