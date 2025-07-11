import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiService from "../../services/ApiServices";
import { useTranslation } from "react-i18next";
import "../Styles/register.css";
import photoagauche from "../images/cont1.jpg";

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    adresse: "",
    langue: "fr",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sloganIndex, setSloganIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const slogans = t("register_slogans", { returnObjects: true });

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setSloganIndex((prev) => (prev + 1) % slogans.length);
        setFade(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, [slogans]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await ApiService.registerUser(formData);
      if (response?.status === 201 || response?.data?.status === 201) {
        toast.success(t("register_success"));
        setTimeout(() => navigate("/login"), 3000);
      } else {
        const errMsg =
          response?.data?.message || response?.message || t("register_error");
        toast.error(errMsg);
      }
    } catch (err) {
      console.error("Erreur d'inscription :", err);
      toast.error(
        err.response?.data?.message || err.message || t("register_error")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="cyber-logo">CYBERESPACE</div>

      <div className="register-left">
        <img
          src={photoagauche}
          alt={t("register_illustration_alt")}
          className="register-image"
        />
        <div className={`register-slogan ${fade ? "fade-in" : "fade-out"}`}>
          {slogans[sloganIndex]}
        </div>
      </div>

      <div className="register-right">
        <div className="register-card">
          <h2>{t("create_account")}</h2>
          <form onSubmit={handleSubmit} className="register-form" noValidate>
            {/* Ligne avec deux champs - Nom et Prénom */}
            <div className="form-row">
              <div className="form-group username-group">
                <label htmlFor="nom">{t("last_name")}</label>
                <input
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder={t("placeholder_last_name")}
                  required
                />
              </div>

              <div className="form-group username-group">
                <label htmlFor="prenom">{t("first_name")}</label>
                <input
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder={t("placeholder_first_name")}
                  required
                />
              </div>
            </div>

            {/* Ligne avec deux champs - Email et Téléphone */}
            <div className="form-row">
              <div className="form-group email-group">
                <label htmlFor="email">{t("email")}</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("placeholder_email")}
                  required
                />
              </div>

              <div className="form-group phone-group">
                <label htmlFor="telephone">{t("phone")}</label>
                <input
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder={t("placeholder_phone")}
                  required
                />
              </div>
            </div>

            {/* Ligne avec deux champs - Mot de passe et Adresse */}
            <div className="form-row">
              <div className="form-group password-group">
                <label htmlFor="password">{t("password")}</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t("placeholder_password")}
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label htmlFor="adresse">{t("address")}</label>
                <input
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  placeholder={t("placeholder_address")}
                  required
                />
              </div>
            </div>

            {/* Champ de langue seul */}
            <div className="form-group">
              <label htmlFor="langue">{t("preferred_language")}</label>
              <select
                id="langue"
                name="langue"
                value={formData.langue}
                onChange={handleChange}
                required
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="button-content">
                  <span className="button-loader"></span>
                  <span>{t("processing")}</span>
                </div>
              ) : (
                t("register")
              )}
            </button>

            <div className="register-footer">
              <p>
                {t("already_have_account")}{" "}
                <a href="/login" className="register-link">
                  {t("login")}
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="wave-decoration"></div>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default RegisterPage;
