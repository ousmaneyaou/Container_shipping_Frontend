import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiService from "../../services/ApiServices";
import "../Styles/AddColisForm.css";
import PhotoBanner from "../images/cont2.jpg";
import { useTranslation } from "react-i18next";

const AddColisForm = () => {
  const { t } = useTranslation();
  const { bookingId } = useParams();
  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? Number(storedUserId) : null;
  const navigate = useNavigate();

  const [colis, setColis] = useState({
    poids: "",
    longueur: "",
    largeur: "",
    hauteur: "",
    description: "",
    photoPreview: "",
    photoFile: null,
    etat: "ENREGISTRE",
  });

  const [customsDoc, setCustomsDoc] = useState({
    typeDocument: "",
    imagePreview: "",
    imageFile: null,
  });

  const [insurance, setInsurance] = useState({
    typeCouverture: "",
    description: "",
    valeurCouverture: "",
    imagePreview: "",
    imageFile: null,
  });

  const [loading, setLoading] = useState(false);

  if (!userId || !bookingId) {
    return (
      <div className="error-message">{t("error_user_or_booking_missing")}</div>
    );
  }

  const handleChange =
    (setter) =>
    ({ target: { name, value } }) => {
      setter((prev) => ({ ...prev, [name]: value }));
    };

  const handleImageUpload = (setter, previewField, fileField) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setter((prev) => ({
      ...prev,
      [previewField]: preview,
      [fileField]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !insurance.typeCouverture.trim() ||
        !insurance.valeurCouverture.trim()
      ) {
        toast.error(t("toast_missing_insurance"));
        return;
      }

      if (!customsDoc.typeDocument.trim() || !customsDoc.imageFile) {
        toast.error(t("toast_missing_customs"));
        return;
      }

      const parseOrNull = (value) => {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? null : parsed;
      };

      const poids = parseOrNull(colis.poids);
      const longueur = parseOrNull(colis.longueur);
      const largeur = parseOrNull(colis.largeur);
      const hauteur = parseOrNull(colis.hauteur);
      const valeurCouverture = parseOrNull(insurance.valeurCouverture);

      if (
        [poids, longueur, largeur, hauteur, valeurCouverture].includes(null)
      ) {
        toast.error(t("toast_invalid_numbers"));
        return;
      }

      const numericBookingId = Number(bookingId);

      const insuranceDto = {
        typeCouverture: insurance.typeCouverture.trim(),
        description: insurance.description.trim(),
        valeurCouverture,
        userId,
        containerBookingId: numericBookingId,
      };

      const savedInsurance = await ApiService.createInsurance(
        insuranceDto,
        insurance.imageFile
      );

      const colisDto = {
        poids,
        longueur,
        largeur,
        hauteur,
        description: colis.description.trim(),
        etat: colis.etat,
        userId,
        containerBookingId: numericBookingId,
        assuranceId: savedInsurance.id,
      };

      await ApiService.createColis(numericBookingId, colisDto, colis.photoFile);

      const customsDto = {
        typeDocument: customsDoc.typeDocument.trim(),
        statut: "EN_ATTENTE",
        userId,
        containerBookingId: numericBookingId,
      };

      await ApiService.uploadCustomsDoc(
        customsDto,
        customsDoc.imageFile,
        userId,
        numericBookingId
      );

      toast.success(t("toast_colis_success"));
      setTimeout(() => navigate("/colis"), 2000);
    } catch (err) {
      console.error("Erreur lors de la soumission :", err);
      toast.error(err.response?.data?.message || t("toast_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-colis-container">
      <form onSubmit={handleSubmit} className="add-colis-form">
        <div className="form-image-section">
          <img src={PhotoBanner} alt="Illustration colis" />
        </div>

        <h1>{t("tracker_title")}</h1>
        <h2>
          {t("add_colis_for")} {bookingId}
        </h2>

        <fieldset className="section">
          <legend>{t("colis_section")}</legend>
          {["poids", "longueur", "largeur", "hauteur"].map((field) => (
            <div className="form-group" key={field}>
              <input
                type="number"
                name={field}
                className="form-input"
                placeholder={`${field[0].toUpperCase()}${field.slice(
                  1
                )} (kg / m)`}
                value={colis[field]}
                onChange={handleChange(setColis)}
                required
                step="0.01"
                min="0"
              />
            </div>
          ))}
          <div className="form-group">
            <input
              type="text"
              name="description"
              className="form-input"
              placeholder={t("colis_description")}
              value={colis.description}
              onChange={handleChange(setColis)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t("colis_photo")}</label>
            <input
              type="file"
              accept="image/*"
              className="form-input"
              onChange={handleImageUpload(
                setColis,
                "photoPreview",
                "photoFile"
              )}
            />
            {colis.photoPreview && (
              <img
                src={colis.photoPreview}
                alt="Aperçu colis"
                className="preview-img"
              />
            )}
          </div>
        </fieldset>

        <fieldset className="section">
          <legend>{t("customs_section")}</legend>
          <div className="form-group">
            <input
              type="text"
              name="typeDocument"
              className="form-input"
              placeholder={t("customs_type")}
              value={customsDoc.typeDocument}
              onChange={handleChange(setCustomsDoc)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t("customs_image")}</label>
            <input
              type="file"
              accept="image/*"
              className="form-input"
              onChange={handleImageUpload(
                setCustomsDoc,
                "imagePreview",
                "imageFile"
              )}
              required
            />
            {customsDoc.imagePreview && (
              <img
                src={customsDoc.imagePreview}
                alt="Aperçu document"
                className="preview-img"
              />
            )}
          </div>
        </fieldset>

        <fieldset className="section">
          <legend>{t("insurance_section")}</legend>
          <input
            type="text"
            name="typeCouverture"
            className="form-input"
            placeholder={t("insurance_type")}
            value={insurance.typeCouverture}
            onChange={handleChange(setInsurance)}
            required
          />
          <input
            type="text"
            name="description"
            className="form-input"
            placeholder={t("insurance_description")}
            value={insurance.description}
            onChange={handleChange(setInsurance)}
          />
          <input
            type="number"
            name="valeurCouverture"
            className="form-input"
            placeholder={t("insurance_value")}
            value={insurance.valeurCouverture}
            onChange={handleChange(setInsurance)}
            required
            step="0.01"
            min="0"
          />
          <div className="form-group">
            <label className="form-label">{t("insurance_image")}</label>
            <input
              type="file"
              accept="image/*"
              className="form-input"
              onChange={handleImageUpload(
                setInsurance,
                "imagePreview",
                "imageFile"
              )}
            />
            {insurance.imagePreview && (
              <img
                src={insurance.imagePreview}
                alt="Aperçu assurance"
                className="preview-img"
              />
            )}
          </div>
        </fieldset>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <span className="button-loader"></span>
          ) : (
            t("submit_button")
          )}
        </button>
      </form>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default AddColisForm;
