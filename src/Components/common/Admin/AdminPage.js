import React from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/adminPage.css";

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <h1>Welcome Admin</h1>
      <div className="button-container">
        <button onClick={() => navigate("/")}>Gérer les containers</button>
        <button onClick={() => navigate("/admin/colis")}>
          Gérer les colis
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
