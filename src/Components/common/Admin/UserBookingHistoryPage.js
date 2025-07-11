import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../../services/ApiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../Styles/UserBookingHistoryPage.css";
import { useTranslation } from "react-i18next";

const UserBookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [colis, setColis] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isAdmin = ApiService.isAdmin();
  const userId = localStorage.getItem("userId");
  const { t } = useTranslation();

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isAdmin) {
          const [bookingsRes, colisRes] = await Promise.all([
            ApiService.getAllBookings(),
            ApiService.getAllColis(),
          ]);
          setBookings(Array.isArray(bookingsRes) ? bookingsRes : []);
          setColis(Array.isArray(colisRes) ? colisRes : []);
        } else {
          const [bookingsRes, colisRes] = await Promise.all([
            ApiService.getMyBookings(),
            ApiService.getColisByUserId(userId),
          ]);
          setBookings(Array.isArray(bookingsRes) ? bookingsRes : []);
          setColis(Array.isArray(colisRes) ? colisRes : []);
        }
      } catch (error) {
        toast.error(t("load_error")); // <-- traduction
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, isAdmin, t]);

  const getStatusClass = (status) => {
    const statusUpper = (status || "").toUpperCase();
    switch (statusUpper) {
      case "EN_ATTENTE":
        return "status-waiting";
      case "EN_COURS":
      case "EN_PREPARATION":
        return "status-in-progress";
      case "PAYE":
      case "PRÊT":
      case "PRET":
        return "status-ready";
      case "EN_TRANSIT":
        return "status-transit";
      case "LIVRÉ":
      case "LIVRE":
        return "status-delivered";
      case "RETOUR":
        return "status-returned";
      case "ANNULÉ":
      case "ANNULE":
      case "PROBLÈME":
      case "PROBLEME":
        return "status-problem";
      default:
        return "status-default";
    }
  };

  const renderBookingCard = (booking) => (
    <div
      key={booking.id}
      className={`booking-card ${getStatusClass(
        booking.statut || booking.status
      )}`}
    >
      <h3>
        {t("booking.container_number")}: {booking.id}
      </h3>
      <p>
        <strong>{t("booking.departure")}:</strong>{" "}
        {booking.lieuEnlevement || booking.depart}
      </p>
      <p>
        <strong>{t("booking.destination")}:</strong> {booking.destination}
      </p>
      <p>
        <strong>{t("booking.departure_date")}:</strong> {booking.dateDepart}
      </p>
      <p>
        <strong>{t("booking.max_weight")}:</strong> {booking.poidsMax} kg
      </p>
      <p>
        <strong>{t("booking.max_volume")}:</strong> {booking.volumeMax} m³
      </p>
      <p>
        <strong>{t("booking.status")}:</strong>{" "}
        <span
          className={`status-badge ${getStatusClass(
            booking.statut || booking.status
          )}`}
        >
          {booking.statut || booking.status}
        </span>
      </p>
    </div>
  );

  const renderColisCard = (colis) => (
    <div
      key={colis.id}
      className={`colis-card ${colis.paye ? "paid" : ""} ${getStatusClass(
        colis.etat
      )}`}
    >
      <img
        src={colis.photoUrl || "/default-colis.png"}
        alt="Colis"
        className="colis-image"
      />
      <p>
        <strong>{t("colis.weight")}:</strong> {colis.poids} kg
      </p>
      <p>
        <strong>{t("colis.volume")}:</strong> {colis.volume} m³
      </p>
      <p>
        <strong>{t("colis.description")}:</strong> {colis.description}
      </p>
      <p>
        <strong>{t("colis.price")}:</strong> {colis.prixEstime || 0} $
      </p>
      <p>
        <strong>{t("colis.status")}:</strong>{" "}
        <span className={`status-badge ${getStatusClass(colis.etat)}`}>
          {colis.etat}
        </span>
      </p>
      {colis.paye && <span className="paid-label">{t("colis.paid")}</span>}
    </div>
  );

  return (
    <div className="user-booking-history-page">
      <h1>
        {isAdmin ? t("admin.booking_management") : t("user.booking_history")}
      </h1>

      {loading ? (
        <p className="loading-message">{t("loading")}</p>
      ) : (
        <>
          <h2>{t("booking.title")}</h2>
          {bookings.length === 0 ? (
            <p className="no-data">{t("booking.none_found")}</p>
          ) : (
            <div className="booking-list">
              {bookings.map(renderBookingCard)}
            </div>
          )}

          <h2>{t("colis.title")}</h2>
          {colis.length === 0 ? (
            <p className="no-data">{t("colis.none_found")}</p>
          ) : (
            <div className="colis-list">{colis.map(renderColisCard)}</div>
          )}
        </>
      )}

      <ToastContainer />
    </div>
  );
};

export default UserBookingHistoryPage;
