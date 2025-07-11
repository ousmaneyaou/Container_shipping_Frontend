import React from "react";
import "../Styles/Footer.css";
import { FaFacebook, FaTwitter, FaInstagram, FaTiktok } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__grid">
        <div>
          <h3 className="footer__title">{t("footer_easy_access")}</h3>
          <ul className="footer__list">
            <li>
              <a href="#">{t("footer_dashboard")}</a>
            </li>
            <li>
              <a href="#">{t("footer_track_container")}</a>
            </li>
            <li>
              <a href="#">{t("footer_customs_documents")}</a>
            </li>
            <li>
              <a href="#">{t("footer_book_shipping")}</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="footer__title">{t("footer_connect_with_us")}</h3>
          <ul className="footer__list social-icons">
            <li>
              <a href="#">
                <FaFacebook />
              </a>
            </li>
            <li>
              <a href="#">
                <FaTwitter />
              </a>
            </li>
            <li>
              <a href="#">
                <FaInstagram />
              </a>
            </li>
            <li>
              <a href="#">
                <FaTiktok />
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="footer__title">{t("footer_useful_links")}</h3>
          <ul className="footer__list">
            <li>
              <a href="#">{t("footer_pricing_fees")}</a>
            </li>
            <li>
              <a href="#">{t("footer_insurance_options")}</a>
            </li>
            <li>
              <a href="#">{t("footer_faqs")}</a>
            </li>
            <li>
              <a href="#">{t("footer_customer_support")}</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="footer__title">{t("footer_about")}</h3>
          <ul className="footer__list">
            <li>
              <a href="#">{t("footer_about_us")}</a>
            </li>
            <li>
              <a href="#">{t("footer_careers")}</a>
            </li>
            <li>
              <a href="#">{t("footer_partners")}</a>
            </li>
            <li>
              <a href="#">{t("footer_terms_conditions")}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p>
          &copy; {currentYear} Deshipping Container Logistics.{" "}
          {t("footer_all_rights_reserved")}
        </p>
        <p>
          <a href="#">{t("footer_privacy_policy")}</a> |{" "}
          <a href="#">{t("footer_cookie_policy")}</a> |{" "}
          <a href="#">{t("footer_service_terms")}</a> |{" "}
          <a href="#">{t("footer_compliance_notice")}</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
