import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {  AdminProvider } from "./AdminDashContext";
const AdminDashBoard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem("Admin")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      {sessionStorage.getItem("Admin") && (
        <AdminProvider>
          <Outlet />
        </AdminProvider>
      )}
    </>
  );
};

export default AdminDashBoard;
