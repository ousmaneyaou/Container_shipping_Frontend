import React, { useEffect, useState } from "react";
import ApiService from "../../../services/ApiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../Styles/AccountPage.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await ApiService.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          toast.error(t("fetch_error")); // corrigé
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur", error);
        toast.error(t("load_error")); // corrigé
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [t]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t("loading")}</p> {/* corrigé */}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="account-page">
        <ToastContainer />
        <p className="error">{t("not_logged_in")}</p> {/* corrigé */}
      </div>
    );
  }

  return (
    <div className="account-page">
      <ToastContainer />
      <h1>{t("profile_title")}</h1> {/* corrigé */}
      <div className="user-detail-card">
        <h2>{t("user_info")}</h2> {/* corrigé */}
        <p>
          <strong>{t("name")} :</strong> {user.nom} {user.prenom}
        </p>
        <p>
          <strong>{t("email")} :</strong> {user.email}
        </p>
        <p>
          <strong>{t("phone")} :</strong> {user.telephone || t("not_provided")}
        </p>
        <p>
          <strong>{t("address")} :</strong> {user.adresse || t("not_specified")}
        </p>
        <p>
          <strong>{t("language")} :</strong> {user.langue || t("not_specified")}
        </p>
        <p>
          <strong>{t("role")} :</strong> {user.role}
        </p>
        {/* <p>
          <Link to="/change-password">{t("change_password")}</Link>
        </p> */}
      </div>
    </div>
  );
};

export default AccountPage;
