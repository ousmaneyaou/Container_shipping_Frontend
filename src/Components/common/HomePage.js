import React from "react";
import { Link } from "react-router-dom";
import "../Styles/home.css";
import { useTranslation } from "react-i18next";
import photo1 from "../images/vidar-nordli-mathisen-y8TMoCzw87E-unsplash.jpg";
import photo2 from "../images/tri-eptaroka-mardiana-hP4ZiN1_kdk-unsplash.jpg";
import photo3 from "../images/thais-morais-9c6j-akotJQ-unsplash.jpg";
import photo4 from "../images/pr3.jpeg";
import photo5 from "../images/home.png";
import heroImage from "../images/jonas-smith-aL6tG-j-E4Y-unsplash.jpg";
import {
  Ship,
  Globe,
  Clock,
  CheckCircle,
  Package,
  Users,
  MapPin,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

const HomePage = () => {
  const { t } = useTranslation();

  const stats = [
    {
      value: "98%",
      label: t("on_time_deliveries"),
      icon: <CheckCircle className="text-blue-600" />,
    },
    {
      value: "150+",
      label: t("countries_served"),
      icon: <Globe className="text-blue-600" />,
    },
    {
      value: "24/7",
      label: t("customer_support"),
      icon: <Clock className="text-blue-600" />,
    },
  ];

  const services = [
    {
      img: photo1,
      title: t("global_network"),
      description: t("global_network_desc"),
    },
    {
      img: photo2,
      title: t("secure_storage"),
      description: t("secure_storage_desc"),
    },
    {
      img: photo3,
      title: t("smart_tracking"),
      description: t("smart_tracking_desc"),
    },
  ];

  const testimonials = [
    {
      avatar: photo4,
      quote: t("testimonial_1_quote"),
      name: t("testimonial_1_name"),
      company: t("testimonial_1_company"),
    },
    {
      avatar: photo5,
      quote: t("testimonial_2_quote"),
      name: t("testimonial_2_name"),
      company: t("testimonial_2_company"),
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            {t("your_cargo")}
            <br />
            <span className="text-blue-600">{t("controlled")}</span>{" "}
            {t("from_port_to_port")}
          </h1>
          <p className="hero-subtitle">{t("hero_description")}</p>
          <div className="hero-cta">
            <Link to="/book" className="cta-button">
              <span>{t("get_started")}</span>
              <ArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt={t("hero_image_alt")} className="hero-img" />
        </div>
      </section>

      {/* Stats Banner */}
      <div className="stats-banner">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Services Grid */}
      <section className="services-section">
        <h2 className="section-title">{t("our_key_solutions")}</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-image-container">
                <img
                  src={service.img}
                  alt={service.title}
                  className="service-image"
                />
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <Link to="/services" className="service-link">
                {t("learn_more")} <ChevronRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="process-content">
          <h2 className="section-title">{t("simplified_process")}</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <Package className="step-icon" />
              <h3>{t("step_1_title")}</h3>
              <p>{t("step_1_desc")}</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <Ship className="step-icon" />
              <h3>{t("step_2_title")}</h3>
              <p>{t("step_2_desc")}</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <MapPin className="step-icon" />
              <h3>{t("step_3_title")}</h3>
              <p>{t("step_3_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2 className="section-title">{t("trusted_by_clients")}</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-content">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="client-avatar"
                />
                <p className="testimonial-quote">"{testimonial.quote}"</p>
                <div className="client-info">
                  <span className="client-name">{testimonial.name}</span>
                  <span className="client-company">{testimonial.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
