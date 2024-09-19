import React, { useContext, useEffect, useState } from "react";
import { Container, Grid, Box, Pagination } from "@mui/material";
import { PatientContext } from "./PatientDashContext";
import { useNavigate } from "react-router-dom";
import "./patientdashui.css";

const FilterDropdown = ({
  title,
  options,
  selectedOption,
  setSelectedOption,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="filter--item">
      <span
        className={`filter--tab ${selectedOption ? "active-filter" : ""}`}
        onClick={toggleDropdown}
      >
        <span>{title}</span>
        <span className="filter--arrow">{isOpen ? "▲" : "▼"}</span>
      </span>
      {isOpen && (
        <div className="filter--dropdown">
          {options.map((option, index) => (
            <div
              key={index}
              className={`filter--dropdown-item ${
                selectedOption === option ? "selected" : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DoctorCard = ({ doctor, sethandle }) => {
  const navigate = useNavigate();

  const handleAppointment = (doctor) => {
    sethandle(doctor);
    navigate("/patient-dash/book-appointment");
  };

  return (
    <div className="doctor--card">
      <div className="doctor--card-body">
        <div className="doctor--card-header">
          <img
            alt={`${doctor.name}`}
            className="doctor--card-img"
            src={`data:image/jpg;base64,${doctor.image}`}
          />
          <div className="doctor--card-info">
            <button className="doctor--card-name">{doctor.name}</button>
            <div className="doctor--card-specialization">
              {doctor.specialization}
            </div>
          </div>
        </div>
        <div className="doctor--card-details">
          <div className="doctor--card-hospital">
            <strong>Hospital:</strong> {doctor.hospital}
          </div>
        </div>
        <div className="doctor--card-footer">
          <span className="doctor--card-availability">
            Available on {doctor.availabilityDate}
          </span>
          <button
            onClick={() => handleAppointment(doctor)}
            className="doctor--card-button"
          >
            <span className="doctor--card-action">Book Appointment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const SidebarFilter = ({
  locations,
  specializations,
  organizations,
  onFilterChange,
  filters,
}) => {
  return (
    <div className="dashboard-container">
      <div id="doctor-desktop-filter" className="doctor--filters">
        <div className="doctor--filter-wrapper">
          <h2 className="filter--title">Doctor Search</h2>
          <div className="doctor--filters-tabs">
            <FilterDropdown
              title="Location/City"
              options={locations}
              selectedOption={filters.location}
              setSelectedOption={(value) => onFilterChange("location", value)}
            />
            <FilterDropdown
              title="Hospitals & Clinics"
              options={organizations}
              selectedOption={filters.organization}
              setSelectedOption={(value) =>
                onFilterChange("organization", value)
              }
            />
            <FilterDropdown
              title="Speciality"
              options={specializations}
              selectedOption={filters.specialization}
              setSelectedOption={(value) =>
                onFilterChange("specialization", value)
              }
            />
            <FilterDropdown
              title="Doctor's Gender"
              options={["Male", "Female", "Other"]}
              selectedOption={filters.gender}
              setSelectedOption={(value) => onFilterChange("gender", value)}
            />
          </div>
          <span className="filter--apply-btn-container">
            <button
              type="button"
              className="filter--apply-btn"
              onClick={() => onFilterChange("clear")}
            >
              Clear Filter
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

const PatientDoctorSearch = () => {
  const {
    doctorsList,
    filteredDoctors,
    specializations,
    organizations,
    locations,
    setFilteredDoctors,
    filters,
    setFilters,
    setSelectedDoctor,
  } = useContext(PatientContext);
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  const sethandle = (doctor) => {
    setSelectedDoctor(doctor);
  };

  

  const handleFilterChange = (filterType, value) => {
    if (filterType === "clear") {
      setFilters({
        location: "",
        specialization: "",
        organization: "",
        gender: "",
      });
      setFilteredDoctors(doctorsList);
    } else {
      setFilters((prevFilters) => ({ ...prevFilters, [filterType]: value }));
    }
  };

  useEffect(() => {
    const applyFilters = () => {
      let filtered = doctorsList;
  
      if (filters.location) {
        filtered = filtered.filter(
          (doctor) => doctor.location === filters.location
        );
      }
      if (filters.specialization) {
        filtered = filtered.filter(
          (doctor) => doctor.specialization === filters.specialization
        );
      }
      if (filters.organization) {
        filtered = filtered.filter(
          (doctor) => doctor.hospital === filters.organization
        );
      }
      if (filters.gender) {
        filtered = filtered.filter((doctor) => doctor.gender === filters.gender);
      }
  
      setFilteredDoctors(filtered);
    };
    applyFilters();
    setPage(1);
  }, [filters,doctorsList,setFilteredDoctors]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedDoctors = filteredDoctors.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Container>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <SidebarFilter
            locations={locations}
            specializations={specializations}
            organizations={organizations}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <div className="cardiac-container">
            <div className="search-results-summary">
              <span className="font--family container--fluid mt--20 fs--18 font--normal display--block color--grey">
                {filteredDoctors.length} results found, from your search &nbsp;
                <strong>
                  <span className="font--bold fs--20 font--capitalize">
                    {filters.specialization
                      ? `"${filters.specialization}" , `
                      : ""}
                    {filters.location ? `"${filters.location}" , ` : ""}
                    {filters.organization ? `"${filters.organization} , "` : ""}
                    {filters.gender ? `"${filters.gender}"` : ""}
                  </span>
                </strong>
              </span>
            </div>
            <div className="doctor--card-container">
              {paginatedDoctors.length > 0
                ? paginatedDoctors.map((doctor, index) => (
                    <DoctorCard
                      key={index}
                      doctor={doctor}
                      sethandle={sethandle}
                    />
                  ))
                : "No results found."}
            </div>
            <Box mt={2} display="flex" justifyContent="center">
              <Pagination
                count={Math.ceil(filteredDoctors.length / itemsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientDoctorSearch;
