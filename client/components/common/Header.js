import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import isInternalLink from "../../utils/check-internal-links";
import getAssetPath from "../../utils/get-asset-path";
import getText from "../../utils/get-text";
import shouldLinkBeShown from "../../utils/should-link-be-shown";
import getHtml from "../../utils/get-html";
import "./Header.css";

const UnifiedHeader = ({
  header,
  languages,
  language,
  orgSlug,
  setLanguage,
  location,
  isAuthenticated,
  userData,
}) => {
  const [menu, setMenu] = useState(false);
  const [stickyMsg, setStickyMsg] = useState(true);

  const handleHamburger = () => setMenu(!menu);
  const handleKeyUp = (e) => {
    if (e.keyCode === 13) setMenu(!menu);
  };

  const { logo, links, second_logo: secondLogo, sticky_html: stickyHtml } = header;
  const { pathname } = location;
  const internalLinks = [`/${orgSlug}/login`, `/${orgSlug}/registration`];

  const renderLogo = (l) =>
    l && l.url ? (
      <img
        src={getAssetPath(orgSlug, l.url)}
        alt={l.alternate_text}
        className="unified-logo"
      />
    ) : null;

  const renderStickyMsg = () => {
    return stickyMsg && stickyHtml ? (
      <div className="sticky-container" role="banner">
        <div className="inner">
          {getHtml(stickyHtml, language, "sticky-msg")}
          <button
            type="button"
            className="close-sticky-btn"
            onClick={() => setStickyMsg(false)}
          >
            ✖
          </button>
        </div>
      </div>
    ) : null;
  };

  const renderLinks = () => {
    if (!links) return null;
    return links.map((link, index) => {
      if (!shouldLinkBeShown(link, isAuthenticated, userData)) return null;

      if (isInternalLink(link.url) && (internalLinks.indexOf(link.url) < 0 || !isAuthenticated)) {
        return (
          <Link
            className={`unified-link button ${
              pathname === link.url.replace("{orgSlug}", orgSlug) ? "active" : ""
            }`}
            to={link.url.replace("{orgSlug}", orgSlug)}
            key={index}
          >
            {getText(link.text, language)}
          </Link>
        );
      }
      return (
        <a
          href={link.url}
          className="unified-link button"
          target="_blank"
          rel="noreferrer noopener"
          key={link.url}
        >
          {getText(link.text, language)}
        </a>
      );
    });
  };

  const renderLanguages = (className) => (
    <div className={className}>
      {languages.map((lang) => (
        <button
          type="button"
          className={`header-language-btn ${language === lang.slug ? "active " : ""}`}
          key={lang.slug}
          onClick={() => setLanguage(lang.slug)}
        >
          {lang.text}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <div className="unified-header-container">
        <div className="unified-top-row">
          <div className="unified-logos">
            {logo && logo.url && (
              <Link to={`/${orgSlug}`}>{renderLogo(logo)}</Link>
            )}
            {secondLogo && renderLogo(secondLogo)}
          </div>
          
          <div className="unified-controls">
            {renderLanguages("unified-desktop-langs")}
            <div
              role="button"
              tabIndex={0}
              className="unified-hamburger"
              onClick={handleHamburger}
              onKeyUp={handleKeyUp}
              aria-label={getText({ en: "Menu Button" }, language)}
            >
              <div className={`${menu ? "rot45" : ""}`} />
              <div className={`${menu ? "rot-45" : ""}`} />
              <div className={`${menu ? "opacity-hidden" : ""}`} />
            </div>
          </div>
        </div>

        <div className={`unified-nav-row ${menu ? "open" : ""}`}>
          <div className="unified-links">{renderLinks()}</div>
          {renderLanguages("unified-mobile-langs")}
        </div>
      </div>
      {renderStickyMsg()}
    </>
  );
};

UnifiedHeader.defaultProps = {
  isAuthenticated: false,
};

UnifiedHeader.propTypes = {
  header: PropTypes.shape({
    logo: PropTypes.shape({
      alternate_text: PropTypes.string,
      url: PropTypes.string,
    }),
    second_logo: PropTypes.shape({
      alternate_text: PropTypes.string,
      url: PropTypes.string,
    }),
    links: PropTypes.array,
    sticky_html: PropTypes.object,
  }).isRequired,
  language: PropTypes.string.isRequired,
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string,
      text: PropTypes.string,
    }),
  ).isRequired,
  setLanguage: PropTypes.func.isRequired,
  orgSlug: PropTypes.string.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  isAuthenticated: PropTypes.bool,
  userData: PropTypes.object.isRequired,
};

export default UnifiedHeader;
