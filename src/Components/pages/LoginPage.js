import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiService from "../../services/ApiServices";
import "../Styles/login.css";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [sloganIndex, setSloganIndex] = useState(0);
  const navigate = useNavigate();

  const slogans = t("slogans", { returnObjects: true });

  useEffect(() => {
    const interval = setInterval(() => {
      setSloganIndex((prevIndex) => (prevIndex + 1) % slogans.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slogans]);

  const parseJwt = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (error) {
      console.error("Erreur de décodage JWT :", error);
      return null;
    }
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.warning(t("fill_all_fields_warning"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await ApiService.loginUser(formData);

      if (response.success) {
        const { token, role } = response;

        if (!token || !role) {
          toast.error(t("invalid_server_response"));
          return;
        }

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        const payload = parseJwt(token);
        if (payload?.userId) {
          localStorage.setItem("userId", payload.userId);
        }

        toast.success(t("login_success"), {
          autoClose: 1000,
          position: "top-right",
        });
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error(response.message || t("invalid_credentials"));
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      toast.error(error.response?.data?.message || t("server_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-image-text">{slogans[sloganIndex]}</div>

      <div className="login-card">
        <h2>{t("login_title")}</h2>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <label htmlFor="email">{t("email_label")}</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder={t("email_placeholder")}
          />

          <label htmlFor="password">{t("password_label")}</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder={t("password_placeholder")}
          />

          <button
            type="submit"
            disabled={loading}
            className={loading ? "loading" : ""}
          >
            {loading ? <span className="button-loader" /> : t("login_button")}
          </button>

          <div className="link-container">
            <p>
              <Link to="/forgot-password">{t("forgot_password")}</Link>
            </p>
            <p>
              {t("no_account")}{" "}
              <Link to="/register">{t("create_account")}</Link>
            </p>
          </div>
        </form>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default LoginPage;
