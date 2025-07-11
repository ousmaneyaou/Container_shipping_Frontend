import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/ColisDetailPage.css";
import { useTranslation } from "react-i18next";

const ColisDetailPage = () => {
  const { t } = useTranslation();
  const { colisId } = useParams();
  const [colis, setColis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (colisId) {
      setLoading(true);
      ApiService.getColisById(colisId)
        .then((response) => {
          setColis(response);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(t("error"));
          setLoading(false);
          toast.error(t("error"));
        });
    }
  }, [colisId, t]);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="colis-detail-container">
      <h1>
        {t("title")} {colis.id}
      </h1>
      <div className="colis-detail-card">
        <img
          src={colis.photoUrl || "/default-colis.png"}
          alt={`${t("title")} ${colis.id}`}
          className="colis-detail-image"
          onError={(e) => {
            e.target.src = "/default-colis.png";
          }}
        />
        <div className="colis-detail-info">
          <h3>{t("sectionTitle")}</h3>
          <p>
            <strong>{t("description")} :</strong> {colis.description}
          </p>
          <p>
            <strong>{t("poids")} :</strong> {colis.poids} kg
          </p>
          <p>
            <strong>{t("dimensions")} :</strong> {colis.longueur} x{" "}
            {colis.largeur} x {colis.hauteur} m
          </p>
          <p>
            <strong>{t("volume")} :</strong> {colis.volume?.toFixed(2)} m³
          </p>
          <p>
            <strong>{t("prix")} :</strong> {colis.prixEstime?.toFixed(2)} $
          </p>
          <p>
            <strong>{t("etat")} :</strong>{" "}
            <span className={`status-${colis.etat.toLowerCase()}`}>
              {colis.etat}
            </span>
          </p>

          <p>
            <strong>{t("paye")} :</strong>{" "}
            {colis.paymentId ? t("paye") : t("non_paye")}
          </p>
          <p>
            <strong>{t("container")} :</strong>{" "}
            {colis.containerBookingId || t("non_assigne")}
          </p>
          <h3>{t("clientInfos")}</h3>
          <p>
            <strong>{t("nom")} :</strong> {colis.username}
          </p>
          <p>
            <strong>{t("email")} :</strong> {colis.userEmail}
          </p>
          <p>
            <strong>{t("telephone")} :</strong> {colis.userPhone}
          </p>
        </div>
      </div>
      <button onClick={() => navigate(-1)}>
        <span className="back-arrow">←</span> {t("retour")}
      </button>
      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
};

export default ColisDetailPage;
