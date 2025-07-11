import React, { useEffect, useState, useRef } from "react";
import "../Styles/PromoBanner.css";
import agentImage from "../images/2025-rfp-hub_img_1200x800.webp";
import agentImage1 from "../images/FMU_Blog_Thumbnail.webp";
import agentImage2 from "../images/f85ac460-5b78-4ef9-acba-07f0f0f7b8d7.webp";
import { useTranslation } from "react-i18next";

const PromoBanner = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef(null);

  const slides = [
    {
      image: agentImage,
      title: t("slide1_title"),
      text: t("slide1_text"),
      cta: t("slide1_cta"),
    },
    {
      image: agentImage1,
      title: t("slide2_title"),
      text: t("slide2_text"),
      cta: t("slide2_cta"),
    },
    {
      image: agentImage2,
      title: t("slide3_title"),
      text: t("slide3_text"),
      cta: t("slide3_cta"),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  const goToSlide = (index) => setCurrentIndex(index);

  return (
    <div className="promo-banner">
      <div className="promo-track" ref={trackRef}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className="promo-slide"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-overlay"></div>
            <div className="slide-content">
              <div className="content-wrapper">
                <h2 className="slide-title">{slide.title}</h2>
                <p className="slide-text">{slide.text}</p>
                <a href="#" className="promo-link">
                  {slide.cta}
                  <span className="link-arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="slide-nav">
        <div></div>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`nav-dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Aller à la diapositive ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoBanner;
