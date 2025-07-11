import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../services/ApiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/ColisListPage.css";
import { useTranslation } from "react-i18next";

const ColisListPage = () => {
  const { t } = useTranslation();
  const [colisList, setColisList] = useState([]);
  const [selectedColisIds, setSelectedColisIds] = useState([]);
  const [error, setError] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId");

  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get("session_id");

  const fetchColis = () => {
    if (!userId) {
      setError(t("please_login_warning"));
      return;
    }
    ApiService.getColisByUserId(userId)
      .then((response) => {
        setColisList(Array.isArray(response) ? response : []);
        setError(null);
      })
      .catch((error) => {
        console.error("API error:", error);
        setError(t("error_occurred"));
      });
  };

  useEffect(() => {
    if (!userId) return;
    fetchColis();
  }, [userId]);

  useEffect(() => {
    if (!sessionId) return;

    const validateStripeSession = async () => {
      try {
        await ApiService.validatePayment(sessionId);
        toast.success(t("toast_success") || "✅ Paiement validé avec succès !");
        fetchColis();
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      } catch (err) {
        console.error("Stripe validation error:", err);
        toast.error(
          t("toast_error") ||
            "❌ Une erreur est survenue lors de la validation du paiement."
        );
      }
    };

    validateStripeSession();
  }, [sessionId]);

  const unpaidColis = colisList.filter((colis) => !colis.paymentId);
  const paidColis = colisList.filter((colis) => !!colis.paymentId);

  const handleCheckboxChange = (colisId) => {
    setSelectedColisIds((prev) =>
      prev.includes(colisId)
        ? prev.filter((id) => id !== colisId)
        : [...prev, colisId]
    );
  };

  const handleSelectAll = () => {
    const ids = unpaidColis.map((colis) => colis.id);
    setSelectedColisIds(ids);
  };

  const handleClearSelection = () => {
    setSelectedColisIds([]);
  };

  const handleViewDetails = (colisId) => {
    navigate(`/colis/${colisId}`);
  };

  const handleGroupPayment = async () => {
    if (selectedColisIds.length === 0) {
      toast.warning(
        t("please_select_at_least_one_parcel") ||
          "Veuillez sélectionner au moins un colis à payer."
      );
      return;
    }
    setLoadingPayment(true);
    try {
      const response = await ApiService.initiateGroupPayment(selectedColisIds);
      if (response?.redirectUrl) {
        window.location.href = response.redirectUrl;
      } else {
        toast.error(
          t("group_payment_failed") || "Échec du démarrage du paiement groupé."
        );
      }
    } catch (err) {
      console.error(err);
      toast.error(
        t("payment_initialization_error") ||
          "Erreur lors de l'initialisation du paiement."
      );
    } finally {
      setLoadingPayment(false);
    }
  };

  const handleSinglePayment = async (colisId) => {
    setLoadingPayment(true);
    try {
      const response = await ApiService.initiateSinglePayment(colisId);
      if (response?.redirectUrl) {
        window.location.href = response.redirectUrl;
      } else {
        toast.error(
          t("single_payment_failed") || "Échec du démarrage du paiement."
        );
      }
    } catch (err) {
      console.error(err);
      toast.error(
        t("payment_initialization_error") ||
          "Erreur lors de l'initialisation du paiement."
      );
    } finally {
      setLoadingPayment(false);
    }
  };

  const totalPrix = colisList
    .filter((colis) => selectedColisIds.includes(colis.id))
    .reduce((total, colis) => total + (colis.prixEstime || 0), 0);

  const renderColisCard = (colis, isPaid = false) => (
    <li key={colis.id} className={`colis-card ${isPaid ? "paid" : ""}`}>
      {!isPaid && (
        <>
          <input
            type="checkbox"
            checked={selectedColisIds.includes(colis.id)}
            onChange={() => handleCheckboxChange(colis.id)}
          />
          <button
            className="single-pay-button"
            onClick={() => handleSinglePayment(colis.id)}
            disabled={loadingPayment}
          >
            {t("pay_this_parcel") || "Payer ce colis"}
          </button>
        </>
      )}
      <img
        src={colis.photoUrl || "/default-colis.png"}
        alt={t("parcel_photo_alt") || "Photo du colis"}
        className="colis-image"
      />
      <div className="colis-info">
        <p>
          <strong>{t("client_name") || "Nom client"}:</strong> {colis.username}
        </p>
        <p>
          <strong>{t("weight") || "Poids"}:</strong> {colis.poids} kg
        </p>
        <p>
          <strong>{t("volume") || "Volume"}:</strong> {colis.volume} m³
        </p>
        <p>
          <strong>{t("description") || "Description"}:</strong>{" "}
          {colis.description}
        </p>
        <p>
          <strong>{t("parcel_price") || "Prix du Colis"}:</strong>{" "}
          {(colis.prixEstime || 0).toFixed(2)} $
        </p>
        <p>
          <strong>{t("status") || "État"}:</strong> {colis.etat}
        </p>

        {isPaid && (
          <p className="paid-status-label">
            {t("payment_confirmed") || "Paiement confirmé"}
          </p>
        )}
      </div>
      {!isPaid ? (
        <button onClick={() => handleViewDetails(colis.id)}>
          {t("view_details") || "Voir détails"}
        </button>
      ) : (
        <span className="paid-label">✔️ {t("paid") || "Payé"}</span>
      )}
    </li>
  );

  return (
    <div className="colis-list-page">
      <h1>{t("my_parcels") || "Mes Colis"}</h1>

      {error ? (
        <div className="error-section">
          <p className="error">{error}</p>
          {error.includes(t("please_login_warning")) && (
            <span
              onClick={() => navigate("/login")}
              className="login-link"
              style={{
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {t("click_here_to_login") || "Cliquez ici pour vous connecter"}
            </span>
          )}
        </div>
      ) : (
        <>
          {/* Unpaid Parcels */}
          <section className="section">
            <h2>
              {t("to_pay")} ({unpaidColis.length})
            </h2>

            <div className="selection-buttons">
              <button onClick={handleSelectAll}>
                {t("select_all") || "Tout sélectionner"}
              </button>
              <button onClick={handleClearSelection}>
                {t("clear_selection") || "Désélectionner"}
              </button>
            </div>

            {unpaidColis.length === 0 ? (
              <p>{t("no_parcels_to_pay") || "Aucun colis à payer."}</p>
            ) : (
              <ul className="colis-list">
                {unpaidColis.map((colis) => renderColisCard(colis))}
              </ul>
            )}

            {selectedColisIds.length > 0 && (
              <div className="payment-summary">
                <p>
                  <strong>{t("total_to_pay") || "Total à payer"}:</strong>{" "}
                  {totalPrix.toFixed(2)} $
                </p>
                <button
                  className="pay-button"
                  onClick={handleGroupPayment}
                  disabled={loadingPayment}
                >
                  {t("pay_selection") || "Payer la sélection"}
                </button>
              </div>
            )}
          </section>

          {/* Paid Parcels */}
          <section className="section">
            <h2>
              {t("already_paid")} ({paidColis.length})
            </h2>
            {paidColis.length === 0 ? (
              <p>{t("no_parcels_paid") || "Aucun colis payé."}</p>
            ) : (
              <ul className="colis-list">
                {paidColis.map((colis) => renderColisCard(colis, true))}
              </ul>
            )}
          </section>
        </>
      )}

      <ToastContainer />
    </div>
  );
};

export default ColisListPage;
