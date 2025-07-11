// src/components/LogisticsIntro.js
import React from "react";
import "../Styles/LogisticsIntro.css";
import introImage from "../images/fejuz-q6j5mSRpi50-unsplash.jpg";
import { useTranslation } from "react-i18next";

const LogisticsIntro = () => {
  const { t } = useTranslation();

  return (
    <section className="intro-section">
      <div className="intro-container">
        {/* Texte à gauche */}
        <div className="intro-content">
          <h2 className="intro-title">
            {t("intro_title")}{" "}
            <span className="text-blue-600">{t("intro_title_highlight")}</span>
          </h2>
          <p className="intro-text">{t("intro_description")}</p>

          <div className="intro-stats">
            <div className="stat">
              <span className="stat-number">+500</span>
              <span className="stat-label">{t("intro_clients")}</span>
            </div>
            <div className="stat">
              <span className="stat-number">40+</span>
              <span className="stat-label">{t("intro_destinations")}</span>
            </div>
            <div className="stat">
              <span className="stat-number">98%</span>
              <span className="stat-label">{t("intro_ontime")}</span>
            </div>
          </div>
        </div>

        {/* Image à droite */}
        <div className="intro-image">
          <img
            src={introImage}
            alt={t("intro_image_alt")}
            className="intro-img"
          />
        </div>
      </div>
    </section>
  );
};

export default LogisticsIntro;
