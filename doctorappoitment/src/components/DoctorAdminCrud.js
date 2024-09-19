import { AdminContext } from "./AdminDashContext";
import DbService from "../Api/DbService";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Box,
  Alert,
  Avatar,
  IconButton,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { PhotoCamera } from "@mui/icons-material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const todayDate = new Date().toISOString().split("T")[0];
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
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  mobile: Yup.string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  specilization: Yup.string().required("specilization is required"),
  organization: Yup.string().required("organization is required"),
  location: Yup.string().required("location is required"),
  availableDate: Yup.string().required("availableDate is required"),
  gender: Yup.string().required("Gender is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
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

const DoctorAdminCrud = () => {
  const { fetchDatas } = useContext(AdminContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const currentTime = new Date().toLocaleTimeString("it-IT");
  const [doctorData, setDoctorData] = useState(null);
const [initialData,setInitialData] = useState({
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

})
  const formik = useFormik({
    initialValues: initialData,
    enableReinitialize: true,

    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
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
          `Doctor/${id}`,
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
          });
          setTimeout(() => {
            navigate("/admin/dashboard/doctors");
          }, 3000);
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
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!doctorData) {
      DbService.get(`Doctor/${id}`, {}, sessionStorage.getItem("token"))
        .then((res) => {
          setDoctorData(res.data);

          const base64String = `data:image/jpeg;base64,${res.data.imageData}`;
          const file = base64ToImageFile(base64String, "photo.jpg");
          setInitialData({
            name: res.data.name,
            mobile: res.data.contact,
            email: res.data.email,
            specilization:  res.data.specialization,
            organization: res.data.organization,
            location: res.data.location,
            availableDate: res.data.availableFrom.split("T")[0],
            gender:  res.data.gender,
            password: res.data.password,
            photo: file,
      




          })
       
        })
        .catch((err) => console.log(err));
    }
  }, [id,doctorData]);

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
          Doctor View
        </Typography>
        {formik.status && (
          <Alert severity={formik.status === "success" ? "success" : "error"}>
            {formik.status === "success"
              ? "Update successful!"
              : "Update failed!"}
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
              <input type="file" accept=".jpg, .jpeg, .png" hidden disabled />
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
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{ mb: 2 }}
          />
        </Box>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default DoctorAdminCrud;
