import React from "react";
import "../../Styles/help.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Ship,
  MapPin,
  Package,
  Clock,
  FileText,
  CreditCard,
  Shield,
  Globe,
  Users,
  Anchor,
  BarChart2,
  HelpCircle,
} from "lucide-react";

const Help = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const steps = [
    {
      icon: <Package className="icon" />,
      title: t("help_step1_title"),
      description: t("help_step1_desc"),
      tips: [t("help_step1_tip1"), t("help_step1_tip2")],
    },
    {
      icon: <Shield className="icon" />,
      title: t("help_step2_title"),
      description: t("help_step2_desc"),
      tips: [t("help_step2_tip1"), t("help_step2_tip2")],
    },
    {
      icon: <Ship className="icon" />,
      title: t("help_step3_title"),
      description: t("help_step3_desc"),
      tips: [t("help_step3_tip1"), t("help_step3_tip2")],
    },
    {
      icon: <Globe className="icon" />,
      title: t("help_step4_title"),
      description: t("help_step4_desc"),
      tips: [t("help_step4_tip1"), t("help_step4_tip2")],
    },
    {
      icon: <CreditCard className="icon" />,
      title: t("help_step5_title"),
      description: t("help_step5_desc"),
      tips: [t("help_step5_tip1"), t("help_step5_tip2")],
    },
  ];

  const faq = [
    {
      question: t("faq_q1"),
      answer: t("faq_a1"),
    },
    {
      question: t("faq_q2"),
      answer: t("faq_a2"),
    },
    {
      question: t("faq_q3"),
      answer: t("faq_a3"),
    },
    {
      question: t("faq_q4"),
      answer: t("faq_a4"),
    },
  ];

  return (
    <div className="help-container">
      <div className="help-header">
        <HelpCircle size={48} className="header-icon" />
        <h1 className="help-title">{t("help_title")}</h1>
        <p className="help-subtitle">{t("help_subtitle")}</p>
      </div>

      <div className="steps-grid">
        {steps.map((step, index) => (
          <div key={index} className="step-card">
            <div className="step-icon">{step.icon}</div>
            <h2 className="step-title">{step.title}</h2>
            <p className="step-description">{step.description}</p>
            <ul className="step-tips">
              {step.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="faq-section">
        <h2 className="faq-title">
          <HelpCircle size={24} /> {t("faq_title")}
        </h2>
        <div className="faq-list">
          {faq.map((item, index) => (
            <div key={index} className="faq-item">
              <h3 className="faq-question">{item.question}</h3>
              <p className="faq-answer">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="stats-cta">
        <div className="stat-item">
          <BarChart2 size={32} />
          <span>{t("help_stat1")}</span>
        </div>
        <div className="stat-item">
          <Users size={32} />
          <span>{t("help_stat2")}</span>
        </div>
        <button className="cta-button" onClick={() => navigate("/")}>
          {t("help_cta")}
        </button>
      </div>
    </div>
  );
};

export default Help;
