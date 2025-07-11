import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiServices";
import "../Styles/login.css";
import { useTranslation } from "react-i18next";

const ResetPasswordPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage(t("passwords_do_not_match"));
      return;
    }

    if (newPassword.length < 6) {
      setMessage(t("password_too_short"));
      return;
    }

    setLoading(true);
    try {
      const response = await ApiService.changePassword({
        currentPassword,
        newPassword,
      });

      if (response.includes("succès") || response.includes("success")) {
        setMessage(t("password_changed_success"));
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage(t("error_occurred"));
      }
    } catch (error) {
      const errMsg = error.response?.data || t("change_error");
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>{t("change_password_title")}</h2>
        {message && (
          <p
            className={`message ${
              message.includes("✅") ? "success" : "error"
            }`}
            role="alert"
          >
            {message}
          </p>
        )}

        <form onSubmit={handleChangePassword} className="login-form" noValidate>
          <label htmlFor="current-password">{t("current_password")}</label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <label htmlFor="new-password">{t("new_password")}</label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label htmlFor="confirm-password">{t("confirm_password")}</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? t("loading") : t("change_password_button")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
