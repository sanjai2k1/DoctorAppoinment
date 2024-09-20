import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  IconButton,
  CircularProgress,
  FormHelperText,
  Alert,
  
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "./DoctorDashContext";
import DbService from "../Api/DbService";
import { PhotoCamera } from "@mui/icons-material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const todayDate = new Date().toISOString().split("T")[0];

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(4, "Name must be at least 4 characters")
    .matches(/^[A-Za-z\s]+$/, "Name must contain only alphabets")
    .required("Name is required"),
  mobile: Yup.string()
    .trim()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  email: Yup.string()
    .trim()
    .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Email must be in the format")
    .email("Invalid email address")
    .required("Email is required"),
  specilization: Yup.string()
    .trim()
    .min(4, "Specilization must be at least 4 characters")
    .matches(/^[A-Za-z\s]+$/, "Specilization must contain only alphabets")
    .required("Specilization is required"),
  organization: Yup.string()
    .trim()
    .min(4, "Organization must be at least 4 characters")
    .matches(/^[A-Za-z\s]+$/, "Organization must contain only alphabets")
    .required("Organization is required"),
  location: Yup.string()
    .trim()
    .min(4, "Location must be at least 4 characters")
    .required("Location is required"),
  availableDate: Yup.string().required("Available Date is required"),
  gender: Yup.string().required("Gender is required"),
  password: Yup.string()
    .trim()
    .matches(/^(?!.*\s).+$/, "Password must not contain spaces")
    .matches(/(?=.*[a-z])/, "Must contain at least one lowercase letter")
    .matches(/(?=.*[A-Z])/, "Must contain at least one uppercase letter")
    .matches(/(?=.*\d)/, "Must contain at least one number")
    .matches(/(?=.*[@$!%*?&])/, "Must contain at least one special character")
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
  photo: Yup.mixed()
    .required("Photo is required")
    .test(
      "fileType",
      "Only .jpg, .jpeg, and .png files are allowed",
      (value) => {
        return (
          !value ||
          ["image/jpeg", "image/jpg", "image/png"].includes(value.type)
        );
      }
    ),
});
function base64ToImageFile(base64String, fileName) {
  try {
    const mimeType = base64String.match(/data:(.*?);base64,/)[1];
    const byteString = atob(base64String.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ia], { type: mimeType });
    return new File([blob], fileName, { type: mimeType });
  } catch (error) {
    console.error("Error converting base64 to image:", error);
    return null;
  }
}


const apiUrl = "Doctor/";
const extractDate = (dateTimeString) => {
  return dateTimeString.split("T")[0];
};

const DoctorEditComponent = () => {
  const {
    doctors,
    id,
    fetchDatas,
    fetchDoctors,
  } = useContext(DoctorContext);
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState({
    name: "",
    mobile: "",
    email: "",
    specilization: "",
    organization: "",
    location: "",
    availableDate: "",
    gender: "",
    password: "",
    photo: null,
  });
  const currentTime = new Date().toLocaleTimeString("it-IT");
  const formik = useFormik({
    initialValues: initialData,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors, setStatus }) => {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("Name", values.name);
      formData.append("Contact", values.mobile);
      formData.append("Specialization", values.specilization);
      formData.append("Email", values.email);
      formData.append("Organization", values.organization);
      formData.append("Gender", values.gender);
      formData.append("Password", values.password);
      formData.append(
        "AvailableFrom",
        values.availableDate + "T" + currentTime
      );
      formData.append("Location", values.location);
      formData.append("Image", values.photo);

      try {
        const response = await DbService.put(
          apiUrl + id,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
          sessionStorage.getItem("token")
        );

        if (response.status === 200) {
          setStatus("success");

          await fetchDatas();
          toast.success("Update completed successfully!", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          await fetchDoctors();

          setTimeout(() => {
            navigate("/doctor-dash/doctor-search");
          }, 2000);
        }
      } catch (err) {
        setStatus("error");

        toast.error("Update failed, please try again.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        console.error("Error updating doctor:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    // console.log(doctors);
    if (doctors) {
      const base64String = `data:image/jpeg;base64,${doctors.imageData}`;
      const file = base64ToImageFile(base64String, "photo.jpg");
      setInitialData({
        name:  doctors.name,
        mobile: doctors.contact,
        email: doctors.email,
        specilization: doctors.specialization,
        organization:  doctors.organization,
        location: doctors.location,
        availableDate:  extractDate(doctors.availableFrom),
        gender: doctors.gender,
        password: doctors.password,
        photo: file,





      })




   

    
    }
  }, [ doctors ]);
 


 
 

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
          p: 3,
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Doctor Registration
        </Typography>
        {formik.status && (
          <Alert severity={formik.status === "success" ? "success" : "error"}>
            {formik.status === "success"
              ? "update successful!"
              : "update failed!"}
          </Alert>
        )}
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ width: "100%" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Avatar
              sx={{ width: 100, height: 100, mb: 2 }}
              src={
                formik.values.photo
                  ? URL.createObjectURL(formik.values.photo)
                  : ""
              }
            />
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
            >
              <input
                type="file"
                accept=".jpg, .jpeg, .png"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  formik.setFieldValue("photo", file);
                  if (file) {
                    formik.setFieldError("photo", "");
                  }
                }}
              />
              <PhotoCamera />
            </IconButton>
            {formik.errors.photo && formik.touched.photo && (
              <FormHelperText error>{formik.errors.photo}</FormHelperText>
            )}
          </Box>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Mobile"
            name="mobile"
            type="tel"
            value={formik.values.mobile}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
            helperText={formik.touched.mobile && formik.errors.mobile}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="specilization"
            name="specilization"
            InputLabelProps={{
              shrink: true,
            }}
            value={formik.values.specilization}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.specilization &&
              Boolean(formik.errors.specilization)
            }
            helperText={
              formik.touched.specilization && formik.errors.specilization
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="organization"
            name="organization"
            value={formik.values.organization}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.organization && Boolean(formik.errors.organization)
            }
            helperText={
              formik.touched.organization && formik.errors.organization
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="location"
            name="location"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.location && Boolean(formik.errors.location)}
            helperText={formik.touched.location && formik.errors.location}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Available Date"
            type="date"
            name="availableDate"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: todayDate,
            }}
            value={formik.values.availableDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.availableDate &&
              Boolean(formik.errors.availableDate)
            }
            helperText={
              formik.touched.availableDate && formik.errors.availableDate
            }
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formik.values.email}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{ mb: 2 }}
          />

          <FormControl
            fullWidth
            margin="normal"
            error={formik.touched.gender && Boolean(formik.errors.gender)}
          >
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              id="gender"
              name="gender"
              value={formik.values.gender}
              label="Gender"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              sx={{ mb: 2 }}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
            {formik.touched.gender && formik.errors.gender && (
              <FormHelperText>{formik.errors.gender}</FormHelperText>
            )}
          </FormControl>
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? <CircularProgress size={24} /> : "Update"}
          </Button>
        </Box>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default DoctorEditComponent;
