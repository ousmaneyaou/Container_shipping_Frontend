import React, { useEffect, useState } from "react";
import ApiService from "../../services/ApiServices";
import { Loader2, ArrowRight } from "lucide-react";
import "../Styles/ContainerBookingList.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoginReminderModal from "../common/LoginReminderModal";

const Card = ({ children }) => <div className="card">{children}</div>;
const CardContent = ({ children }) => (
  <div className="card-content">{children}</div>
);

const CapacityDisplay = ({
  label,
  used,
  remaining,
  max,
  unit,
  percentageUsed,
  percentageRemaining,
}) => (
  <div className="capacity-display">
    <h3>{label}</h3>
    <div className="capacity-row">
      <span className="capacity-label">
        {label === "Poids" ? "Max" : "Max"}:
      </span>
      <span className="capacity-value">
        {max.toLocaleString()} {unit}
      </span>
    </div>
    <div className="capacity-row">
      <span className="capacity-label">
        {label === "Poids" ? "Utilisé" : "Utilisé"}:
      </span>
      <span className="capacity-value">
        {used.toLocaleString(undefined, { maximumFractionDigits: 1 })} {unit} (
        {percentageUsed}%)
      </span>
    </div>
    <div className="capacity-row">
      <span className="capacity-label">
        {label === "Poids" ? "Restant" : "Restant"}:
      </span>
      <span className="capacity-value">
        {remaining.toLocaleString(undefined, { maximumFractionDigits: 1 })}{" "}
        {unit} ({percentageRemaining}%)
      </span>
    </div>
    <div className="progress-container">
      <div
        className="progress-bar"
        style={{ width: `${percentageUsed}%` }}
        title={`${percentageUsed}% ${
          label === "Poids" ? "utilisé" : "utilisé"
        }`}
      ></div>
    </div>
  </div>
);

const getStatusClass = (status) => {
  switch (status) {
    case "EN_COURS":
      return "statuts-EnCours";
    case "EN_ATTENTE":
      return "statuts-EnAttente";
    case "LIVRE":
      return "statuts-Livre";
    case "ANNULE":
      return "statuts-Annule";
    default:
      return "";
  }
};

