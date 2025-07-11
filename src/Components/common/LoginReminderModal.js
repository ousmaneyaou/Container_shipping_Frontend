import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/LoginReminderModal.css";
import { useTranslation } from "react-i18next"; // <-- Ajout pour la traduction

const LoginReminderModal = ({ onClose }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // <-- Initialisation du hook

  const handleLoginRedirect = () => {
    onClose();
    navigate("/login");
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{t("login_modal.title")}</h2>
        <p>{t("login_modal.message")}</p>
        <div className="modal-actions">
          <button onClick={handleLoginRedirect} className="confirm-btn">
            {t("login_modal.login")}
          </button>
          <button onClick={onClose} className="cancel-btn">
            {t("login_modal.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginReminderModal;
