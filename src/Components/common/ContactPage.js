import React, { useState, useEffect } from "react";
import "../Styles/ContactPage.css";
import ApiService from "../../services/ApiServices";
import Toast from "../pages/Toast";
import { useTranslation } from "react-i18next";

const ContactPage = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
    company: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = {
        fullName: formData.fullName,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        company: formData.company || "",
      };

      await ApiService.sendContactRequest(submitData);

      setToast({ message: t("contact_success"), type: "success" });
      setFormData({
        fullName: "",
        email: "",
        subject: "",
        message: "",
        company: "",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setToast({ message: t("contact_error"), type: "error" });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (loading) return null;

  return (
    <div className="contact-page-container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <header className="contact-header">
        <h1>{t("contact_title")}</h1>
        <p>{t("contact_subtitle")}</p>
        <div className="wave-decoration"></div>
      </header>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t("contact_name_label")}</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder={t("contact_name_placeholder")}
            required
          />
        </div>

        <div className="form-group">
          <label>{t("contact_email_label")}</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t("contact_email_placeholder")}
            required
          />
        </div>

        <div className="form-group">
          <label>{t("contact_subject_label")}</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder={t("contact_subject_placeholder")}
            required
          />
        </div>

        <div className="form-group">
          <label>{t("contact_message_label")}</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={t("contact_message_placeholder")}
            rows="5"
            required
          />
        </div>

        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          style={{ display: "none" }}
        />

        <button
          type="submit"
          className="contact-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("contact_sending") : t("contact_send")}
        </button>
      </form>

      <section className="contact-location">
        <h2>{t("contact_location_title")}</h2>
        <p>{t("contact_location_address")}</p>
        <div className="map-container">
          <iframe
            title="DC-ICT Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.0610836071323!2d-17.4562025!3d14.6955951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec172fc01eb3c39%3A0x6c3c5c1165f82612!2sPharmacie%20Libert%C3%A9%205!5e0!3m2!1sfr!2ssn!4v1718880000000!5m2!1sfr!2ssn"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