const ContainerBookingList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isAdmin = ApiService.isAdmin();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    lieuEnlevement: "",
    destination: "",
    dateDepart: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await ApiService.getAllBookings();
        let data = Array.isArray(response.data) ? response.data : [];

        if (!isAdmin) {
          data = data.filter((b) => b.statut === "EN_COURS");
        }

        setBookings(data);
        setSearchResults(data);
      } catch (err) {
        console.error("Error while fetching data:", err);
        setError(t("error_occurred"));
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [t, isAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchError(null);

    const { dateDepart, lieuEnlevement, destination } = filters;

    if (!dateDepart) {
      setSearchError(t("please_select_departure_date"));
      return;
    }

    try {
      let filtered = [...bookings];

      filtered = filtered.filter((b) => {
        const bookingDate = new Date(b.dateDepart).toISOString().split("T")[0];
        const filterDate = new Date(dateDepart).toISOString().split("T")[0];
        return bookingDate === filterDate;
      });

      if (lieuEnlevement.trim()) {
        filtered = filtered.filter((b) =>
          b.lieuEnlevement
            ?.toLowerCase()
            .includes(lieuEnlevement.trim().toLowerCase())
        );
      }

      if (destination.trim()) {
        filtered = filtered.filter((b) =>
          b.destination
            ?.toLowerCase()
            .includes(destination.trim().toLowerCase())
        );
      }

      setSearchResults(filtered);
    } catch (err) {
      console.error("Error during local filtering:", err);
      setSearchError(t("error_occurred"));
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        t("confirm_delete_container") ||
          "Confirmer la suppression du conteneur ?"
      )
    )
      return;
    try {
      await ApiService.deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      setSearchResults((prev) => prev.filter((b) => b.id !== id));
      toast.success(
        t("container_deleted_successfully") || "Conteneur supprimé avec succès."
      );
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      toast.error(t("error_occurred") || "Une erreur est survenue.");
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <Loader2 className="spin" />
        <span>{t("loading")}</span>
      </div>
    );
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>{t("ready_to_ship_this_summer")}</h1>
        <p>{t("organize_international_shipments")}</p>
        <h3>{t("search_containers")}</h3>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="date"
            name="dateDepart"
            value={filters.dateDepart}
            onChange={handleChange}
          />
          <button type="submit">{t("search")}</button>
        </form>

        {isAdmin && (
          <div className="add-btn-container">
            <button
              className="admin-btn add-btn"
              onClick={() => navigate(`/ajouter-conteneur`)}
            >
              ➕ {t("add_container")}
            </button>
          </div>
        )}

        {searchError && <div className="error-state">{searchError}</div>}
      </div>

      <div className="bookings-list">
        {searchResults.length === 0 && !searchError && (
          <div className="empty-state">{t("no_bookings_available")}</div>
        )}

        {searchResults.map((booking) => {
          const poidsMax = parseFloat(booking.poidsMax || 0);
          const poidsRestant = parseFloat(booking.poidsRestant || 0);
          const poidsUtilise = poidsMax - poidsRestant;
          const poidsPourcentage = poidsMax
            ? Math.min(100, Math.round((poidsUtilise / poidsMax) * 100))
            : 0;
          const poidsPourcentageRestant = 100 - poidsPourcentage;

          const volumeMax = parseFloat(booking.volumeMax || 0);
          const volumeRestant = parseFloat(booking.volumeRestant || 0);
          const volumeUtilise = volumeMax - volumeRestant;
          const volumePourcentage = volumeMax
            ? Math.min(100, Math.round((volumeUtilise / volumeMax) * 100))
            : 0;
          const volumePourcentageRestant = 100 - volumePourcentage;

          return (
            <Card key={booking.id}>
              <CardContent>
                <div className="booking-header">
                  <h2>
                    {t("container")} {booking.id}
                  </h2>
                  <span className={`statut ${getStatusClass(booking.statut)}`}>
                    {t(booking.statut.toLowerCase()) || booking.statut}
                  </span>
                </div>

                <div className="booking-info-grid">
                  <div className="info-item">
                    <span className="info-label">{t("container_size")}:</span>
                    <span className="info-value">
                      {booking.tailleConteneur || "N/A"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t("departure")}:</span>
                    <span className="info-value">
                      {booking.lieuEnlevement || "N/A"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t("destination")}:</span>
                    <span className="info-value">
                      {booking.destination || "N/A"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t("departure_date")}:</span>
                    <span className="info-value">
                      {booking.dateDepart
                        ? new Date(booking.dateDepart).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <CapacityDisplay
                  label={t("weight")}
                  used={poidsUtilise}
                  remaining={poidsRestant}
                  max={poidsMax}
                  unit="kg"
                  percentageUsed={poidsPourcentage}
                  percentageRemaining={poidsPourcentageRestant}
                />

                <CapacityDisplay
                  label={t("volume")}
                  used={volumeUtilise}
                  remaining={volumeRestant}
                  max={volumeMax}
                  unit="m³"
                  percentageUsed={volumePourcentage}
                  percentageRemaining={volumePourcentageRestant}
                />

                <button
                  onClick={() => {
                    if (!ApiService.isAuthenticated()) {
                      setShowLoginModal(true);
                      return;
                    }

                    if (poidsRestant <= 0 || volumeRestant <= 0) {
                      toast.error(
                        t("container_no_capacity") ||
                          "Ce conteneur n'a pas assez de poids ou de volume disponible."
                      );
                      return;
                    }

                    navigate(`/ajouter-colis/${booking.id}`);
                  }}
                  className="reserver-btn"
                >
                  {t("book_this_container")} <ArrowRight size={16} />
                </button>

                {isAdmin && (
                  <div className="admin-actions">
                    <button
                      className="admin-btn edit-btn"
                      onClick={() =>
                        navigate(`/update-conteneur/${booking.id}`, {
                          state: { booking },
                        })
                      }
                    >
                      ✏️ {t("edit")}
                    </button>
                    <button
                      className="admin-btn delete-btn"
                      onClick={() => handleDelete(booking.id)}
                    >
                      🗑️ {t("delete")}
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {showLoginModal && (
        <LoginReminderModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
};

export default ContainerBookingList;
